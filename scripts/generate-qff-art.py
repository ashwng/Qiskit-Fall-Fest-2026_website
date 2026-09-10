#!/usr/bin/env python3
"""Regenerate src/components/ui/qff-art.tsx from the official QFF 2026 stickers.

The brand stickers ship as die-cut badges — a white ring, a periwinkle disc, an
alpha mask, then the bird — and the animated backgrounds need the bird alone,
on transparent, with a tight viewBox. This strips the framing, namespaces the
gradient/mask ids so every symbol can share one document, and emits <symbol>s.

Usage:
    git clone https://github.com/Qiskit-Fall-Fest-2026/materials-resources
    python3 scripts/generate-qff-art.py path/to/materials-resources

Re-run it only when the upstream brand art changes; the output is committed.
"""

import re
import sys
import xml.etree.ElementTree as ET

if len(sys.argv) < 2:
    sys.exit(__doc__)

RESOURCES = sys.argv[1].rstrip("/")
SRC = f"{RESOURCES}/00_Deliverables/Stickers/SVG/"
OUT = "src/components/ui/qff-art.tsx"

SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)


NUM = re.compile(r"-?\d*\.?\d+(?:e-?\d+)?")
CMD = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)")


def path_points(d):
    """Approximate point cloud for a path: every coordinate pair, absolute only.

    Good enough for a bounding box on flat vector art — control points sit close
    to the curve for these shapes.
    """
    pts = []
    x = y = 0.0
    start = None
    for cmd, argstr in CMD.findall(d):
        args = [float(n) for n in NUM.findall(argstr)]
        up = cmd.upper()
        rel = cmd.islower()
        if up == "Z":
            if start:
                x, y = start
            continue
        if up == "H":
            for a in args:
                x = x + a if rel else a
                pts.append((x, y))
            continue
        if up == "V":
            for a in args:
                y = y + a if rel else a
                pts.append((x, y))
            continue
        step = {"M": 2, "L": 2, "T": 2, "C": 6, "S": 4, "Q": 4, "A": 7}[up]
        for i in range(0, len(args) - step + 1, step):
            chunk = args[i:i + step]
            if up == "A":
                nx, ny = chunk[5], chunk[6]
                if rel:
                    nx, ny = x + nx, y + ny
                pts.append((nx, ny))
                x, y = nx, ny
                continue
            # every (x, y) pair in the chunk, including control points
            base_x, base_y = x, y
            for j in range(0, step, 2):
                px, py = chunk[j], chunk[j + 1]
                if rel:
                    px, py = base_x + px, base_y + py
                pts.append((px, py))
            x, y = pts[-1]
            if up == "M" and start is None:
                start = (x, y)
        if up == "M":
            start = (x, y)
    return pts


def bbox(pts):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)



# attribute name -> JSX prop name (anything not listed passes through)
ATTR = {
    "stop-color": "stopColor",
    "stop-opacity": "stopOpacity",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "clip-path": "clipPath",
    "gradientTransform": "gradientTransform",
    "xlink:href": "xlinkHref",
}


def jsx_attrs(el, rename):
    out = []
    for k, v in el.attrib.items():
        if k.startswith(f"{{{XLINK}}}"):
            k = "xlinkHref"
        k = k.split("}")[-1] if "}" in k else k
        if k == "style":
            # only ever "mask-type:alpha" in these files
            props = dict(p.split(":", 1) for p in v.strip(";").split(";") if ":" in p)
            body = ", ".join(
                f'{re.sub(r"-(.)", lambda m: m.group(1).upper(), a)}: "{b.strip()}"'
                for a, b in props.items()
            )
            out.append(f"style={{{{ {body} }}}}")
            continue
        v = rename(v)
        out.append(f'{ATTR.get(k, k)}="{v}"')
    return (" " + " ".join(out)) if out else ""


def to_jsx(el, rename, indent):
    tag = el.tag.split("}")[-1]
    kids = list(el)
    pad = "  " * indent
    attrs = jsx_attrs(el, rename)
    if not kids:
        return f"{pad}<{tag}{attrs} />"
    inner = "\n".join(to_jsx(k, rename, indent + 1) for k in kids)
    return f"{pad}<{tag}{attrs}>\n{inner}\n{pad}</{tag}>"


def collect_points(nodes):
    pts = []
    for n in nodes:
        for p in ([n] if n.tag.endswith("path") else n.iter(f"{{{SVG}}}path")):
            if p.get("d"):
                pts.extend(path_points(p.get("d")))
    return pts


def build(name, prefix, pick, pad=2):
    """pick(children_of_container) -> list of nodes making up one figure."""
    root = ET.parse(SRC + name).getroot()
    defs = root.find(f"{{{SVG}}}defs")

    container = root
    for g in root.iter(f"{{{SVG}}}g"):
        if "mask0" in (g.get("mask") or ""):
            container = g
            break

    nodes = pick(list(container))

    # namespace every id this figure references
    ids = set()
    for n in nodes:
        for e in ([n] + list(n.iter())):
            if e.get("id"):
                ids.add(e.get("id"))
    if defs is not None:
        for e in defs:
            if e.get("id"):
                ids.add(e.get("id"))

    # Namespace ids and the references to them, in place and exactly once —
    # renaming again at serialisation time would double-prefix and orphan the
    # gradients.
    ref = re.compile(r"#(" + "|".join(re.escape(i) for i in sorted(ids, key=len, reverse=True)) + r")\b")
    targets = nodes + ([defs] if defs is not None else [])
    for n in targets:
        for e in [n] + list(n.iter()):
            if e.get("id") in ids:
                e.set("id", f"{prefix}-{e.get('id')}")
            for k, v in list(e.attrib.items()):
                if "#" in v:
                    e.set(k, ref.sub(lambda m: f"#{prefix}-{m.group(1)}", v))

    def rename(v):
        return v

    # only keep gradients this figure actually uses
    body_xml = " ".join(ET.tostring(n, encoding="unicode") for n in nodes)
    used = set(re.findall(r"url\(#([^)]+)\)", body_xml))
    kept_defs = [e for e in (defs if defs is not None else []) if e.get("id") in used]

    pts = collect_points(nodes)
    x0, y0, x1, y1 = bbox(pts)
    vb = f"{x0 - pad:.1f} {y0 - pad:.1f} {x1 - x0 + 2 * pad:.1f} {y1 - y0 + 2 * pad:.1f}"

    parts = []
    if kept_defs:
        inner = "\n".join(to_jsx(d, rename, 4) for d in kept_defs)
        parts.append(f"      <defs>\n{inner}\n      </defs>")
    parts += [to_jsx(n, rename, 3) for n in nodes]
    body = "\n".join(parts)
    return f'      <symbol id="{prefix}" viewBox="{vb}">\n{body}\n      </symbol>'


def simple_path(name, prefix, pad=1):
    root = ET.parse(SRC + name).getroot()
    p = root.find(f"{{{SVG}}}path")
    x0, y0, x1, y1 = bbox(path_points(p.get("d")))
    vb = f"{x0 - pad:.1f} {y0 - pad:.1f} {x1 - x0 + 2 * pad:.1f} {y1 - y0 + 2 * pad:.1f}"
    return (f'      <symbol id="{prefix}" viewBox="{vb}">\n'
            f'        <path d="{p.get("d")}" fill="currentColor" />\n'
            f"      </symbol>")


symbols = [
    # Sticker 02: two gliding birds sharing one badge. 0,1 are clouds.
    build("Sticker 02.svg", "qff-bird-glide", lambda c: c[2:10]),
    build("Sticker 02.svg", "qff-bird-soar", lambda c: c[10:18]),
    # Sticker 05: eagle. Index 0 is the pink die-cut outline.
    build("Sticker 05.svg", "qff-bird-eagle", lambda c: c[1:]),
    # Sticker 04: hummingbird pair. First and last children are clouds.
    build("Sticker 04.svg", "qff-bird-hummingbirds", lambda c: c[1:19]),
    simple_path("cloud1.svg", "qff-cloud-a"),
    simple_path("cloud2.svg", "qff-cloud-b"),
]

meta_rows = []
for s in symbols:
    sid, vb = re.search(r'id="([^"]+)" viewBox="([^"]+)"', s).groups()
    w, h = (float(v) for v in vb.split()[2:])
    key = sid.replace("qff-", "")
    meta_rows.append(f'  "{key}": {{ id: "{sid}", aspect: {w / h:.4f} }},')

meta = ("""/** Intrinsic aspect ratio (w/h) of each symbol, so scenes can size a bird
 *  from one dimension without letterboxing it inside its <svg> box. */
export const QFF_ART = {
"""
        + "\n".join(meta_rows)
        + """
} as const;

export type QffArtName = keyof typeof QFF_ART;

""")

header = meta + '''/**
 * Official Qiskit Fall Fest 2026 artwork, lifted from the brand sticker set
 * (Qiskit-Fall-Fest-2026/materials-resources) and re-cut as <symbol>s so the
 * animated backgrounds can place each bird freely.
 *
 * Generated — do not hand-edit. The badge rings, framing discs and baked-in
 * clouds were stripped; gradient and mask ids are namespaced per symbol.
 *
 * Render <QffArtDefs /> once per page, then reference a bird with
 * <use href="#qff-bird-glide" x={0} y={0} width={120} height={90} />.
 */
export function QffArtDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute" focusable="false">
'''

with open(OUT, "w") as f:
    f.write(header + "\n".join(symbols) + "\n    </svg>\n  );\n}\n")

print("wrote", OUT)
for s in symbols:
    print(re.search(r'id="([^"]+)" viewBox="([^"]+)"', s).groups())

# Brand assets

## Qiskit Fall Fest 2026 (`qiskit.svg`, `fall-fest.svg`, `2026.svg`)

Taken unmodified from the official Qiskit Fall Fest 2026 sticker pack:
<https://github.com/Qiskit-Fall-Fest-2026/materials-resources>
(`00_Deliverables/Stickers/SVG/`).

The same pack is the source for the birds and clouds in
`src/components/ui/qff-art.tsx`, which `scripts/generate-qff-art.py`
regenerates from it.

That material is MIT licensed, and the licence requires its notice to travel
with any copy, so it is reproduced in full below.

```
MIT License

Copyright (c) 2026 Qiskit Fall Fest 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## qBITS (`qbits.png`)

The society's own logo, cropped to its wordmark. Not covered by the licence
above.

## IBM

There is deliberately no IBM asset here. The eight-bar logo is an IBM
trademark and is not part of the Fall Fest pack, so `BrandMarks.tsx` sets
"IBM" in IBM Plex instead of approximating the mark. If the organisers obtain
an approved logo, add it as `ibm.svg` and swap the span in that component for
an `<Image>`.

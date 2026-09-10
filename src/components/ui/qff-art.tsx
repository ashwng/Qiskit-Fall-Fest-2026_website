/** Intrinsic aspect ratio (w/h) of each symbol, so scenes can size a bird
 *  from one dimension without letterboxing it inside its <svg> box. */
export const QFF_ART = {
  "bird-glide": { id: "qff-bird-glide", aspect: 1.6060 },
  "bird-soar": { id: "qff-bird-soar", aspect: 1.3756 },
  "bird-eagle": { id: "qff-bird-eagle", aspect: 0.9450 },
  "bird-hummingbirds": { id: "qff-bird-hummingbirds", aspect: 1.0643 },
  "cloud-a": { id: "qff-cloud-a", aspect: 3.1181 },
  "cloud-b": { id: "qff-cloud-b", aspect: 3.6810 },
} as const;

export type QffArtName = keyof typeof QFF_ART;

/**
 * Official Qiskit Fall Fest 2026 artwork, lifted from the brand sticker set
 * (Qiskit-Fall-Fest-2026/materials-resources) and re-cut as <symbol>s so the
 * animated backgrounds can place each bird freely.
 *
 * MIT licensed by Qiskit Fall Fest 2026 — see public/brand/README.md.
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
      <symbol id="qff-bird-glide" viewBox="169.4 120.2 155.3 96.7">
      <defs>
        <linearGradient id="qff-bird-glide-paint0_linear_4407_1521" x1="264.806" y1="122.895" x2="314.413" y2="149.712" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7EB6" />
          <stop offset="0.28" stopColor="#FB76B0" />
          <stop offset="0.7" stopColor="#F361A0" />
          <stop offset="0.92" stopColor="#EE5396" />
        </linearGradient>
        <linearGradient id="qff-bird-glide-paint1_linear_4407_1521" x1="236.762" y1="114.336" x2="236.762" y2="204.212" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7EB6" />
          <stop offset="0.13" stopColor="#CF65A1" />
          <stop offset="0.29" stopColor="#9F4C8D" />
          <stop offset="0.44" stopColor="#77377C" />
          <stop offset="0.59" stopColor="#58276F" />
          <stop offset="0.73" stopColor="#421C65" />
          <stop offset="0.87" stopColor="#35155F" />
          <stop offset="1" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-glide-paint2_linear_4407_1521" x1="215.635" y1="166.704" x2="238.386" y2="171.572" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor="#FF7EB6" stopOpacity="0" />
          <stop offset="0.33" stopColor="#FF7EB6" stopOpacity="0.02" />
          <stop offset="0.42" stopColor="#FF7EB6" stopOpacity="0.07" />
          <stop offset="0.52" stopColor="#FF7EB6" stopOpacity="0.16" />
          <stop offset="0.62" stopColor="#FF7EB6" stopOpacity="0.28" />
          <stop offset="0.73" stopColor="#FF7EB6" stopOpacity="0.44" />
          <stop offset="0.83" stopColor="#FF7EB6" stopOpacity="0.64" />
          <stop offset="0.94" stopColor="#FF7EB6" stopOpacity="0.87" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
        <linearGradient id="qff-bird-glide-paint3_linear_4407_1521" x1="227.502" y1="166.566" x2="250.225" y2="171.407" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor="#FF7EB6" stopOpacity="0" />
          <stop offset="0.33" stopColor="#FF7EB6" stopOpacity="0.02" />
          <stop offset="0.43" stopColor="#FF7EB6" stopOpacity="0.07" />
          <stop offset="0.52" stopColor="#FF7EB6" stopOpacity="0.16" />
          <stop offset="0.62" stopColor="#FF7EB6" stopOpacity="0.28" />
          <stop offset="0.73" stopColor="#FF7EB6" stopOpacity="0.44" />
          <stop offset="0.83" stopColor="#FF7EB6" stopOpacity="0.64" />
          <stop offset="0.94" stopColor="#FF7EB6" stopOpacity="0.87" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
      </defs>
      <path d="M181.764 128.92C175.684 128.92 171.723 132.058 171.723 138.442C177.747 133.599 184.68 132.14 184.68 132.14L181.736 128.92H181.764Z" fill="#4A1D8B" />
      <path d="M183.141 132.553C178.245 132.553 171.367 131.453 171.367 131.453C173.32 136.213 177.832 136.461 185.425 136.461L183.141 132.553Z" fill="#31135E" />
      <path d="M299.079 131.976C299.079 131.976 261.225 149.78 233.936 149.78C206.646 149.78 197.513 144.964 192.231 142.075C186.949 139.186 183.895 135.663 181.805 128.921C181.805 128.921 186.784 122.179 199.136 122.179H256.851C279.052 122.179 299.079 131.976 299.079 131.976Z" fill="#FF7EB6" />
      <path d="M256.828 122.179C279.028 122.179 299.055 131.976 299.055 131.976L322.659 143.231L319.193 149.588C317.349 153.413 314.323 154.238 310.307 151.211C305.053 147.221 279.276 129.527 260.074 129.527H256.828" fill="url(#qff-bird-glide-paint0_linear_4407_1521)" />
      <path d="M191.697 132.746C192.974 132.746 194.008 131.711 194.008 130.435C194.008 129.158 192.974 128.123 191.697 128.123C190.421 128.123 189.387 129.158 189.387 130.435C189.387 131.711 190.421 132.746 191.697 132.746Z" fill="#31135E" />
      <path d="M217.891 122.179V214.889C217.891 214.889 255.661 203.579 255.661 164.53V122.179H217.891Z" fill="url(#qff-bird-glide-paint1_linear_4407_1521)" />
      <mask id="qff-bird-glide-mask1_4407_1521" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="217" y="122" width="39" height="93">
        <path d="M217.891 122.179V214.889C217.891 214.889 255.661 203.579 255.661 164.53V122.179H217.891Z" fill="white" />
      </mask>
      <g mask="url(#qff-bird-glide-mask1_4407_1521)">
        <path d="M230.49 122.179H217.891V214.889H230.49V122.179Z" fill="url(#qff-bird-glide-paint2_linear_4407_1521)" />
        <path d="M243.072 122.179H230.473V214.889H243.072V122.179Z" fill="url(#qff-bird-glide-paint3_linear_4407_1521)" />
      </g>
      </symbol>
      <symbol id="qff-bird-soar" viewBox="73.7 159.1 155.3 112.9">
      <defs>
        <linearGradient id="qff-bird-soar-paint4_linear_4407_1521" x1="141.114" y1="251.763" x2="141.114" y2="170.722" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7EB6" />
          <stop offset="0.13" stopColor="#CF65A1" />
          <stop offset="0.29" stopColor="#9F4C8D" />
          <stop offset="0.44" stopColor="#77377C" />
          <stop offset="0.59" stopColor="#58276F" />
          <stop offset="0.73" stopColor="#421C65" />
          <stop offset="0.87" stopColor="#35155F" />
          <stop offset="1" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-soar-paint5_linear_4407_1521" x1="120.867" y1="201.157" x2="141.225" y2="196.812" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor="#FF7EB6" stopOpacity="0" />
          <stop offset="0.33" stopColor="#FF7EB6" stopOpacity="0.02" />
          <stop offset="0.42" stopColor="#FF7EB6" stopOpacity="0.07" />
          <stop offset="0.52" stopColor="#FF7EB6" stopOpacity="0.16" />
          <stop offset="0.62" stopColor="#FF7EB6" stopOpacity="0.28" />
          <stop offset="0.73" stopColor="#FF7EB6" stopOpacity="0.44" />
          <stop offset="0.83" stopColor="#FF7EB6" stopOpacity="0.64" />
          <stop offset="0.94" stopColor="#FF7EB6" stopOpacity="0.87" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
        <linearGradient id="qff-bird-soar-paint6_linear_4407_1521" x1="132.804" y1="201.295" x2="153.162" y2="196.949" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor="#FF7EB6" stopOpacity="0" />
          <stop offset="0.33" stopColor="#FF7EB6" stopOpacity="0.02" />
          <stop offset="0.43" stopColor="#FF7EB6" stopOpacity="0.07" />
          <stop offset="0.52" stopColor="#FF7EB6" stopOpacity="0.16" />
          <stop offset="0.62" stopColor="#FF7EB6" stopOpacity="0.28" />
          <stop offset="0.73" stopColor="#FF7EB6" stopOpacity="0.44" />
          <stop offset="0.83" stopColor="#FF7EB6" stopOpacity="0.64" />
          <stop offset="0.94" stopColor="#FF7EB6" stopOpacity="0.87" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
        <linearGradient id="qff-bird-soar-paint7_linear_4407_1521" x1="169.11" y1="238.665" x2="218.745" y2="265.482" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7EB6" />
          <stop offset="0.28" stopColor="#FB76B0" />
          <stop offset="0.7" stopColor="#F361A0" />
          <stop offset="0.93" stopColor="#EE5396" />
        </linearGradient>
      </defs>
      <path d="M122.215 244.719V161.118C122.215 161.118 159.986 172.428 159.986 211.476V244.719H122.215Z" fill="url(#qff-bird-soar-paint4_linear_4407_1521)" />
      <mask id="qff-bird-soar-mask2_4407_1521" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="122" y="161" width="38" height="84">
        <path d="M122.215 244.719V161.118C122.215 161.118 159.986 172.428 159.986 211.476V244.719H122.215Z" fill="white" />
      </mask>
      <g mask="url(#qff-bird-soar-mask2_4407_1521)">
        <path d="M134.814 161.09H122.215V237.977H134.814V161.09Z" fill="url(#qff-bird-soar-paint5_linear_4407_1521)" />
        <path d="M147.412 161.09H134.812V237.977H147.412V161.09Z" fill="url(#qff-bird-soar-paint6_linear_4407_1521)" />
      </g>
      <path d="M86.1231 244.718C80.0434 244.718 76.082 247.855 76.082 254.24C82.1067 249.396 89.0391 247.938 89.0391 247.938L86.0955 244.718H86.1231Z" fill="#4A1D8B" />
      <path d="M87.4773 248.351C82.5805 248.351 75.7031 247.25 75.7031 247.25C77.6563 252.011 82.168 252.258 89.7606 252.258L87.4773 248.351Z" fill="#31135E" />
      <path d="M203.399 247.746C203.399 247.746 165.545 265.55 138.256 265.55C110.966 265.55 101.833 260.734 96.5512 257.845C91.2693 254.956 88.2157 251.433 86.125 244.691C86.125 244.691 91.1043 237.949 103.456 237.949H122.245C142.96 245.544 143.235 237.949 160.016 237.949H161.172C183.372 237.949 203.399 247.746 203.399 247.746Z" fill="#FF7EB6" />
      <path d="M161.16 237.977C183.36 237.977 203.388 247.774 203.388 247.774L226.991 259.029L223.525 265.385C221.681 269.21 218.655 270.036 214.639 267.009C209.385 263.019 183.608 245.324 164.406 245.324H161.16" fill="url(#qff-bird-soar-paint7_linear_4407_1521)" />
      <path d="M96.0453 248.516C97.3215 248.516 98.3561 247.481 98.3561 246.205C98.3561 244.928 97.3215 243.893 96.0453 243.893C94.769 243.893 93.7344 244.928 93.7344 246.205C93.7344 247.481 94.769 248.516 96.0453 248.516Z" fill="#31135E" />
      </symbol>
      <symbol id="qff-bird-eagle" viewBox="26.5 20.8 324.8 343.7">
      <defs>
        <linearGradient id="qff-bird-eagle-paint0_linear_4407_1780" x1="114.055" y1="320.994" x2="273.92" y2="320.994" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="1" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint1_linear_4407_1780" x1="303.314" y1="336.631" x2="300.654" y2="349.436" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="0.12" stopColor="#431A7F" />
          <stop offset="0.42" stopColor="#361567" />
          <stop offset="0.61" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint2_linear_4407_1780" x1="293.418" y1="350.568" x2="291.201" y2="361.305" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="0.12" stopColor="#431A7F" />
          <stop offset="0.42" stopColor="#361567" />
          <stop offset="0.61" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint3_linear_4407_1780" x1="238.763" y1="127.293" x2="262.624" y2="147.355" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint4_linear_4407_1780" x1="247.895" y1="153.74" x2="270.524" y2="172.744" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint5_linear_4407_1780" x1="229.556" y1="100.919" x2="254.696" y2="122.064" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
      </defs>
      <path d="M114.053 334.637L124.491 324.196L114.053 313.755L124.491 303.314L114.053 292.873L136.061 270.858C130.621 276.251 123.137 279.6 114.89 279.6H71.6621C65.5078 279.6 59.6243 282.038 55.267 286.372L47.6602 293.981L54.6023 311.686C80.1305 317.99 95.221 343.97 135.544 356.135C143.373 358.647 159.005 362.463 179.338 362.463" fill="#F4F4F4" />
      <path d="M54.5765 311.661C43.2033 308.804 28.5312 309.469 28.5312 319.196V311.587L34.1687 308.484H63.4388C57.9245 309.691 54.6011 311.661 54.6011 311.661H54.5765Z" fill="#0F62FE" />
      <path d="M28.5312 319.197V310.283C28.5312 299.004 39.1414 293.956 47.659 293.956C52.5825 306.54 63.4388 308.485 63.4388 308.485H43.7203C28.5314 308.485 28.5312 319.197 28.5312 319.197Z" fill="#A56EFF" />
      <path d="M60.7266 296.763H67.0532C70.1797 296.763 72.7152 294.227 72.7152 291.099V290.582H65.724C62.9668 290.582 60.7266 292.823 60.7266 295.606C60.7266 296.344 60.7266 296.861 60.7266 296.788V296.763Z" fill="#A56EFF" />
      <path d="M69.6371 293.66C69.6371 295.359 68.2585 296.763 66.5353 296.763C64.812 296.763 63.4336 295.384 63.4336 293.66C63.4336 291.936 64.812 290.557 66.5353 290.557C68.2585 290.557 69.6371 291.936 69.6371 293.66Z" fill="#343A3F" />
      <path d="M291.859 182.158C305.423 168.589 313.03 150.219 313.03 131.036V22.9314L155.577 180.434C148.758 187.255 144.918 196.514 144.918 206.192V249.532C144.918 257.855 141.521 265.391 136.056 270.833L127.316 279.575H141.841C204.812 279.575 236.519 323.654 269.654 323.654V204.37L291.834 182.182L291.859 182.158Z" fill="#31135E" />
      <path d="M127.348 279.55L114.055 292.847L124.492 303.288L114.055 313.729L124.492 324.171L114.055 334.612L126.24 346.801C132.985 353.548 141.601 358.079 151.005 359.754C160.286 361.428 170.724 362.389 182.589 362.389H273.92V323.58H269.661C236.526 323.58 204.819 279.5 141.848 279.5H127.323L127.348 279.55Z" fill="url(#qff-bird-eagle-paint0_linear_4407_1780)" />
      <path d="M273.945 323.629H349.348V327.643C349.348 332.568 345.36 336.558 340.437 336.558H273.945V323.629Z" fill="#31135E" />
      <path d="M273.945 336.557H331.747V340.571C331.747 345.496 327.759 349.485 322.836 349.485H273.945V336.557Z" fill="url(#qff-bird-eagle-paint1_linear_4407_1780)" />
      <path d="M273.945 349.485H312.373V353.499C312.373 358.424 308.385 362.413 303.462 362.413H273.945V349.485Z" fill="url(#qff-bird-eagle-paint2_linear_4407_1780)" />
      <path d="M313.157 57.3083L170.672 199.839L187.904 217.101L313.034 91.9559L313.157 57.3083Z" fill="url(#qff-bird-eagle-paint3_linear_4407_1780)" />
      <path d="M313.032 91.9556L187.902 217.101L205.159 234.363L313.155 126.332L313.032 91.9556Z" fill="url(#qff-bird-eagle-paint4_linear_4407_1780)" />
      <path d="M313.156 22.7832L153.414 182.576L170.671 199.838L313.156 57.3077V22.7832Z" fill="url(#qff-bird-eagle-paint5_linear_4407_1780)" />
      <defs>
        <linearGradient id="qff-bird-eagle-paint0_linear_4407_1780" x1="114.055" y1="320.994" x2="273.92" y2="320.994" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="1" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint1_linear_4407_1780" x1="303.314" y1="336.631" x2="300.654" y2="349.436" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="0.12" stopColor="#431A7F" />
          <stop offset="0.42" stopColor="#361567" />
          <stop offset="0.61" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint2_linear_4407_1780" x1="293.418" y1="350.568" x2="291.201" y2="361.305" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1D8B" />
          <stop offset="0.12" stopColor="#431A7F" />
          <stop offset="0.42" stopColor="#361567" />
          <stop offset="0.61" stopColor="#31135E" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint3_linear_4407_1780" x1="238.763" y1="127.293" x2="262.624" y2="147.355" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint4_linear_4407_1780" x1="247.895" y1="153.74" x2="270.524" y2="172.744" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
        <linearGradient id="qff-bird-eagle-paint5_linear_4407_1780" x1="229.556" y1="100.919" x2="254.696" y2="122.064" gradientUnits="userSpaceOnUse">
          <stop offset="0.24" stopColor="#31135E" />
          <stop offset="0.58" stopColor="#32135F" />
          <stop offset="0.7" stopColor="#351466" />
          <stop offset="0.78" stopColor="#3C1772" />
          <stop offset="0.85" stopColor="#451B83" />
          <stop offset="0.91" stopColor="#511F99" />
          <stop offset="0.97" stopColor="#6025B3" />
          <stop offset="0.99" stopColor="#6929C4" />
        </linearGradient>
      </defs>
      </symbol>
      <symbol id="qff-bird-hummingbirds" viewBox="66.5 103.8 221.9 208.5">
      <defs>
        <linearGradient id="qff-bird-hummingbirds-paint0_linear_4407_1583" x1="269.056" y1="202.171" x2="255.272" y2="206.51" gradientUnits="userSpaceOnUse">
          <stop offset="0.09" stopColor="#A56EFF" />
          <stop offset="0.19" stopColor="#B671F0" />
          <stop offset="0.41" stopColor="#D676D7" />
          <stop offset="0.62" stopColor="#EC7AC4" />
          <stop offset="0.82" stopColor="#FA7DB9" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint1_linear_4407_1583" x1="270.993" y1="199.332" x2="260.917" y2="213.441" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A56EFE" />
          <stop offset="0.3" stopColor="#CC74DF" />
          <stop offset="0.58" stopColor="#E879C8" />
          <stop offset="0.82" stopColor="#F97CBA" />
          <stop offset="1" stopColor="#FF7EB6" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint2_linear_4407_1583" x1="221.394" y1="135.648" x2="253.148" y2="167.235" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7EB6" />
          <stop offset="0.18" stopColor="#F97CBA" />
          <stop offset="0.42" stopColor="#E879C8" />
          <stop offset="0.7" stopColor="#CC74DF" />
          <stop offset="1" stopColor="#A56EFF" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint3_linear_4407_1583" x1="286.588" y1="113.357" x2="252.391" y2="161.274" gradientUnits="userSpaceOnUse">
          <stop stopColor="#31135E" />
          <stop offset="0.12" stopColor="#2F1665" />
          <stop offset="0.3" stopColor="#2A207A" />
          <stop offset="0.52" stopColor="#23319C" />
          <stop offset="0.77" stopColor="#1948CA" />
          <stop offset="1" stopColor="#0F62FE" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint4_linear_4407_1583" x1="120.701" y1="135.539" x2="120.701" y2="318.633" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4BBFF" />
          <stop offset="0.2" stopColor="#D4BBFF" stopOpacity="0.73" />
          <stop offset="0.42" stopColor="#D4BBFF" stopOpacity="0.47" />
          <stop offset="0.61" stopColor="#D4BBFF" stopOpacity="0.27" />
          <stop offset="0.78" stopColor="#D4BBFF" stopOpacity="0.12" />
          <stop offset="0.91" stopColor="#D4BBFF" stopOpacity="0.03" />
          <stop offset="1" stopColor="#D4BBFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint5_linear_4407_1583" x1="140.46" y1="182.645" x2="156.342" y2="209.208" gradientUnits="userSpaceOnUse">
          <stop stopColor="#31135E" />
          <stop offset="0.13" stopColor="#2F1563" />
          <stop offset="0.29" stopColor="#2C1E74" />
          <stop offset="0.48" stopColor="#262C90" />
          <stop offset="0.69" stopColor="#1D3FB7" />
          <stop offset="0.92" stopColor="#1357E9" />
          <stop offset="1" stopColor="#0F62FE" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint6_linear_4407_1583" x1="143.305" y1="253.968" x2="157.055" y2="258.307" gradientUnits="userSpaceOnUse">
          <stop offset="0.09" stopColor="#A56EFF" />
          <stop offset="0.12" stopColor="#A772FF" />
          <stop offset="0.36" stopColor="#BB92FF" />
          <stop offset="0.59" stopColor="#C8A8FF" />
          <stop offset="0.81" stopColor="#D1B6FF" />
          <stop offset="1" stopColor="#D4BBFF" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint7_linear_4407_1583" x1="141.362" y1="251.129" x2="151.438" y2="265.239" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A56EFF" />
          <stop offset="0.23" stopColor="#B588FF" />
          <stop offset="0.54" stopColor="#C5A4FF" />
          <stop offset="0.8" stopColor="#D0B5FF" />
          <stop offset="1" stopColor="#D4BBFF" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint8_linear_4407_1583" x1="190.962" y1="187.447" x2="159.209" y2="219.033" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4BBFF" />
          <stop offset="0.2" stopColor="#D0B5FF" />
          <stop offset="0.46" stopColor="#C5A4FF" />
          <stop offset="0.77" stopColor="#B588FF" />
          <stop offset="1" stopColor="#A56EFF" />
        </linearGradient>
        <linearGradient id="qff-bird-hummingbirds-paint9_linear_4407_1583" x1="116.269" y1="174.098" x2="161.635" y2="211.442" gradientUnits="userSpaceOnUse">
          <stop stopColor="#31135E" />
          <stop offset="0.13" stopColor="#2F1563" />
          <stop offset="0.29" stopColor="#2C1E74" />
          <stop offset="0.48" stopColor="#262C90" />
          <stop offset="0.69" stopColor="#1D3FB7" />
          <stop offset="0.92" stopColor="#1357E9" />
          <stop offset="1" stopColor="#0F62FE" />
        </linearGradient>
      </defs>
      <path d="M228.09 145.882L201.035 129.164L201.279 129.059C202.743 128.393 204.382 128.393 205.846 129.059L231.018 141.291L228.125 145.847L228.09 145.882Z" fill="#31135E" />
      <path d="M258.109 210.968L255.738 206.902C259.538 204.694 262.641 201.68 264.942 198.175H269.858V204.204L258.109 211.003" fill="url(#qff-bird-hummingbirds-paint0_linear_4407_1583)" />
      <path d="M274.828 199.857C271.76 205.886 266.984 211.213 260.464 215.033L258.094 210.968C263.079 208.024 267.089 203.888 269.843 199.086L274.794 199.857H274.828Z" fill="url(#qff-bird-hummingbirds-paint1_linear_4407_1583)" />
      <path d="M239.075 173.921C239.075 173.711 238.936 173.185 238.762 172.414C238.866 172.905 238.971 173.43 239.075 173.921Z" fill="#D4BBFF" />
      <path d="M247.856 143.674L248.205 143.324L236.072 136.069C231.644 133.405 225.961 134.352 222.614 138.277C219.023 142.483 219.267 148.792 223.172 152.717L234.085 163.687C236.909 166.491 238.199 170.276 238.756 172.379C236.943 162.531 239.593 151.771 247.856 143.639V143.674Z" fill="url(#qff-bird-hummingbirds-paint2_linear_4407_1583)" />
      <path d="M260.784 150.86L248.198 143.324L247.85 143.675C239.587 151.806 236.937 162.566 238.75 172.415C238.959 173.186 239.029 173.711 239.064 173.922C241.818 185.733 251.092 195.967 264.863 198.28C264.863 198.245 264.933 198.21 264.968 198.14C264.968 198.175 264.898 198.21 264.863 198.28C265.003 198.28 265.142 198.351 265.282 198.351L274.8 199.823C283.167 183.315 278.53 161.479 260.784 150.825V150.86Z" fill="#FF7EB6" />
      <path d="M247.784 143.745L286.413 105.752C286.413 137.471 276.233 154.89 268.179 163.722C263.473 168.874 255.768 169.786 249.945 165.965C242.345 160.953 241.264 150.159 247.784 143.745Z" fill="url(#qff-bird-hummingbirds-paint3_linear_4407_1583)" />
      <path d="M229.899 146.619C231.42 146.619 232.653 145.38 232.653 143.85C232.653 142.321 231.42 141.082 229.899 141.082C228.378 141.082 227.145 142.321 227.145 143.85C227.145 145.38 228.378 146.619 229.899 146.619Z" fill="#31135E" />
      <path d="M156.611 258.665L126.384 310.292C78.5852 275.594 68.4746 207.144 114.495 166.663L153.857 215.135L137.54 249.938L156.611 258.665Z" fill="url(#qff-bird-hummingbirds-paint4_linear_4407_1583)" />
      <path d="M164.586 195.508L125.957 157.515C125.957 189.234 136.137 206.653 144.191 215.486C148.898 220.638 156.603 221.549 162.425 217.729C170.025 212.717 171.106 201.922 164.586 195.508Z" fill="url(#qff-bird-hummingbirds-paint5_linear_4407_1583)" />
      <path d="M184.3 197.645L211.354 180.927L211.11 180.822C209.646 180.156 208.007 180.156 206.543 180.822L181.371 193.054L184.265 197.61L184.3 197.645Z" fill="#31135E" />
      <path d="M154.234 262.765L156.604 258.7C152.804 256.492 149.701 253.478 147.4 249.973H142.484V256.001L154.234 262.8" fill="url(#qff-bird-hummingbirds-paint6_linear_4407_1583)" />
      <path d="M142.493 250.884C145.248 255.685 149.257 259.821 154.243 262.765L151.872 266.831C145.352 263.011 140.576 257.683 137.508 251.655L142.458 250.884H142.493Z" fill="url(#qff-bird-hummingbirds-paint7_linear_4407_1583)" />
      <path d="M173.273 225.684C173.273 225.474 173.413 224.948 173.587 224.177C173.483 224.667 173.378 225.193 173.273 225.684Z" fill="#D4BBFF" />
      <path d="M164.517 195.438L164.168 195.087L176.301 187.832C180.728 185.168 186.411 186.115 189.758 190.04C193.349 194.246 193.105 200.555 189.2 204.48L178.288 215.45C175.464 218.254 174.174 222.04 173.616 224.142C175.429 214.294 172.779 203.534 164.517 195.403V195.438Z" fill="url(#qff-bird-hummingbirds-paint8_linear_4407_1583)" />
      <path d="M151.558 202.658L164.143 195.123L164.492 195.473C172.755 203.604 175.405 214.364 173.592 224.213C173.382 224.984 173.313 225.51 173.278 225.72C170.524 237.531 161.25 247.766 147.478 250.079C147.478 250.044 147.409 250.009 147.374 249.939C147.374 249.974 147.444 250.009 147.478 250.079C147.339 250.079 147.2 250.149 147.06 250.149L137.542 251.621C129.175 235.113 133.812 213.278 151.558 202.623V202.658Z" fill="#D4BBFF" />
      <path d="M161.597 193.335L114.496 166.663C122.654 197.295 136.983 211.49 147.024 217.904C152.881 221.654 160.586 220.532 165.188 215.31C171.255 208.511 169.512 197.786 161.563 193.3L161.597 193.335Z" fill="url(#qff-bird-hummingbirds-paint9_linear_4407_1583)" />
      <path d="M182.449 198.381C183.971 198.381 185.204 197.142 185.204 195.613C185.204 194.083 183.971 192.844 182.449 192.844C180.928 192.844 179.695 194.083 179.695 195.613C179.695 197.142 180.928 198.381 182.449 198.381Z" fill="#31135E" />
      </symbol>
      <symbol id="qff-cloud-a" viewBox="-1.0 -1.0 449.0 144.0">
        <path d="M400.086 47.7847C391.773 47.7847 384.008 49.9451 377.242 53.7498C361.744 21.9255 329.104 0 291.341 0C256.446 0 225.9 18.7334 209.242 46.7207C194.936 34.4037 176.377 26.9555 156.046 26.9555C126.241 26.9555 100.142 42.9805 85.9007 66.8728H85.3208C76.7178 55.1362 62.895 47.4623 47.2357 47.4623C21.1368 47.4623 0 68.614 0 94.7311C0 120.848 21.1368 142 47.2357 142C49.0723 142 50.8444 141.871 52.6165 141.678H400.086C425.992 141.678 447 120.655 447 94.7311C447 68.8074 425.992 47.7847 400.086 47.7847Z" fill="currentColor" />
      </symbol>
      <symbol id="qff-cloud-b" viewBox="-1.0 -1.0 600.0 163.0">
        <path d="M535.266 36.0671C520.791 36.0671 507.499 40.9902 496.894 49.1954C474.753 19.3713 439.176 0 399.085 0C355.554 0 317.397 22.7961 295.937 57.0081C281.176 47.1262 263.405 41.347 244.309 41.347C217.331 41.347 193.04 52.8699 176.093 71.2067C162.837 61.1464 146.32 55.1174 128.335 55.1174C100.568 55.1174 76.2054 69.423 62.161 91.0418C55.6762 86.2614 47.6866 83.3718 38.9804 83.3718C17.448 83.3718 0 100.745 0 122.186C0 143.626 17.448 161 38.9804 161H535.266C569.911 161 598 133.031 598 98.5335C598 64.0361 569.911 36.0671 535.266 36.0671Z" fill="currentColor" />
      </symbol>
    </svg>
  );
}

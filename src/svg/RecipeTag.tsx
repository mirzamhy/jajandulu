// Ilustrasi recipe tag. Pola QR di sini dekoratif, bukan kode yang bisa dipindai.
function polaQr() {
  const sel: string[] = []
  let s = 9
  const acak = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      const pojok = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7)
      if (pojok) continue
      if (acak() > 0.52) sel.push(`M${x * 4} ${y * 4}h4v4h-4z`)
    }
  }
  return sel.join('')
}

const QR = polaQr()

function Pojok({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="12" height="12" fill="#3B2620" />
      <rect x="2" y="2" width="8" height="8" fill="#FFF8F1" />
      <rect x="4" y="4" width="4" height="4" fill="#3B2620" />
    </g>
  )
}

export function RecipeTag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 230" className={className} aria-hidden="true" focusable="false">
      <path d="M80 4 C70 30 90 40 80 58" stroke="#9A5A2E" strokeWidth="2.5" fill="none" />
      <path d="M20 40 L60 14 H100 L140 40 V214 Q140 224 130 224 H30 Q20 224 20 214Z" fill="#FFF8F1" stroke="#D9C3A6" strokeWidth="2" />
      <circle cx="80" cy="42" r="7" fill="#F3E6D6" stroke="#C89B6D" strokeWidth="3" />
      <text x="80" y="82" textAnchor="middle" fontFamily="'Bagel Fat One', system-ui" fontSize="20" fill="#3B2620">
        Klepon
      </text>
      <text x="80" y="98" textAnchor="middle" fontFamily="Poppins, system-ui" fontSize="9" fill="#6B4A3F">
        scan untuk resep dan cerita
      </text>
      <g transform="translate(58 110)">
        <rect x="-4" y="-4" width="52" height="52" fill="#FFF8F1" />
        <path d={QR} fill="#3B2620" />
        <Pojok x={0} y={0} />
        <Pojok x={32} y={0} />
        <Pojok x={0} y={32} />
      </g>
      <path d="M36 178 H124" stroke="#C89B6D" strokeWidth="1.5" strokeDasharray="3 4" />
      <text x="80" y="200" textAnchor="middle" fontFamily="'Bagel Fat One', system-ui" fontSize="13" fill="#3E6B35">
        Jajan Dulu!
      </text>
    </svg>
  )
}

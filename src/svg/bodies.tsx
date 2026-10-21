import type { ReactNode } from 'react'
import type { VarianId } from '../data/varian'

export type CharmId = VarianId | 'secret'

type Body = {
  /** Garis luar badan; dipakai untuk warna dasar, siluet, dan jahitan. */
  outline: string
  base: string
  /** Warna benang jahitan tepi. */
  stitch: string
  ring: string
  details?: () => ReactNode
}

// Bilangan acak berbenih supaya detail (kelapa, wijen) selalu sama setiap render.
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function circle(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0Z`
}

function roundRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
}

function wavy(cx: number, cy: number, r: number, amp: number, waves: number) {
  const pts: string[] = []
  const n = 160
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    // Gelombang kedua yang lebih lambat bikin pinggiran cup tidak terlalu rapi, seperti flanel yang dilipat.
    const rr = r + amp * Math.sin(t * waves) + amp * 0.6 * Math.sin(t * 3 + 1)
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

function Kelapa() {
  const r = rng(11)
  const items = []
  let tries = 0
  // Serutan kelapa menumpuk di bagian atas badan, makin jarang ke bawah.
  while (items.length < 34 && tries < 1200) {
    tries++
    const x = 30 + r() * 140
    const y = 130 + r() * (r() < 0.8 ? 62 : 96)
    if ((x - 100) ** 2 + (y - 202) ** 2 > 70 ** 2) continue
    const rot = r() * 180
    const w = 11 + r() * 9
    items.push(
      <g key={items.length} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})`}>
        <rect x={-w / 2} y={-2} width={w} height={7} rx={2.5} fill="#B9B09C" opacity="0.7" />
        <rect x={-w / 2} y={-3.5} width={w} height={7} rx={2.5} fill="#FBF8F0" />
      </g>,
    )
  }
  return <g filter="url(#felt)">{items}</g>
}

function Wijen() {
  const r = rng(5)
  const items: { x: number; y: number; rot: number }[] = []
  let tries = 0
  while (items.length < 40 && tries < 600) {
    tries++
    const x = 30 + r() * 140
    const y = 128 + r() * 146
    if ((x - 100) ** 2 / 70 ** 2 + (y - 202) ** 2 / 66 ** 2 > 1) continue
    if (items.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < 200)) continue
    items.push({ x, y, rot: r() * 180 })
  }
  return (
    <g>
      {items.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)})`}>
          <ellipse cx={0.8} cy={1} rx={5.6} ry={2.5} fill="#B9761E" opacity="0.6" />
          <ellipse rx={5.6} ry={2.5} fill="#FBF0D8" />
        </g>
      ))}
    </g>
  )
}

const LAPIS_RECT = { x: 34, y: 120, w: 132, h: 166 }
export const LAPIS_OUTLINE = roundRect(LAPIS_RECT.x, LAPIS_RECT.y, LAPIS_RECT.w, LAPIS_RECT.h, 18)
const LAPIS_WARNA = ['#F27BAA', '#F8EEDC', '#8CC152', '#F8EEDC', '#F27BAA']

export const BODIES: Record<CharmId, Body> = {
  klepon: {
    outline: circle(100, 202, 80),
    base: '#86BC4E',
    stitch: '#5D8F30',
    ring: '#5E8A3C',
    details: () => <Kelapa />,
  },
  'onde-onde': {
    outline: `M20 210 C20 150 56 122 100 122 C144 122 180 150 180 210 C180 260 146 284 100 284 C54 284 20 260 20 210Z`,
    base: '#EAA53C',
    stitch: '#C27A1C',
    ring: '#D8A82A',
    details: () => <Wijen />,
  },
  'kue-lapis': {
    outline: LAPIS_OUTLINE,
    base: '#F27BAA',
    stitch: '#C9507F',
    ring: '#EC7FA6',
    details: () => {
      const h = LAPIS_RECT.h / LAPIS_WARNA.length
      return (
        <g clipPath="url(#lapisClip)">
          <g filter="url(#felt)">
            {LAPIS_WARNA.map((c, i) => (
              <rect key={i} x={LAPIS_RECT.x - 4} y={LAPIS_RECT.y + i * h} width={LAPIS_RECT.w + 8} height={h + 1} fill={c} />
            ))}
          </g>
          {LAPIS_WARNA.slice(1).map((_, i) => (
            <line
              key={i}
              x1={LAPIS_RECT.x + 10}
              x2={LAPIS_RECT.x + LAPIS_RECT.w - 10}
              y1={LAPIS_RECT.y + (i + 1) * h}
              y2={LAPIS_RECT.y + (i + 1) * h}
              stroke="#fff"
              strokeOpacity="0.7"
              strokeWidth="1.6"
              strokeDasharray="3 4"
            />
          ))}
        </g>
      )
    },
  },
  'kue-lumpur': {
    outline: circle(100, 204, 82),
    base: '#9A5A2E',
    stitch: '#6E3A18',
    ring: '#9A5A2E',
    details: () => (
      <g>
        <path d={circle(100, 204, 68)} fill="#F4CB52" filter="url(#felt)" />
        <path d={circle(100, 204, 68)} fill="url(#shade)" />
        <path d={circle(100, 204, 63)} fill="none" stroke="#C89A2A" strokeWidth="1.8" strokeDasharray="2 5" strokeLinecap="round" />
        <g transform="translate(100 204) rotate(-8)">
          <ellipse cx={1.5} cy={2} rx={15} ry={10} fill="#2A120A" opacity="0.4" />
          <ellipse rx={15} ry={10} fill="#4A2414" />
          {[-8, -3, 2, 7].map((x, i) => (
            <path key={i} d={`M${x} -6 q2 6 0 12`} stroke="#6A3A22" strokeWidth="1.6" fill="none" />
          ))}
        </g>
      </g>
    ),
  },
  serabi: {
    outline: wavy(100, 206, 78, 5, 7),
    base: '#D7792B',
    stitch: '#A8561A',
    ring: '#5E8A3C',
    details: () => (
      <g>
        <path d={wavy(100, 206, 68, 4, 7)} fill="#000" opacity="0.12" />
        <path d={circle(100, 208, 58)} fill="#FBFAF6" filter="url(#felt)" />
        <path d={circle(100, 208, 58)} fill="url(#shade)" />
        <path d={circle(100, 208, 53)} fill="none" stroke="#E6B8C4" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
        <path d="M84 216 L100 199 L116 216" fill="none" stroke="#2F6F2E" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M84 214 L100 197 L116 214" fill="none" stroke="#4E9A3E" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    ),
  },
  secret: {
    outline: `M100 122 C150 120 182 156 180 204 C178 256 146 286 100 286 C52 286 20 254 20 206 C20 156 52 124 100 122Z`,
    base: '#120C0A',
    stitch: '#2A201C',
    ring: '#2A201C',
  },
}

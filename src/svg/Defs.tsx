import { LAPIS_OUTLINE } from './bodies'

// Filter dan gradient bersama untuk semua charm. Dirender sekali di App.
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* Tekstur flanel: bintik serat gelap dan terang di atas warna dasar, pinggiran sedikit berbulu. */}
        <filter id="felt" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" result="fuzzy" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.25"
            result="darkSpecks"
          />
          <feComposite in="darkSpecks" in2="fuzzy" operator="in" result="darkClip" />
          <feFlood floodColor="#2a1a10" floodOpacity="0.22" />
          <feComposite in2="darkClip" operator="in" result="dark" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -1.35"
            result="lightSpecks"
          />
          <feComposite in="lightSpecks" in2="fuzzy" operator="in" result="light" />
          <feMerge>
            <feMergeNode in="fuzzy" />
            <feMergeNode in="dark" />
            <feMergeNode in="light" />
          </feMerge>
        </filter>

        {/* Tiga tone: sorotan kiri atas, bayangan kanan bawah. */}
        <radialGradient id="shade" cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>

        <linearGradient id="ringShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* Anyaman pita webbing. */}
        <pattern id="weave" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="2" fill="#000" fillOpacity="0.14" />
        </pattern>

        <clipPath id="lapisClip">
          <path d={LAPIS_OUTLINE} />
        </clipPath>

        <radialGradient id="dropShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

import { BODIES, type CharmId } from './bodies'

type Props = {
  id: CharmId
  mode?: 'berwarna' | 'siluet'
  /** Sisi belakang: warna dasar dan jahitan saja, tanpa detail dan tanpa tanda tanya. */
  sisi?: 'depan' | 'belakang'
  bayangan?: boolean
  className?: string
}

export const SILUET = '#120C0A'
export const SILUET_RING = '#4A3A33'

export function Ring({ warna, polos = false }: { warna: string; polos?: boolean }) {
  return (
    <g>
      <circle cx="100" cy="56" r="36" fill="none" stroke={warna} strokeWidth="13" />
      {!polos && (
        <>
          <circle cx="100" cy="56" r="36" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="13" strokeDasharray="0 120 106" />
          <circle cx="100" cy="56" r="38" fill="none" stroke="url(#ringShine)" strokeWidth="3" />
          <rect x="57" y="47" width="12" height="18" rx="3" fill={warna} stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" />
          <circle cx="63" cy="56" r="2.2" fill="#000" fillOpacity="0.3" />
        </>
      )}
      <rect x="86" y="84" width="28" height="44" rx="3" fill={warna} />
      {!polos && (
        <>
          <rect x="86" y="84" width="28" height="44" rx="3" fill="url(#weave)" />
          <rect x="86" y="84" width="28" height="44" rx="3" fill="none" stroke="#000" strokeOpacity="0.2" />
        </>
      )}
    </g>
  )
}

/**
 * Bag charm flanel: ring pegas, tab webbing, dan badan jajanan.
 * viewBox 200x300; ring di atas, badan di y 120-290.
 */
export function Charm({ id, mode = 'berwarna', sisi = 'depan', bayangan = true, className }: Props) {
  const body = BODIES[id]
  const siluet = mode === 'siluet' || id === 'secret'
  const ring = siluet ? SILUET_RING : body.ring
  const belakang = sisi === 'belakang'

  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true" focusable="false">
      {bayangan && <ellipse cx="100" cy="292" rx="70" ry="8" fill="url(#dropShadow)" />}
      <Ring warna={ring} />

      {siluet ? (
        <g>
          <path d={body.outline} fill={SILUET} />
          <path d={body.outline} fill="url(#shade)" opacity="0.35" />
          {!belakang && (
            <text x="100" y="232" textAnchor="middle" fontFamily="'Bagel Fat One', system-ui" fontSize="92" fill="#F6D77A">
              ?
            </text>
          )}
        </g>
      ) : (
        <g>
          <path d={body.outline} fill={body.base} filter="url(#felt)" />
          {!belakang && body.details?.()}
          <path d={body.outline} fill="url(#shade)" />
          <path d={body.outline} fill="none" stroke={body.stitch} strokeWidth="2.5" />
          <path
            d={body.outline}
            transform="translate(100 204) scale(0.93) translate(-100 -204)"
            fill="none"
            stroke="#FFF7EA"
            strokeOpacity="0.75"
            strokeWidth="2"
            strokeDasharray="2.5 6"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  )
}

import { useEffect, useState } from 'react'
import { fotoCharm } from '../three/foto'
import { Charm } from '../svg/Charm'
import type { CharmId } from '../svg/bodies'

type Props = {
  id: CharmId
  mode?: 'berwarna' | 'siluet'
  sudut?: number
  className?: string
}

/** Foto dari model 3D. Kalau WebGL tidak tersedia, kembali ke ilustrasi SVG. */
export function FotoCharm({ id, mode = 'berwarna', sudut, className }: Props) {
  const [url, setUrl] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    let batal = false
    fotoCharm(id, mode, sudut).then((u) => {
      if (!batal) setUrl(u)
    })
    return () => {
      batal = true
    }
  }, [id, mode, sudut])

  if (url === null) return <Charm id={id} mode={mode} className={className} />
  if (url === undefined) return <span className={className} aria-hidden="true" />
  return <img src={url} alt="" className={className} draggable={false} />
}

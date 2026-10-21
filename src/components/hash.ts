import { useEffect, useState } from 'react'
import { VARIAN } from '../data/varian'

const VALID = new Set<string>([...VARIAN.map((v) => v.id), 'secret'])

function bacaHash(): string | null {
  const h = decodeURIComponent(window.location.hash.slice(1))
  return VALID.has(h) ? h : null
}

/**
 * Modal resep mengikuti hash URL, jadi QR di recipe tag bisa langsung menuju `/#klepon`.
 * Id varian sengaja tidak dipakai sebagai id elemen supaya browser tidak ikut melompat.
 */
export function useHashModal() {
  const [aktif, setAktif] = useState<string | null>(bacaHash)

  useEffect(() => {
    const onHash = () => setAktif(bacaHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const tutup = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setAktif(null)
  }

  return { aktif, tutup }
}

export function bukaModal(id: string) {
  window.location.hash = id
}

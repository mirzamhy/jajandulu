import { useEffect, useRef } from 'react'
import { SECRET, cariVarian } from '../data/varian'
import { Penampil } from './Penampil'
import { kunciScroll } from '../motion/setup'
import './modal.css'

type Props = {
  /** id varian, 'secret', atau null kalau tertutup. */
  aktif: string | null
  onTutup: () => void
}

const FOKUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function RecipeModal({ aktif, onTutup }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const tutup = useRef<HTMLButtonElement>(null)
  const varian = aktif ? cariVarian(aktif) : undefined
  const terbuka = Boolean(varian) || aktif === 'secret'

  useEffect(() => {
    if (!terbuka) return
    const sebelumnya = document.activeElement as HTMLElement | null
    kunciScroll(true)
    tutup.current?.focus()
    panel.current?.scrollTo(0, 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onTutup()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const el = Array.from(panel.current.querySelectorAll<HTMLElement>(FOKUSABLE))
      if (el.length === 0) return
      const pertama = el[0]
      const terakhir = el[el.length - 1]
      if (e.shiftKey && document.activeElement === pertama) {
        e.preventDefault()
        terakhir.focus()
      } else if (!e.shiftKey && document.activeElement === terakhir) {
        e.preventDefault()
        pertama.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      kunciScroll(false)
      sebelumnya?.focus?.({ preventScroll: true })
    }
  }, [terbuka, aktif, onTutup])

  if (!terbuka) return null

  const secret = !varian
  const judulId = 'modal-judul'

  return (
    <div className="modal-latar" onClick={onTutup}>
      <div
        ref={panel}
        className={secret ? 'modal modal-secret' : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={judulId}
        onClick={(e) => e.stopPropagation()}
        style={varian ? { ['--warna' as string]: varian.warna, ['--tinta' as string]: varian.tinta } : undefined}
      >
        <button ref={tutup} type="button" className="modal-tutup" onClick={onTutup} aria-label="Tutup">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal-visual">
          <Penampil id={varian ? varian.id : 'secret'} className="modal-kanvas" />
          <p className="modal-geser">geser untuk memutar</p>
        </div>

        {varian ? (
          <div className="modal-isi">
            <p className="modal-asal">{varian.asal}</p>
            <h2 id={judulId}>{varian.nama}</h2>
            <p className="modal-cerita">{varian.cerita}</p>

            <div className="modal-resep">
              <section>
                <h3>Bahan</h3>
                <ul>
                  {varian.bahan.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Cara membuat</h3>
                <ol>
                  {varian.langkah.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ol>
              </section>
            </div>
            <p className="modal-catatan">Resep rumahan. Takaran gula dan santan bisa disesuaikan dengan selera.</p>
          </div>
        ) : (
          <div className="modal-isi">
            <p className="modal-asal">Seri 01</p>
            <h2 id={judulId}>{SECRET.nama}</h2>
            <p className="modal-cerita">{SECRET.pesan}</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { FotoCharm } from '../components/FotoCharm'
import { RecipeTag } from '../svg/RecipeTag'
import { HARGA, rupiah, waLink } from '../data/kontak'

function Panah({ d, className }: { d: string; className: string }) {
  return (
    <svg className={`panah ${className}`} viewBox="0 0 80 60" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 0" />
    </svg>
  )
}

export function IsiKantong() {
  return (
    <section id="isi" className="isi" aria-labelledby="isi-judul">
      <div className="wrap isi-grid">
        <div className="isi-visual" data-reveal>
          <div className="isi-kantong" aria-hidden="true">
            <span>JAJAN DULU!</span>
          </div>
          <FotoCharm id="klepon" sudut={-0.35} className="isi-charm" />
          <RecipeTag className="isi-tag" />

          <p className="catatan catatan-charm">charm flanel 5-7 cm</p>
          <Panah className="panah-charm" d="M70 8 C50 10 30 22 18 46 M18 46 l-2 -10 M18 46 l9 -5" />
          <p className="catatan catatan-ring">ring pegas, tinggal tekan</p>
          <Panah className="panah-ring" d="M8 50 C20 30 40 18 66 12 M66 12 l-9 -3 M66 12 l-6 7" />
          <p className="catatan catatan-tag">scan QR-nya, keluar resep</p>
          <Panah className="panah-tag" d="M10 10 C30 12 48 26 58 50 M58 50 l1 -10 M58 50 l-8 -5" />
          <p className="catatan catatan-kantong">kantong kertas, tertutup rapat</p>
        </div>

        <div className="isi-teks">
          <h2 id="isi-judul" data-reveal>
            Di dalam satu kantong
          </h2>
          <p data-reveal>
            Satu charm flanel berisi kain perca bersih, ring pegas yang gampang dipindah antar tas, dan recipe tag
            lepas-pasang. Kantongnya tidak transparan, jadi isinya tetap kejutan sampai kamu sendiri yang membuka.
          </p>

          <div className="harga" data-reveal>
            <p className="harga-angka">
              {rupiah(HARGA)}
              <span> / kantong</span>
            </p>
            <p className="harga-catatan">
              Ambil 2-3 kantong sekaligus untuk harga bundle. Tanya detailnya lewat{' '}
              <a href={waLink('Halo Jajan Dulu!, mau tanya harga bundle 2-3 kantong.')} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

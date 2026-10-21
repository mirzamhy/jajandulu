import { ANGGOTA } from '../data/kontak'
import { VARIAN } from '../data/varian'

function inisial(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase()
}

export function Tim() {
  return (
    <section id="tim" className="tim" aria-labelledby="tim-judul">
      <div className="wrap">
        <header className="tim-head" data-reveal>
          <h2 id="tim-judul">Yang menjahit di balik kantong</h2>
          <p>Kami mahasiswa yang mengerjakan Jajan Dulu! sebagai proyek kewirausahaan, dari desain karakter sampai jahitan terakhir.</p>
        </header>
        <ul className="tim-grid">
          {ANGGOTA.map((a, i) => {
            const v = VARIAN[i % VARIAN.length]
            return (
              <li key={a.nama + i} className="tim-kartu" data-reveal>
                <span className="tim-avatar" style={{ background: v.warna, color: v.tinta }} aria-hidden="true">
                  {inisial(a.nama)}
                </span>
                <span className="tim-nama">{a.nama}</span>
                <span className="tim-peran">{a.peran}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

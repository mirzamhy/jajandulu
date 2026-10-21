import { VARIAN } from '../data/varian'
import { FotoCharm } from '../components/FotoCharm'
import { bukaModal } from '../components/hash'

export function Koleksi() {
  return (
    <section id="koleksi" className="koleksi" aria-labelledby="koleksi-judul">
      <div className="wrap">
        <header className="koleksi-head" data-reveal>
          <h2 id="koleksi-judul">Seri 01: Jajanan Pasar</h2>
          <p>
            Lima karakter reguler, satu rahasia. Tiap charm datang dengan recipe tag, jadi kamu bisa bikin jajanan
            aslinya di rumah.
          </p>
        </header>

        <ul className="koleksi-grid">
          {VARIAN.map((v) => (
            <li key={v.id} data-reveal>
              <button
                type="button"
                className="kartu"
                style={{ ['--warna' as string]: v.warna, ['--tinta' as string]: v.tinta }}
                onClick={() => bukaModal(v.id)}
                aria-label={`${v.nama}, buka cerita dan resep`}
              >
                <span className="kartu-3d">
                  <FotoCharm id={v.id} className="kartu-foto kartu-foto-a" />
                  <FotoCharm id={v.id} sudut={0.6} className="kartu-foto kartu-foto-b" />
                </span>
                <span className="kartu-nama">{v.nama}</span>
                <span className="kartu-asal">{v.asal}</span>
                <span className="kartu-aksi">baca resepnya</span>
              </button>
            </li>
          ))}
          <li data-reveal>
            <button type="button" className="kartu kartu-secret" onClick={() => bukaModal('secret')} aria-label="Karakter rahasia">
              <span className="kartu-3d">
                <FotoCharm id="secret" className="kartu-foto kartu-foto-a" />
                <FotoCharm id="secret" sudut={0.6} className="kartu-foto kartu-foto-b" />
              </span>
              <span className="kartu-nama">Secret</span>
              <span className="kartu-asal">Belum ada yang tahu</span>
              <span className="kartu-aksi">intip sedikit</span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}

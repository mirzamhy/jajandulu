import fotoProduk from '../assets/produk.webp'

const NILAI = [
  {
    judul: 'Cerita lokal',
    tinta: '#3E6B35',
    isi: 'Tiap karakter membawa cerita dan resep jajanan aslinya. Cara kecil untuk ingat jajanan pasar yang mulai jarang ditemui.',
  },
  {
    judul: 'Jahitan tangan',
    tinta: '#9A5A2E',
    isi: 'Dipotong, dijahit, dan diisi satu per satu. Tidak ada dua charm yang benar-benar sama.',
  },
  {
    judul: 'Kejutan',
    tinta: '#B8456F',
    isi: 'Kamu tahu daftar karakternya, tapi baru tahu yang kamu dapat saat kantong dibuka.',
  },
]

export function Tentang() {
  return (
    <section id="tentang" className="tentang" aria-labelledby="tentang-judul">
      <div className="wrap tentang-grid">
        <figure className="tentang-foto" data-reveal>
          <img src={fotoProduk} alt="Lima bag charm flanel Jajan Dulu!: klepon, onde-onde, kue lapis, kue lumpur, dan serabi, masing-masing dengan ring berwarna." loading="lazy" />
          <figcaption>sampel pertama kami, masih dijahit di meja kos</figcaption>
        </figure>

        <div className="tentang-teks">
          <h2 id="tentang-judul" data-reveal>
            Jajan dulu, yuk!
          </h2>
          <p className="tentang-lead" data-reveal>
            Nama kami diambil dari ajakan yang akrab di telinga: rehat sebentar, jajan dulu. Ajakan itu sekarang bisa
            digantung di tas, dalam bentuk charm flanel mini.
          </p>
          <dl className="tentang-nilai">
            {NILAI.map((n) => (
              <div key={n.judul} data-reveal>
                <dt style={{ color: n.tinta }}>{n.judul}</dt>
                <dd>{n.isi}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="eco" data-reveal>
        <div className="wrap eco-isi">
          <h3>Dari isi sampai kemasan, kami usahakan minim sampah.</h3>
          <p>
            Isian charm memakai kain perca bersih, sisa potongan yang biasanya dibuang. Kantongnya kertas, bukan plastik,
            jadi lebih mudah dipisahkan dan didaur ulang setelah dibuka.
          </p>
        </div>
      </div>
    </section>
  )
}

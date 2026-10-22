import { useEffect, useRef, useState } from 'react'
import { VARIAN } from '../data/varian'
import { HARGA, rupiah } from '../data/kontak'
import { gsap, ScrollTrigger } from '../motion/setup'
import { bukaModal } from '../components/hash'
import { FotoCharm } from '../components/FotoCharm'
import { buatAdegan, type Adegan } from '../three/adegan'
import { tungguFont } from '../three/tekstur'
import './hero.css'

const KREM = '#FFF8F1'
const GELAP = '#1E1411'
const TEKS = '#3B2620'
const COKELAT = '#4E2C1F'
const KRAFT = '#C89B6D'
const PUTARAN = Math.PI * 2

export function Hero({ statis }: { statis: boolean }) {
  const root = useRef<HTMLElement>(null)
  const kanvas = useRef<HTMLCanvasElement>(null)
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    let batal = false
    let adegan: Adegan | null = null
    let ctx: gsap.Context | null = null
    let tick: (() => void) | null = null

    tungguFont().then(() => {
      if (batal || !kanvas.current || !root.current) return
      try {
        adegan = buatAdegan(kanvas.current)
      } catch {
        setGagal(true)
        return
      }
      const a = adegan
      const S = a.S

      if (statis) {
        a.setIdle(false)
        requestAnimationFrame(() => a.render())
        return
      }

      // Render hanya selama hero (termasuk jarak pin-nya) masih terlihat.
      let batasAkhir = Infinity
      tick = () => {
        if (window.scrollY < batasAkhir) a.render()
      }
      gsap.ticker.add(tick)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => (window.innerWidth < 720 ? '+=760%' : '+=950%'),
            pin: '.hero-pin',
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => a.setIdle(self.progress < 0.004),
            onRefresh: (self) => {
              batasAkhir = self.end + window.innerHeight
            },
          },
        })

        // 1. Tutup terangkat ke belakang, kantong (dan charm di dalamnya) turun sedikit, lampu dalam menyala.
        tl.to(S, { buka: 1, duration: 1.1 }, 0.2)
          .to(S, { kantongY: -0.25, charmY: 0.6, duration: 0.9, ease: 'power2.out' }, 0.2)
          .to(S, { cahaya: 1, duration: 0.8, ease: 'power1.out' }, 0.6)
          .to('.hero-title', { autoAlpha: 0, y: -24, duration: 0.6 }, 1.1)

          // 2. Siluet charm naik dari dalam kantong.
          .to(S, { charmY: 2.7, charmSkala: 0.95, duration: 1.2, ease: 'power2.out' }, 1.3)

          // 3. Kantong jatuh ke bawah dan hilang. Charm turun ke tengah, berputar memperlihatkan bentuk 3D-nya.
          .to(S, { kantongY: -5.5, kantongMiring: 0.18, duration: 1, ease: 'power2.in' }, 2.5)
          .to(S, { cahaya: 0, duration: 0.6 }, 2.6)
          .to('.hero-info', { autoAlpha: 0, y: 16, duration: 0.5 }, 2.5)
          .to(S, { charmY: 1.45, charmSkala: 1.35, duration: 0.9 }, 2.7)
          .to(S, { charmPutar: PUTARAN, duration: 1.1, ease: 'power1.inOut' }, 2.9)
          .fromTo('.hero-geser', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 3.4)
          .fromTo('.hero-strip', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 3.4)

        // 4. Lima karakter terungkap: siluet berganti bentuk sambil berputar, lalu warna mengisi.
        const mulai = 4.1
        // tiap karakter: berputar masuk (±1,2), lalu diam sebentar supaya sempat dilihat sebelum berganti
        const jeda = 2.2
        tl.to('.hero-geser', { autoAlpha: 0, duration: 0.3 }, mulai)
        VARIAN.forEach((v, i) => {
          const t = mulai + i * jeda
          tl.to(S, { tampil: i, duration: 0.01, ease: 'none' }, t)
            .fromTo(S, { warna: 0 }, { warna: 1, duration: 0.8, ease: 'power1.out' }, t + 0.3)
            .to(S, { charmPutar: `+=${PUTARAN}`, duration: 1.3, ease: 'power2.out' }, t)
            .fromTo(`.hero-cap-${v.id}`, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, t + 0.4)
            .to(`.hero-cap-${v.id}`, { autoAlpha: 0, y: -10, duration: 0.35 }, t + jeda - 0.4)
            .fromTo(
              `.strip-color-${v.id}`,
              { autoAlpha: 0, scale: 0.6 },
              { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
              t + 1.2,
            )
        })

        const akhir = mulai + VARIAN.length * jeda
        const fase = (akhir - mulai) / 3
        tl.to(root.current, { backgroundColor: COKELAT, duration: fase, ease: 'none' }, mulai)
          .to(root.current, { backgroundColor: KRAFT, duration: fase, ease: 'none' }, mulai + fase)
          .to(root.current, { color: TEKS, duration: 0.3, ease: 'none' }, mulai + fase * 1.4)
          .to(root.current, { backgroundColor: KREM, duration: fase, ease: 'none' }, mulai + fase * 2)

          // 5. Yang terakhir tetap rahasia.
          .to(S, { tampil: -1, duration: 0.01, ease: 'none' }, akhir)
          .to(S, { charmPutar: `+=${PUTARAN}`, duration: 1.3, ease: 'power2.out' }, akhir)
          .fromTo('.hero-cap-secret', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, akhir + 0.2)
          .to('.strip-secret', { scale: 1.12, duration: 0.3, ease: 'back.out(2)' }, akhir + 0.2)
          .to('.strip-secret', { scale: 1, duration: 0.3 }, akhir + 0.55)
          .to({}, { duration: 1.2 })
      }, root)
      ScrollTrigger.refresh()
    })

    return () => {
      batal = true
      if (tick) gsap.ticker.remove(tick)
      ctx?.revert()
      adegan?.dispose()
    }
  }, [statis])

  return (
    <section
      ref={root}
      className={statis ? 'hero is-statis' : 'hero'}
      style={{ backgroundColor: statis ? KREM : GELAP, color: statis ? TEKS : KREM }}
      aria-labelledby="hero-judul"
    >
      <div className="hero-pin">
        {!gagal && <canvas ref={kanvas} className="hero-kanvas" aria-label="Blind bag Jajan Dulu! dalam 3D. Geser untuk memutar charm." />}

        <header className="hero-title">
          <h1 id="hero-judul">Jajan Dulu!</h1>
          <p className="hero-slogan">Collect it. Taste the story.</p>
          <p className="hero-sub">Bag charm flanel bentuk jajanan pasar, dijahit tangan, dibungkus kantong kertas tertutup.</p>
        </header>

        <p className="hero-geser">geser charm-nya, bisa diputar</p>

        <div className="hero-captions" aria-hidden="true">
          {VARIAN.map((v) => (
            <p key={v.id} className={`hero-cap hero-cap-${v.id}`}>
              <span className="hero-cap-nama">{v.nama}</span>
              <span className="hero-cap-asal">{v.asal}</span>
            </p>
          ))}
          <p className="hero-cap hero-cap-secret">
            <span className="hero-cap-nama">Satu lagi?</span>
            <span className="hero-cap-asal">Masih rahasia. Cuma ada di dalam kantong.</span>
          </p>
        </div>

        <dl className="hero-info">
          <div>
            <dt>Seri</dt>
            <dd>01 Jajanan Pasar</dd>
          </div>
          <div>
            <dt>Isi seri</dt>
            <dd>5 karakter + 1 rahasia</dd>
          </div>
          <div>
            <dt>Harga</dt>
            <dd>{rupiah(HARGA)} / kantong</dd>
          </div>
        </dl>

        <ol className="hero-strip" aria-label="Isi seri 01">
          {VARIAN.map((v) => (
            <li key={v.id}>
              <button type="button" className="strip-slot" onClick={() => bukaModal(v.id)}>
                <span className="strip-charm">
                  <FotoCharm id={v.id} mode="siluet" className="strip-img" />
                  <span className={`strip-color strip-color-${v.id}`}>
                    <FotoCharm id={v.id} className="strip-img" />
                  </span>
                </span>
                <span className="strip-nama">{v.nama}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="strip-slot strip-secret" onClick={() => bukaModal('secret')}>
              <span className="strip-charm">
                <FotoCharm id="secret" className="strip-img" />
              </span>
              <span className="strip-nama">Secret</span>
            </button>
          </li>
        </ol>
      </div>
    </section>
  )
}

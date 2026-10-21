import { useRef } from 'react'
import { SvgDefs } from './svg/Defs'
import { Hero } from './sections/Hero'
import { Koleksi } from './sections/Koleksi'
import { Tentang } from './sections/Tentang'
import { IsiKantong } from './sections/IsiKantong'
import { Tim } from './sections/Tim'
import { Order, LABEL_ORDER } from './sections/Order'
import { RecipeModal } from './components/RecipeModal'
import { useHashModal } from './components/hash'
import { gsap, ScrollTrigger, useGSAP, useLenis, useReducedMotion } from './motion/setup'
import { waLink } from './data/kontak'
import './sections/sections.css'

export default function App() {
  const statis = useReducedMotion()
  const { aktif, tutup } = useHashModal()
  const main = useRef<HTMLElement>(null)
  useLenis(!statis)

  // Elemen bertanda data-reveal muncul halus saat masuk layar.
  useGSAP(
    () => {
      if (statis) return
      // Tombol pre-order mengambang baru muncul setelah unboxing selesai supaya tidak menutupi strip koleksi.
      ScrollTrigger.create({
        trigger: '#koleksi',
        start: 'top 85%',
        endTrigger: '#order',
        end: 'top 70%',
        // Hero 3D dibuat belakangan (menunggu font), jadi trigger di bawahnya dihitung ulang setelah pin hero ada.
        refreshPriority: -1,
        toggleClass: { targets: '.fab-order', className: 'is-on' },
      })
      const el = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      gsap.set(el, { autoAlpha: 0, y: 28 })
      ScrollTrigger.batch(el, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08, overwrite: true }),
      })
    },
    { scope: main, dependencies: [statis], revertOnUpdate: true },
  )

  return (
    <>
      <SvgDefs />
      <main ref={main}>
        <Hero statis={statis} />
        <Koleksi />
        <Tentang />
        <IsiKantong />
        <Tim />
        <Order />
      </main>
      <a className={statis ? 'fab-order is-on' : 'fab-order'} href={waLink()} target="_blank" rel="noreferrer">
        {LABEL_ORDER}
      </a>
      <RecipeModal aktif={aktif} onTutup={tutup} />
    </>
  )
}

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

let lenis: Lenis | null = null

/** Smooth scroll Lenis yang digerakkan ticker GSAP supaya ScrollTrigger tetap sinkron. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({ duration: 1.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}

/** Hentikan scroll halaman saat modal terbuka. */
export function kunciScroll(kunci: boolean) {
  if (lenis) {
    if (kunci) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = kunci ? 'hidden' : ''
}

export { gsap, ScrollTrigger, useGSAP }

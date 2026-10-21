import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from '../motion/setup'
import { buatCharm } from '../three/charm'
import { lampuStandar, rendererStandar } from '../three/adegan'
import { tungguFont } from '../three/tekstur'
import type { CharmId } from '../svg/bodies'

/** Satu charm 3D yang bisa diputar dengan geser. Dipakai di modal resep. */
export function Penampil({ id, className }: { id: CharmId; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let batal = false
    let bersihkan = () => {}

    tungguFont().then(() => {
      if (batal) return
      let renderer: THREE.WebGLRenderer
      try {
        renderer = rendererStandar(canvas)
      } catch {
        return
      }
      const scene = new THREE.Scene()
      lampuStandar(scene, renderer)
      const kamera = new THREE.PerspectiveCamera(28, 1, 0.1, 20)
      kamera.position.set(0, 0.3, 3.6)
      kamera.lookAt(0, 0, 0)
      const charm = buatCharm(id)
      scene.add(charm.grup)

      const p = { y: -0.6, x: 0, vy: 0.9, seret: false }
      let x0 = 0
      let y0 = 0
      let t0 = 0
      const turun = (e: PointerEvent) => {
        p.seret = true
        p.vy = 0
        x0 = e.clientX
        y0 = e.clientY
        t0 = performance.now()
        canvas.setPointerCapture(e.pointerId)
      }
      const gerak = (e: PointerEvent) => {
        if (!p.seret) return
        const now = performance.now()
        const dx = e.clientX - x0
        const dy = e.clientY - y0
        const dt = Math.max((now - t0) / 1000, 0.008)
        p.y += dx * 0.012
        p.x = THREE.MathUtils.clamp(p.x + dy * 0.008, -0.7, 0.7)
        p.vy = p.vy * 0.5 + ((dx * 0.012) / dt) * 0.5
        x0 = e.clientX
        y0 = e.clientY
        t0 = now
      }
      const naik = () => {
        p.seret = false
      }
      canvas.addEventListener('pointerdown', turun)
      canvas.addEventListener('pointermove', gerak)
      canvas.addEventListener('pointerup', naik)
      canvas.addEventListener('pointercancel', naik)

      const ukur = () => {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        kamera.aspect = w / h
        kamera.updateProjectionMatrix()
      }
      const ro = new ResizeObserver(ukur)
      ro.observe(canvas)
      ukur()

      let lalu = performance.now()
      const tick = () => {
        const now = performance.now()
        const dt = Math.min((now - lalu) / 1000, 0.05)
        lalu = now
        if (!p.seret) {
          p.y += p.vy * dt
          // Putaran awal melambat sampai berhenti; tidak berputar terus-menerus.
          p.vy *= Math.pow(0.15, dt)
          p.x += (0 - p.x) * Math.min(1, dt * 3)
        }
        charm.grup.rotation.y = p.y
        charm.grup.rotation.x = p.x
        renderer.render(scene, kamera)
      }
      gsap.ticker.add(tick)

      bersihkan = () => {
        gsap.ticker.remove(tick)
        ro.disconnect()
        canvas.removeEventListener('pointerdown', turun)
        canvas.removeEventListener('pointermove', gerak)
        canvas.removeEventListener('pointerup', naik)
        canvas.removeEventListener('pointercancel', naik)
        scene.traverse((o) => {
          const m = o as THREE.Mesh
          if (m.isMesh) {
            m.geometry.dispose()
            ;(Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose())
          }
        })
        renderer.dispose()
      }
    })

    return () => {
      batal = true
      bersihkan()
    }
  }, [id])

  return <canvas ref={ref} className={className} aria-label="Charm 3D. Geser untuk memutar." />
}

import * as THREE from 'three'
import { buatCharm } from './charm'
import { lampuStandar, rendererStandar } from './adegan'
import { tungguFont } from './tekstur'
import type { CharmId } from '../svg/bodies'

let renderer: THREE.WebGLRenderer | null = null
const cache = new Map<string, Promise<string | null>>()

/**
 * Foto PNG transparan dari model 3D charm, dipakai untuk kartu dan strip supaya halaman
 * tidak perlu belasan canvas WebGL sekaligus. Satu renderer kecil dipakai bergantian.
 */
export function fotoCharm(id: CharmId, mode: 'berwarna' | 'siluet' = 'berwarna', sudut = -0.5): Promise<string | null> {
  const key = `${id}:${mode}:${sudut}`
  let p = cache.get(key)
  if (!p) {
    p = tungguFont().then(() => {
      try {
        if (!renderer) {
          const c = document.createElement('canvas')
          renderer = rendererStandar(c, { preserveDrawingBuffer: true })
          renderer.setPixelRatio(1)
          renderer.setSize(360, 360, false)
        }
        const scene = new THREE.Scene()
        lampuStandar(scene, renderer)
        const kamera = new THREE.PerspectiveCamera(28, 1, 0.1, 20)
        kamera.position.set(0, 0.35, 3.4)
        kamera.lookAt(0, 0, 0)
        const charm = buatCharm(id)
        charm.setWarna(mode === 'siluet' ? 0 : 1)
        charm.grup.rotation.y = sudut
        charm.grup.rotation.x = 0.08
        scene.add(charm.grup)
        renderer.setClearColor(0x000000, 0)
        renderer.render(scene, kamera)
        const url = renderer.domElement.toDataURL('image/png')
        scene.traverse((o) => {
          const m = o as THREE.Mesh
          if (m.isMesh) {
            m.geometry.dispose()
            ;(Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose())
          }
        })
        return url
      } catch {
        return null
      }
    })
    cache.set(key, p)
  }
  return p
}

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { transformExtent } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Style, Stroke, Fill } from 'ol/style'

proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south ' + '+ellps=GRS80 +units=m +no_defs')

register(proj4)

export function criarGrade(extent3857, tamanho = 400) {
  // Converte o extent do mapa para UTM
  const extent = transformExtent(extent3857, 'EPSG:3857', 'EPSG:31982')

  const [minX, minY, maxX, maxY] = extent

  const features = []

  // Alinha a grade em múltiplos de 400
  const inicioX = Math.floor(minX / tamanho) * tamanho
  const inicioY = Math.floor(minY / tamanho) * tamanho

  for (let x = inicioX; x < maxX; x += tamanho) {
    for (let y = inicioY; y < maxY; y += tamanho) {
      const quadrado = [
        [x, y],
        [x + tamanho, y],
        [x + tamanho, y + tamanho],
        [x, y + tamanho],
        [x, y],
      ]

      // Converte cada ponto de UTM para EPSG:3857
      const quadrado3857 = quadrado.map((coord) => proj4('EPSG:31982', 'EPSG:3857', coord))

      const feature = new Feature({
        geometry: new Polygon([quadrado3857]),
      })

      features.push(feature)
    }
  }

  return new VectorLayer({
    source: new VectorSource({
      features,
    }),

    style: new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        width: 1,
      }),

      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.02)',
      }),
    }),
  })
}

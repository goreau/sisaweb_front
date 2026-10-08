import * as turf from '@turf/turf'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import { transformExtent } from 'ol/proj'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'

proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south ' + '+ellps=GRS80 +units=m +no_defs')

register(proj4)

export function criarGradeLayer(poligonosCoordenadas) {
  const features = poligonosCoordenadas.map((quadrado3857) => {
    return new Feature({
      geometry: new Polygon([quadrado3857]),
    })
  })

  return new VectorLayer({
    source: new VectorSource({ features }),
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

export function gerarPontosAleatorios(geojson, distanciaMinima = 400, quantidadeMaxima = 100) {
  const geojsonFeatures = geojson.features

  // Agora podemos usar Turf
  const bbox = turf.bbox(geojson)

  const pontos = []

  let tentativas = 0
  const maxTentativas = quantidadeMaxima * 1000

  while (pontos.length < quantidadeMaxima && tentativas < maxTentativas) {
    tentativas++

    const candidato = turf.randomPoint(1, {
      bbox,
    }).features[0]

    // Verifica se o ponto está em algum polígono
    let dentro = false

    for (const feature of geojsonFeatures) {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        if (turf.booleanPointInPolygon(candidato, feature)) {
          dentro = true
          break
        }
      }
    }

    if (!dentro) {
      continue
    }

    // Verifica distância mínima
    let valido = true

    for (const ponto of pontos) {
      const distancia = turf.distance(candidato, ponto, { units: 'meters' })

      if (distancia < distanciaMinima) {
        valido = false
        break
      }
    }

    if (valido) {
      pontos.push(candidato)
    }
  }

  //const ret = criarPontosLayer(pontos)

  return pontos
}

export function criarPontosLayer(pontos) {
  const format = new GeoJSON()

  const features = format.readFeatures(
    {
      type: 'FeatureCollection',
      features: pontos,
    },
    {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    },
  )

  return new VectorLayer({
    source: new VectorSource({
      features,
    }),

    style: new Style({
      image: new CircleStyle({
        radius: 6,

        fill: new Fill({
          color: 'red',
        }),

        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }),
  })
}

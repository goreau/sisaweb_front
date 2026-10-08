// gradeWorker.js
import proj4 from 'proj4'

// Declarações completas das projeções no Worker
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')
proj4.defs(
  'EPSG:3857',
  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs',
)
proj4.defs(
  'EPSG:31982',
  '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
)

self.onmessage = function (e) {
  const { extent3857 } = e.data
  // O segredo que resolveu o bug: coerção explícita para Number!
  const tamanho = Number(e.data.tamanho) || 400

  if (!extent3857 || extent3857.length < 4) {
    return self.postMessage([])
  }

  try {
    // 1. Converte do mapa (EPSG:3857) para WGS84 (EPSG:4326)
    const p1_4326 = proj4('EPSG:3857', 'EPSG:4326', [extent3857[0], extent3857[1]])
    const p2_4326 = proj4('EPSG:3857', 'EPSG:4326', [extent3857[2], extent3857[3]])

    // 2. Converte de WGS84 para a UTM de cálculo (EPSG:31982)
    const p1_UTM = proj4('EPSG:4326', 'EPSG:31982', p1_4326)
    const p2_UTM = proj4('EPSG:4326', 'EPSG:31982', p2_4326)

    const minX = Math.min(p1_UTM[0], p2_UTM[0])
    const maxX = Math.max(p1_UTM[0], p2_UTM[0])
    const minY = Math.min(p1_UTM[1], p2_UTM[1])
    const maxY = Math.max(p1_UTM[1], p2_UTM[1])

    const poligonosCoordenadas = []

    const inicioX = Math.floor(minX / tamanho) * tamanho
    const inicioY = Math.floor(minY / tamanho) * tamanho

    // 3. Loop cartesiano rápido em UTM
    for (let x = inicioX; x < maxX; x += tamanho) {
      for (let y = inicioY; y < maxY; y += tamanho) {
        const quadradoUTM = [
          [x, y],
          [x + tamanho, y],
          [x + tamanho, y + tamanho],
          [x, y + tamanho],
          [x, y],
        ]

        // Converte o quadrado de volta para EPSG:3857
        const quadrado3857 = quadradoUTM.map((coordUTM) => {
          const pt4326 = proj4('EPSG:31982', 'EPSG:4326', coordUTM)
          return proj4('EPSG:4326', 'EPSG:3857', pt4326)
        })

        poligonosCoordenadas.push(quadrado3857)
      }
    }

    self.postMessage(poligonosCoordenadas)
  } catch (err) {
    console.error('Erro na geração da grade no Worker:', err)
    self.postMessage([])
  }
}

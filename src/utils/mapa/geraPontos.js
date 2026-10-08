import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'

const estiloPontoPadrao = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: 'rgba(255, 0, 0, 0.4)' }),
    stroke: new Stroke({ color: '#8B0000', width: 1.5 }),
  }),
})

export function carregarPontosTabulares(camadaPontos, listaPontos, estiloConfig) {
  const features = listaPontos.map((item) => {
    const coordenadasProjetadas = fromLonLat([Number(item.lng), Number(item.lat)])

    const feature = new Feature({
      geometry: new Point(coordenadasProjetadas),
      nome: item.nome,
      valorVariavel: Number(item.valor),
    })

    feature.setId(item.id)
    return feature
  })

  const source = camadaPontos.getSource()
  source.clear()
  source.addFeatures(features)

  // 1. Aplica o estilo e CAPTURA os dados da legenda calculados
  const legenda = aplicarEstiloPontosPorTamanho(camadaPontos, estiloConfig)

  // 2. Retorna a legenda para quem chamou
  return legenda
}

export function aplicarEstiloPontosPorTamanho(camadaPontos, estiloConfig) {
  const source = camadaPontos.getSource()
  const features = source.getFeatures()

  const valores = features
    .map((f) => f.get('valorVariavel'))
    .filter((v) => v !== null && v !== undefined && !isNaN(v))

  if (valores.length === 0) {
    camadaPontos.setStyle(estiloPontoPadrao)
    return null
  }

  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const numClasses = Number(estiloConfig.classes) || 5

  const limites = calcularIntervalosIguais(min, max, numClasses)

  const RAIO_MINIMO = 5
  const RAIO_MAXIMO = 22
  const raiosClasses = calcularRaiosPorClasse(numClasses, RAIO_MINIMO, RAIO_MAXIMO)

  const corPreenchimento = 'rgba(255, 0, 0, 0.4)'
  const corBorda = '#8B0000'

  camadaPontos.setStyle((feature) => {
    const valor = feature.get('valorVariavel')

    if (valor === null || valor === undefined || isNaN(valor)) {
      return new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({ color: 'rgba(200, 200, 200, 0.5)' }),
          stroke: new Stroke({ color: '#888888', width: 1 }),
        }),
      })
    }

    const raio = calcularRaioPorFaixa(valor, limites, raiosClasses)

    return new Style({
      image: new CircleStyle({
        radius: raio,
        fill: new Fill({ color: corPreenchimento }),
        stroke: new Stroke({ color: corBorda, width: 1.5 }),
      }),
      zIndex: 1000 - raio,
    })
  })

  // 3. Gera a estrutura da legenda e a RETORNA
  return gerarEstruturaLegenda(estiloConfig.fantasia, limites, raiosClasses, corPreenchimento)
}

function gerarEstruturaLegenda(titulo, limites, raios, corPreenchimento) {
  const itensLegenda = []

  for (let i = 0; i < raios.length; i++) {
    const inf = limites[i].toLocaleString('pt-BR', { maximumFractionDigits: 1 })
    const sup = limites[i + 1].toLocaleString('pt-BR', { maximumFractionDigits: 1 })

    itensLegenda.push({
      raio: raios[i],
      cor: corPreenchimento,
      rotulo: `${inf} - ${sup}`,
    })
  }

  return {
    id: 'pontos',
    tipo: 'tamanho',
    titulo: titulo,
    itens: itensLegenda,
  }
}

// Helpers matemáticos...
function calcularIntervalosIguais(min, max, numClasses) {
  const amplitude = (max - min) / numClasses
  const limites = []
  for (let i = 0; i <= numClasses; i++) {
    limites.push(min + amplitude * i)
  }
  return limites
}

function calcularRaiosPorClasse(numClasses, raioMin, raioMax) {
  const raios = []
  const passo = (raioMax - raioMin) / (numClasses - 1 || 1)
  for (let i = 0; i < numClasses; i++) {
    raios.push(Math.round(raioMin + passo * i))
  }
  return raios
}

function calcularRaioPorFaixa(valor, limites, raios) {
  if (valor <= limites[0]) return raios[0]
  for (let i = 0; i < limites.length - 1; i++) {
    if (valor > limites[i] && valor <= limites[i + 1]) {
      return raios[i] || raios[raios.length - 1]
    }
  }
  return raios[raios.length - 1]
}

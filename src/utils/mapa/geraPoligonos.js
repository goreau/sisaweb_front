import { Style, Fill, Stroke } from 'ol/style'

const estiloPadrao = new Style({
  fill: new Fill({
    color: 'rgba(50, 115, 220, 0.1)',
  }),
  stroke: new Stroke({
    color: '#3273dc',
    width: 1.5,
  }),
})

const PALETA_PADRAO = ['#bafada', '#86dd86', '#42da49', '#10a829', '#07420a']

const aplicarAlphaHex = (cor) => {
  const hexLimpo = cor.slice(0, 7)
  return `${hexLimpo}66` // Opacidade (40%)
}

function calcularIntervalosIguais(min, max, numClasses) {
  const amplitude = (max - min) / numClasses
  const limites = []
  for (let i = 0; i <= numClasses; i++) {
    limites.push(min + amplitude * i)
  }
  return limites
}

export function vincularDadosEAtualizarEstilo(
  camadaVetorial,
  dados,
  chaveMapa,
  chaveDados,
  estiloConfig,
) {
  const mapaDeValores = new Map()
  dados.forEach((item) => {
    mapaDeValores.set(String(item[chaveDados]), item.valor)
  })

  const source = camadaVetorial.getSource()
  const features = source.getFeatures()

  features.forEach((feature) => {
    const idLocal = String(feature.get(chaveMapa))
    const valorEncontrado = mapaDeValores.get(idLocal)

    if (valorEncontrado !== undefined) {
      feature.set('valorVariavel', Number(valorEncontrado))
    } else {
      feature.set('valorVariavel', null)
    }
  })

  // Retorna o resultado completo gerado pelo estilo coroplético
  /* if (estiloConfig.modoVisualizacao === 'pontos_tamanho') {
    return aplicarEstiloPontosPorTamanho(camadaVetorial, estiloConfig)
  } else {/*/
  return aplicarEstiloCoropletico(camadaVetorial, estiloConfig)
  //}
}

export function aplicarEstiloCoropletico(camadaVetorial, estiloConfig) {
  const source = camadaVetorial.getSource()
  const features = source.getFeatures()

  const valores = features
    .map((f) => f.get('valorVariavel'))
    .filter((v) => v !== null && v !== undefined && !isNaN(v))

  // CASO 1: Sem dados válidos
  if (valores.length === 0) {
    camadaVetorial.setStyle(estiloPadrao)
    return {
      legenda: {
        tipo: 'coroplético',
        titulo: estiloConfig.variavel,
        itens: [],
      },
      novoEstiloConfig: null, // Nenhuma alteração nos limites
    }
  }

  const numClasses = Number(estiloConfig.classes) || 5
  const coresOriginais =
    Array.isArray(estiloConfig.colors) && estiloConfig.colors.length > 0
      ? estiloConfig.colors
      : PALETA_PADRAO

  const paletaCores = coresOriginais.map(aplicarAlphaHex)

  let intervalos = []
  let novoEstiloConfig = null

  const temLimitesValidos =
    Array.isArray(estiloConfig.limites) && estiloConfig.limites.length === numClasses

  if (temLimitesValidos) {
    const min = Math.min(...valores)
    intervalos = [min, ...estiloConfig.limites]
  } else {
    // Re-calcula limites dinamicamente
    const min = Math.min(...valores)
    const max = Math.max(...valores)
    intervalos = calcularIntervalosIguais(min, max, numClasses)

    // Prepara o objeto atualizado caso o modal de estilos precise do novo cache
    novoEstiloConfig = {
      ...estiloConfig,
      limites: intervalos.slice(1),
    }
  }

  // Aplica os estilos na camada
  camadaVetorial.setStyle((feature) => {
    const val = feature.get('valorVariavel')

    if (val === null || val === undefined || isNaN(val)) {
      return estiloPadrao
    }

    let classeIndex = 0
    for (let i = 0; i < numClasses; i++) {
      const inf = intervalos[i]
      const sup = intervalos[i + 1]
      const atendeLimiteSuperior = i === numClasses - 1 ? val <= sup : val < sup

      if (val >= inf && atendeLimiteSuperior) {
        classeIndex = i
        break
      }
    }

    const corHex = paletaCores[classeIndex] || '#cccccc'

    return new Style({
      fill: new Fill({ color: corHex }),
      stroke: new Stroke({ color: '#ffffff', width: 1 }),
    })
  })

  // Monta a estrutura de itens da legenda
  const itensLegenda = []
  for (let i = 0; i < numClasses; i++) {
    const inf = intervalos[i]
    const sup = intervalos[i + 1]

    const infFormatado = inf.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
    const supFormatado = sup.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

    itensLegenda.push({
      cor: paletaCores[i] || '#cccccc',
      rotulo: `${infFormatado} - ${supFormatado}`,
    })
  }

  // CASO 2: Retorno unificado com Legenda + Configurações Atualizadas
  return {
    legenda: {
      tipo: 'coroplético',
      titulo: estiloConfig.variavel,
      itens: itensLegenda,
    },
    novoEstiloConfig, // Envia o novo estiloConfig se ele tiver sido recalculado, ou null se não mudou
  }
}

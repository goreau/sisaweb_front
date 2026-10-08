import { gerarPontosAleatorios } from './geraMimos.js'

self.onmessage = function (e) {
  const { geojson, quantidade, raio } = e.data // passe apenas dados serializáveis

  // Executa o cálculo pesado na thread secundária
  const pontos = gerarPontosAleatorios(geojson, quantidade, raio)

  // Envia os resultados de volta para a thread principal
  self.postMessage(pontos)
}

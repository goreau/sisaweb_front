import { jsPDF } from 'jspdf'

/**
 * Exporta qualquer mapa do OpenLayers para PDF
 * @param {import('ol/Map').default} map - Instância do mapa OpenLayers
 * @param {Object} options - Configurações extras do relatório
 * @param {string} options.titulo - Título que aparecerá no PDF
 * @param {string} options.nomeArquivo - Nome do arquivo para download
 */
export async function exportarMapaParaPDF(map, options = {}) {
  const { titulo = 'Relatório do Mapa', nomeArquivo = 'mapa.pdf' } = options

  return new Promise((resolve, reject) => {
    try {
      // Dispara quando o OpenLayers termina de renderizar todas as camadas
      map.once('rendercomplete', () => {
        const size = map.getSize()
        const mapCanvas = document.createElement('canvas')
        mapCanvas.width = size[0]
        mapCanvas.height = size[1]
        const mapContext = mapCanvas.getContext('2d')

        // Compõe os canvases das camadas
        Array.from(map.getViewport().querySelectorAll('.ol-layer canvas')).forEach((canvas) => {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)

            const transform = canvas.style.transform
            let matrix
            if (transform) {
              // eslint-disable-next-line no-useless-escape
              const match = transform.match(/^matrix\(([^\(]*)\)$/)
              matrix = match ? match[1].split(',').map(Number) : [1, 0, 0, 1, 0, 0]
            } else {
              matrix = [1, 0, 0, 1, 0, 0]
            }
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix)
            mapContext.drawImage(canvas, 0, 0)
          }
        })

        mapContext.globalAlpha = 1

        // Montagem do documento PDF
        const pdf = new jsPDF('landscape', 'mm', 'a4')

        // Exemplo: Cabeçalho do relatório
        pdf.setFontSize(16)
        pdf.text(titulo, 14, 15)
        pdf.setFontSize(10)
        pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22)

        // Inserção da imagem do mapa
        const imgData = mapCanvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 14, 28, 269, 165) // Dimensões ajustadas para A4

        pdf.save(nomeArquivo)
        resolve(true)
      })

      // Força a re-renderização para acionar o 'rendercomplete'
      map.renderSync()
    } catch (error) {
      reject(error)
    }
  })
}

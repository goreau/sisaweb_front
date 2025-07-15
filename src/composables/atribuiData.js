import { isRef } from 'vue';

/**
 * Preenche as propriedades que são refs dentro do objeto target com os valores do objeto source
 * @param {Object} target Objeto reactive contendo refs
 * @param {Object} source Objeto plano com dados da API
 * @param {boolean} trimStrings Opcional, default true
 */
export function useAtribuirData(target, source, trimStrings = true) {
  Object.keys(target).forEach(key => {
    const campo = target[key];
    const valor = source[key];
    if (isRef(campo) && valor !== undefined) {
      campo.value = trimStrings && typeof valor === 'string' ? valor.trim() : valor;
    }
  });
}

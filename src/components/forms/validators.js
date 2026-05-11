import {
  helpers,
  minLength,
  maxLength,
  required,
  minValue,
  maxValue,
  between,
  numeric,
  sameAs,
  integer,
  email,
  requiredIf,
  decimal,
} from '@vuelidate/validators'

import { differenceInMonths, parseISO, isDate, isValid } from 'date-fns'

export const required$ = helpers.withMessage('Esse campo é obrigatório', required)

export const numeric$ = helpers.withMessage('Apenas caracteres numéricos são aceitos', numeric)

export const integer$ = helpers.withMessage('Apenas números inteiros são permitidos', integer)

export const decimal$ = helpers.withMessage('Informe um número válido', decimal)

export const email$ = helpers.withMessage('Informe um email válido', email)

export const combo$ = (min) =>
  helpers.withMessage('Escolha um valor para esse campo.', minValue(min))

//export const sameAs$ = (field) => helpers.withMessage('Os campos não conferem', sameAs(field))
export const sameAs$ = (refSenha) =>
  helpers.withMessage(`Os campos não conferem ${refSenha}`, sameAs(refSenha))

export const minLength$ = (min) =>
  helpers.withMessage(
    ({ $params }) => `O tamanho mínimo permitido é de ${$params.min} caracteres.`,
    minLength(min),
  )

export const maxLength$ = (max) =>
  helpers.withMessage(
    ({ $params }) => `O tamanho máximo permitido é de ${$params.max} caracteres.`,
    maxLength(max),
  )

export const minValue$ = (min) =>
  helpers.withMessage(({ $params }) => `O valor mínimo permitido é ${$params.min}.`, minValue(min))

export const maxValue$ = (max) =>
  helpers.withMessage(({ $params }) => `O valor máximo permitido é ${$params.max}.`, maxValue(max))

export const between$ = (min, max) =>
  helpers.withMessage(
    ({ $params }) => `O valor deve estar entre ${$params.min} e ${$params.max}.`,
    between(min, max),
  )

export const requiredIf$ = (cond) =>
  helpers.withMessage('Informe o valor desse campo.', requiredIf(cond))

export const minLengthIfFilled$ = (min) =>
  helpers.withMessage(
    ({ $params }) => `O tamanho mínimo permitido é de ${$params.min} caracteres.`,
    helpers.withParams(
      { min, type: 'minLengthIfFilled' }, // Registra o parâmetro aqui
      (value) => !helpers.req(value) || value.length >= min,
    ),
  )
/*export const minLengthIfFilled$ = (min) =>
  helpers.withMessage(
    ({ $params }) => `O tamanho mínimo permitido é de ${$params.min} caracteres.`,
    (value) => value.length === 0 || value.length >= min,
  )*/

export const coordenada$ = helpers.withMessage(
  'O valor deve ser um número decimal, negativo ou zero',
  (value) => {
    if (value === null || value === '') return true // Permitir vazio se necessário
    return /^-?\d+(\.\d+)?$/.test(value) && parseFloat(value) <= 0
  },
)

export const horaValida$ = helpers.withMessage('Hora inválida. Use o formato HH:mm', (value) => {
  if (!value) return true // permite vazio, remova se quiser obrigar
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
})
//export const minLengthIfFilled$ = (min) => helpers.withMessage(({ $params }) => `O tamanho mínimo permitido é de ${$params.min} caracteres.`,   minLength(min) || maxLength(0))
export const minValueIf$ = (min, cond) =>
  helpers.withMessage('Informe um valor para esse campo.', (value, vm) => {
    const active = typeof cond === 'function' ? cond(vm) : cond
    if (!active) return true // condição inativa
    if (value === null || value === undefined || value === '') return true // vazio passa
    return Number(value) >= min // aplica minValue
  })

export const maxMonths$ = (max) => {
  return helpers.withMessage(
    `O intervalo máximo permitido é de ${max} meses`,
    (value, siblingState) => {
      // 1. Pega o valor bruto do campo inicial
      const startDateRaw = siblingState.dt_inicial

      // Se algum estiver vazio, não valida o intervalo (o 'required' cuida disso)
      if (!value || !startDateRaw) return true

      try {
        // 2. Converter Data Inicial
        let start
        if (isDate(startDateRaw)) {
          start = startDateRaw
        } else if (typeof startDateRaw === 'string') {
          // Se for string do <input type="date">, usa parseISO
          // Se for outro formato de string, usa new Date()
          start = startDateRaw.includes('-') ? parseISO(startDateRaw) : new Date(startDateRaw)
        } else {
          start = new Date(startDateRaw)
        }

        // 3. Converter Data Final (value)
        let end
        if (isDate(value)) {
          end = value
        } else if (typeof value === 'string') {
          end = value.includes('-') ? parseISO(value) : new Date(value)
        } else {
          end = new Date(value)
        }

        // 4. Verificação de validade final
        if (!isValid(start) || !isValid(end)) return false

        // 5. Cálculo
        const diff = differenceInMonths(end, start)

        // Se a data final for menor que a inicial, diff será negativo (também é válido checkar)
        return diff >= 0 && diff <= max
      } catch (e) {
        console.error('Erro no validador maxMonths$:', e)
        return false
      }
    },
  )
}

export const isAfterOrEqual$ = (startDateField) => {
  return helpers.withMessage(
    'A data final não pode ser anterior à data inicial',
    (value, siblingState) => {
      const startDateRaw = siblingState[startDateField]
      if (!value || !startDateRaw) return true

      const start = isDate(startDateRaw) ? startDateRaw : parseISO(startDateRaw)
      const end = isDate(value) ? value : parseISO(value)

      return isValid(start) && isValid(end) && end >= start
    },
  )
}

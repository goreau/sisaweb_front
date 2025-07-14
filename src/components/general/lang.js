export default {
  'pt-br': {
    columns: {
      name: 'Nome', // replace the title of column name with the value "Name"
    },
    ajax: {
      loading: 'carregando', // ajax loader text
      error: 'Erro', // ajax error text
    },
    groups: {
      item: 'item', // the singular  for item
      items: 'itens', // the plural for items
    },
    pagination: {
      page_size: 'Registros por Página', // label for the page size select element
      page_title: 'Mostrar Página', // tooltip text for the numeric page button, appears in front of the page number
      first: 'Primeira', // text for the first page button
      first_title: 'Primeira Página', // tooltip text for the first page button
      last: 'Última',
      last_title: 'Última Página',
      prev: 'Anterior',
      prev_title: 'Página Anterior',
      next: 'Próxima',
      next_title: 'Próxima Página',
      all: 'Todas',
      counter: {
        showing: "Exibindo",
        of: "de",
        rows: "linhas",
        pages: "páginas",
      }
    },
    headerFilters: {
      default: 'Filtrar Coluna...', // default header filter placeholder text
      columns: {
        name: 'Filtrar Nome...', // replace default header filter text for column name
      },
    },
  },
}

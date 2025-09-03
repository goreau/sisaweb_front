// stores/report.js
import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', {
  state: () => ({
    tableData: [],
    tableColumns: [],
    tableOptions: [],
    tableTitle: ''
  }),
  actions: {
    setTable(data, columns, options, title) {
      this.tableData = data
      this.tableColumns = columns
      this.tableOptions = options
      this.tableTitle = title
    }
  }
})

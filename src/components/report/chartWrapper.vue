<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const props = defineProps({
  type: { type: String, required: true }, // "bar" | "line" | "pie"
  title: { type: String, default: '' },
  data: { type: Array, required: true }, // linhas [{...}]
  columns: { type: Array, required: true }, // colunas [{field, headerName}]
})

const chartRef = ref(null)
const containerRef = ref(null)
const legends = ref([])
const showTitle = ref('')

const options = computed(() => {
  // 1ª coluna = eixo X (ex: mes)
  const categoryCol = props.columns[0]
  const valueCols = props.columns.slice(1) // demais colunas = séries

  const labels = props.data.map((row) => row[categoryCol.field])

  let series
  if (props.type === 'pie') {
    // pie usa só a primeira coluna de valor
    const firstValueCol = valueCols[0]
    series = [
      {
        name: firstValueCol.headerName,
        type: 'pie',
        radius: '50%',
        data: props.data.map((row) => ({
          name: row[categoryCol.field],
          value: row[firstValueCol.field],
        })),
      },
    ]
  } else {
    series = valueCols.map((col) => ({
      name: col.headerName,
      type: props.type,
      data: props.data.map((row) => row[col.field]),
    }))
  }

  return {
    title: { text: showTitle.value, left: 'center' },
    tooltip: { trigger: props.type === 'pie' ? 'item' : 'axis' },
    legend: { top: 'bottom' },
    grid: { containLabel: true },
    xAxis:
      props.type !== 'pie'
        ? {
            type: 'category',
            data: labels,
            name: legends.value[1],
            nameLocation: 'middle',
            nameGap: 30,
          }
        : undefined,
    yAxis:
      props.type !== 'pie'
        ? {
            type: 'value',
            name: legends.value[0],
            nameLocation: 'middle',
            nameGap: 50,
          }
        : undefined,
    series,
  }
})

function defineLegends() {
  legends.value = props.title.split(/ por | e /)

  if (props.type == 'pie') {
    showTitle.value = `${legends.value[0]} por ${legends.value[1]}`
  } else {
    showTitle.value = props.title
  }
}

watch(
  () => props.type,
  () => {
    defineLegends()
  }
)

onMounted(() => defineLegends())
</script>

<template>
  <div ref="containerRef" class="w-full h-96">
    <VChart ref="chartRef" :option="options" autoresize class="w-full h-full" />
  </div>
</template>

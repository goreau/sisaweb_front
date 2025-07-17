<template>
  <div class="columns is-centered" v-if="filtered">
    <div class="column is-2">
      <div class="field is-horizontal">
        <label class="label" style="padding-right: 2rem">Filtrar: </label>
        <label class="switch">
          <input type="checkbox" @change="toggleFilter($event)" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="column is-10" :style="{ visibility: filter ? 'visible' : 'hidden' }">
      <div class="columns">
        <div class="column is-3">
          <div class="select">
            <select v-model="form.field" class="input">
              <option value="0">-- Coluna --</option>
              <option v-for="(item, index) in cbColumns" :key="index" :value="item.field">
                {{ item.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="column is-3">
          <div class="field">
            <div class="select">
              <select v-model="form.type" class="input">
                <option value="0">-- Comparador --</option>
                <option value="=">igual a</option>
                <option value=">">maior que</option>
                <option value="<">menor que</option>
                <option value="!=">diferente de</option>
                <option value="like">contendo</option>
              </select>
            </div>
          </div>
        </div>
        <div class="column is-3">
          <div class="field has-addons">
            <input type="text" class="input" v-model="form.value" placeholder="Valor a filtrar" />
            <div class="control">
              <a class="button is-info" @click="setFilter">
                <span class="icon is-small">
                  <font-awesome-icon icon="fa-solid fa-search" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="column is-1">
          <button class="button is-success is-outlined" title="Limpar Filtros" @click="clearFilter">
            <span class="icon is-small">
              <font-awesome-icon icon="fa-solid fa-broom" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="has-text-right">
    <button id="download-csv" class="button is-link is-outlined is-small" @click="download_csv">
      <font-awesome-icon icon="fa-solid fa-file-csv" />
    </button>
    <button id="download-json" class="button is-info is-outlined is-small" @click="download_json">
      <font-awesome-icon icon="fa-solid fa-file-lines" />
    </button>
    <button id="download-xlsx" class="button is-success is-outlined is-small" @click="download_xlsx">
      <font-awesome-icon icon="fa-solid fa-file-excel" />
    </button>
    <button id="download-pdf" class="button is-danger is-outlined is-small" @click="download_pdf">
      <font-awesome-icon icon="fa-solid fa-file-pdf" />
    </button>
  </div>
  <br>
  <!--<Loader :active="isLoading" />-->
  <div v-if="extra">
    <div class="columns is-centered">
      <div class="column is-10"><b>{{ extra }}</b></div>
    </div>
    <br>
  </div>

  <div ref="table" id="myTable" class="is-striped"></div>
</template>

<script setup>
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import { ref, watch } from 'vue'
//import { ResponsiveLayoutModule } from 'tabulator-tables';
import lang from "./lang";
import { onMounted } from "vue";
//import Loader from "@/components/general/Loader.vue";

var tabulator = ref(null);
var form = ref({
  field: "0",
  type: "0",
  value: "",
});
const table = ref(null);
var arrFilter = ref([]);
var filter = ref(false);
var isLoading = ref(false);
var cbColumns = ref([]);


function setFilter() {
  let obj = form.value;

  const col = props.columns.filter((v) => v.field === obj.field, obj);

  var finalValue = obj.value;

  if (col[0].formatter == 'datetime') {
    finalValue = obj.value.split('/').reverse().join('-');
  }

  arrFilter.value.push({ field: obj.field, type: obj.type, value: finalValue });

  tabulator.value.setFilter(arrFilter.value);//obj.column, obj.operator, obj.value);

  localStorage.setItem(props.tableName, JSON.stringify(arrFilter.value));
}

function clearFilter() {
  isLoading.value = true;
  form.value.field = "0";
  form.value.type = "0";
  form.value.value = "";

  arrFilter.value = [];

  tabulator.value.clearFilter();
  localStorage.removeItem(props.tableName);
  isLoading.value = false;
}


function download_csv() {
  this.tabulator.download("csv", "data.csv");
}

function download_xlsx() {
  this.tabulator.download("xlsx", "data.xlsx", {
    sheetName: "Capop",
    exportConfig: {
      formatCells: (cell) => {
        let value = cell.getValue();

        // Verifica se o valor é numérico e não vazio
        if (!isNaN(value) && value !== "" && value !== null) {
          return Number(value); // Converte para número
        }

        return value; // Retorna o valor original para texto ou células vazias
      }
    }
  })
}

function download_pdf() {
  try {
    this.tabulator.download("pdf", "data.pdf", {
      orientation: "landscape", //set page orientation to portrait
      title: "Sistema Capop", //add title to report
    });
  } catch (err) {
    console.log(err);
    this.$router.go();
  }

}

function download_json() {
  this.tabulator.download("json", "data.json");
}

function toggleFilter(e) {
  this.filter = e.target.checked;
}

async function loadData(data) {
  isLoading.value = true;
  try {
    tabulator.value = new Tabulator(table.value, {
      columnHeaderVertAlign: "middle",
      langs: lang,
      locale: "pt-br",
      data: data, //link data to table
      responsiveLayout: true,
      layout: "fitColumns",
      placeholder: "Nenhum registro atende aos critérios escolhidos!",
      reactiveData: true, //enable data reactivity
      columns: props.columns, //define table columns
      pagination: "local",
      paginationSize: 10,
      paginationSizeSelector: [5, 10, 15, 20],
      movableColumns: true,
      paginationCounter: "rows",
    });

    cbColumns.value = props.columns.filter(el => el.title !== "Ações");


    tabulator.value.on("tableBuilt", function () {
      if (filter.value) {//&& me.tabulator.ta
        if (arrFilter.value.length > 0) {
          tabulator.value.setFilter(arrFilter.value);
        }
        // this.$router.go();
      }
      isLoading.value = false;
    });

  } catch (error) {
    console.log(error);
  } finally {
    //this.isLoading = false;
  }
}

const props = defineProps({
  tableData: Array,
  columns: Array,
  filtered: Boolean,
  tableName: String,
  extra: String
})


watch(
  () => props.tableData,
  (newVal) => {
    loadData(newVal)
  },
)

onMounted(() => {
  let externalScript = document.createElement("script");
  externalScript.setAttribute(
    "src",
    "https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js"
  );
  document.head.appendChild(externalScript);

  let externalScript1 = document.createElement("script");
  externalScript1.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"
  );
  document.head.appendChild(externalScript1);

  let externalScript2 = document.createElement("script");
  externalScript2.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"
  );
  document.head.appendChild(externalScript2);



  let stFilter = JSON.parse(localStorage.getItem(props.tableName));

  if (stFilter) {
    if (Array.isArray(stFilter)) {
      arrFilter.value = stFilter;
      var obj = stFilter[0];
      form.value = obj;//JSON.parse(obj);
      filter.value = true;
    } else {
      localStorage.removeItem(props.tableName);
    }
  }
  //this.isLoading = false;

});
</script>
<style scoped>
#myTable {
  background-color: #f2f3f8;
  border: 1px solid #333;
  border-radius: 5px;
}


.tabela {
  width: 800px;
  height: auto;
}

.button {
  margin-right: 1rem;
}

/** slider classes */
.switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: -0.2rem;
  left: 0;
  right: 0;
  bottom: -0.2rem;
  background-color: #8dacf3;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1rem;
  width: 1rem;
  left: 0.5rem;
  bottom: 0.5rem;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: #2a455a;
}

input:focus+.slider {
  box-shadow: 0 0 1px #2a455a;
}

input:checked+.slider:before {
  -webkit-transform: translateX(1rem);
  -ms-transform: translateX(1rem);
  transform: translateX(1rem);
}

/* Rounded sliders */
.slider.round {
  border-radius: 0.75rem;
}

.slider.round:before {
  border-radius: 50%;
}

.tabulator-row .tabulator-cell {
  padding: .5em 2em .5 .75em;
}
</style>

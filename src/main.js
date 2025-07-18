import '../node_modules/bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import 'tabulator-tables/dist/css/tabulator_bulma.min.css'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faPlusCircle, faBroom,
  faShirt, faList, faPersonWalking, faPersonCircleCheck, faMicroscope, faMoneyBillTransfer, faCalendarDays, faWrench, faRepeat, faMobileScreen, faEye, faPowerOff, faHexagonNodes,
  faPlus, faGears, faSchool
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faPlusCircle, faBroom,
  faShirt, faList, faPersonWalking, faPersonCircleCheck, faMicroscope, faMoneyBillTransfer, faCalendarDays, faWrench, faRepeat, faMobileScreen, faEye, faPowerOff, faHexagonNodes,
  faPlus, faGears, faSchool);

const options = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
};

const app = createApp(App)

app.use(Toast, options);
app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

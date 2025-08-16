import '../node_modules/bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import decimal from './directives/decimal';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faPlusCircle, faBroom,
  faShirt, faList, faPersonWalking, faPersonCircleCheck, faMicroscope, faMoneyBillTransfer, faCalendarDays, faWrench, faRepeat, faMobileScreen, faEye, faPowerOff, faHexagonNodes,
  faPlus, faGears, faSchool, faGlassWaterDroplet, faFolderTree, faHouseCircleCheck, faSchoolCircleCheck, faMosquito, faSmog,
  faSprayCan, faPeopleGroup, faSquareVirus, faArrowsTurnRight, faArrowRight, faBookAtlas, faLocationDot, faChartBar, faChartColumn,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faPlusCircle, faBroom,
  faShirt, faList, faPersonWalking, faPersonCircleCheck, faMicroscope, faMoneyBillTransfer, faCalendarDays, faWrench, faRepeat, faMobileScreen, faEye, faPowerOff, faHexagonNodes,
  faPlus, faGears, faSchool, faGlassWaterDroplet, faFolderTree, faHouseCircleCheck, faSchoolCircleCheck, faMosquito, faSmog, faSprayCan, faPeopleGroup, faSquareVirus, faArrowsTurnRight,
  faArrowRight, faBookAtlas, faLocationDot, faChartBar, faChartColumn);

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
app.directive('decimal', decimal);
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('DatePicker', Datepicker)
app.mount('#app')

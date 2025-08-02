import { cadastrosMenu } from './cadastros.js';
import { atividadesMenu } from './atividades.js'
import { gerenciamentoMenu } from './gerenciamento.js'
import { homeMenu } from './home.js'
import { usuariosMenu } from './usuarios.js'
import { mobileMenu } from './mobile.js'
import { reportMenu } from './report.js'

export const menuData = [
  {
    hiddenOnCollapse: true,
  },
  {
    href: "/home",
    title: "Home",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-house",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: homeMenu
  },
  {
    href: "",
    title: "Usuarios",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-users",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: usuariosMenu
  },
  {
    href: "",
    title: "Cadastros",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-folder-tree",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: cadastrosMenu
  },
  {
    href: "",
    title: "Gerenciamento",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-gears",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: gerenciamentoMenu
  },
  {
    href: "",
    title: "Atividades",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-person-walking",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: atividadesMenu
  },
  {
    href: "",
    title: "Mobile",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-mobile-screen",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: mobileMenu
  },
  {
    href: "",
    title: "Relatórios",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-mobile-screen",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: reportMenu
  },
  ////******* */

];

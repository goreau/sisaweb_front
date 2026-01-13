import { cadastrosMenu } from './cadastros.js'
import { atividadesMenu } from './atividades.js'
import { gerenciamentoMenu } from './gerenciamento.js'
import { homeMenu } from './home.js'
import { usuariosMenu } from './usuarios.js'
import { mobileMenu } from './mobile.js'
import { reportMenu } from './report.js'
import { referenciaMenu } from './referencia.js'
import { ajudaMenu } from './ajuda.js'
import { utilitariosMenu } from './utilitarios.js'

export const menuData = [
  {
    hiddenOnCollapse: true,
  },
  {
    href: '/home',
    title: 'Home',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-house',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: homeMenu,
  },
  {
    href: '',
    title: 'Ajuda',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-circle-question',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: ajudaMenu,
  },
  {
    href: '',
    title: 'Usuarios',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-users',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: usuariosMenu,
  },
  {
    href: '',
    title: 'Cadastros',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-folder-tree',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: cadastrosMenu,
  },
  {
    href: '',
    title: 'Gerenciamento',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-gears',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: gerenciamentoMenu,
  },
  {
    href: '',
    title: 'Utilitarios',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-screwdriver-wrench',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: utilitariosMenu,
  },
  {
    href: '',
    title: 'Atividades',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-person-walking',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: atividadesMenu,
  },
  {
    href: '',
    title: 'Mobile',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-mobile-screen',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: mobileMenu,
  },
  {
    href: '',
    title: 'Relatórios',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-file-lines',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: reportMenu,
  },
  {
    href: '',
    title: 'Referências',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-book-atlas',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: referenciaMenu,
  },
  ////******* */
]

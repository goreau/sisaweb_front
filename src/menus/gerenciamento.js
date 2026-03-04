/*import { useCurrentUser } from '@/composables/currentUser'

const { currentUser } = useCurrentUser()
var notAdm = false

let cUser = currentUser
if (cUser.value) {
  notAdm = cUser.value.tipo > 1
}*/

var notAdm = false

export const gerenciamentoMenu = [
  {
    href: '',
    title: 'Ciclos de Visita',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-repeat',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: [
      {
        href: '/ciclo/0',
        title: 'Novo',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-plus',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/ciclos',
        title: 'Consultar',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-search',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
    ],
  },
  {
    href: '',
    title: 'Validação de ADL',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-check',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: [
      {
        href: '/valAdl/0',
        title: 'Novo',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-plus',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/valAdls',
        title: 'Consultar',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-search',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
    ],
  },
  {
    href: '',
    title: 'Exclusão Segura',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-trash-can',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: [
      {
        href: '/duplicaCensitario',
        title: 'Censitário',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicaQuarteirao',
        title: 'Quarteirao',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicaImovel',
        title: 'Imóvel Cadastrado',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicaCadOvi',
        title: 'Ovitrampa (Cadastro)',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicaCadastroOvi',
        title: 'Ovitrampa (Cadastro - Lista)',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicaOvitrampa',
        title: 'Ovitrampa (Pesquisa)',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/duplicauser',
        title: 'Usuário Ativo',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
    ],
  },
  {
    href: '',
    title: 'Alterar Proprietário',
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-people-arrows',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: [
      {
        href: '/trocaUserIm',
        title: 'Imóveis Cadastrados',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/trocaUserVC',
        title: 'Visitas a imóveis',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/trocaUserCad',
        title: 'Cadastros',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/trocaUserCadParc',
        title: 'Cadastros - Parcial',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-arrow-right',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
    ],
  },
  {
    href: '',
    title: 'Conta Ovos',
    disabled: notAdm,
    icon: {
      element: 'font-awesome-icon',
      attributes: {
        icon: 'fa-solid fa-braille',
        size: 'lg',
        transform: 'shrink-8',
      },
    },
    child: [
      {
        href: '/contaOvos/0',
        title: 'Novo',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-plus',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/contaOvoss',
        title: 'Consultar',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-search',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
      {
        href: '/contaOvosLogs',
        title: 'Logs de Envio',
        icon: {
          element: 'font-awesome-icon',
          attributes: {
            icon: 'fa-solid fa-file-text',
            size: 'lg',
            transform: 'shrink-8',
          },
        },
      },
    ],
  },
]

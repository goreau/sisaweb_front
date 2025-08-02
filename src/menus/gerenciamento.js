export const gerenciamentoMenu = [
  {
    href: "",
    title: "Ciclos de Visita",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-hexagon-nodes",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "/ciclo/0",
        title: "Novo",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-plus",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/ciclos",
        title: "Consultar",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-search",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
    ],
  },
  {
    href: "",
    title: "Validação de ADL",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-hexagon-nodes",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "/valAdl/0",
        title: "Novo",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-plus",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/valAdls",
        title: "Consultar",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-search",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
    ],
  },
  {
    href: "",
    title: "Exclusão Segura",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-arrows-turn-right",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "/duplicaCensitario",
        title: "Censitário",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/duplicaQuarteirao",
        title: "Quarteirao",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/duplicaImovel",
        title: "Imóvel Cadastrado",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/duplicauser",
        title: "Usuário Ativo",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
    ],
  },
  {
    href: "",
    title: "Alterar Proprietário",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-arrows-turn-right",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "/trocaUserIm",
        title: "Imóveis Cadastrados",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/trocaUserVC",
        title: "Visitas a imóveis",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/trocaUserCad",
        title: "Cadastros",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-arrow-right",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
    ]
  }
]

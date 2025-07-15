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
    child: [
      {
        href: "/mycad",
        title: "Meu Cadastro",
      },
      {
        href: "/ajuda",
        title: "Materiais Auxiliares",
      },
      {
        href: "/",
        title: "Sair",
      },
    ],
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
    child: [
      {
        href: "/user",
        title: "Novo",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-user",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
      {
        href: "/users",
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
      {
        href: "/troca",
        title: "Excluir",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-trash",
            size: "lg",
            transform: "shrink-8",
          },
        },
      },
    ],
  },
  {
    href: "",
    title: "Cadastros",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-gears",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "",
        title: "Área",
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
            href: "/area",
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
            href: "/areas",
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
        title: "Censitário",
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
            href: "/censitario",
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
            href: "/censitarios",
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
        title: "Quarteirão",
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
            href: "/quarteirao",
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
            href: "/quarteiraos",
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
        title: "Imóvel",
        icon: {
          element: "font-awesome-icon",
          attributes: {
            icon: "fa-solid fa-school",
            size: "lg",
            transform: "shrink-8",
          },
        },
        child: [
          {
            href: "/imovel",
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
            href: "/imovels",
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
      //**** */
    ]
  }



];

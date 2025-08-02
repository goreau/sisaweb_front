export const reportMenu = [
  {
    href: "",
    title: "Cadastros",
    icon: {
      element: "font-awesome-icon",
      attributes: {
        icon: "fa-solid fa-square-virus",
        size: "lg",
        transform: "shrink-8",
      },
    },
    child: [
      {
        href: "/mainReport/cadastro/cadResumoMunicipio",
        title: "Resumo de Município",
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
        href: "/mainReport/cadastro/cadResumoImCadastrado",
        title: "Resumo de Imóveis Cadastrados",
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
]

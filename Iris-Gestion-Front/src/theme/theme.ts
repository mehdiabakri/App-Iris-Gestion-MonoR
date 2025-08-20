import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50:  "#ffffffff",  // blanc
      100: "#FECDEC",  // très clair, pastel
      200: "#feebc8",  // pêche clair
      300: "#fcd088",  // violet doux
      400: "#94DDBC",  // vert clair
      500: "#B184BB",  // violet doux
      600: "#285E61",  // vert foncé
      700: "#333333",  // Gris foncé
},
  },
  fonts: {
    heading: `'Shanti', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  config: {
    initialColorMode: "light", // ou "dark"
    useSystemColorMode: false,
  },
  styles: {
    global: {
      "body": {
        bg: "brand.50",
      }
    }
  }
});

export default theme;
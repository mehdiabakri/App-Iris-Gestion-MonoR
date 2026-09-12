import { extendTheme } from "@chakra-ui/react";

const myCustomYellow = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#F8DE29",
  500: "#fef08a",
};

const myCustomGray = {
  50: "#f9fafb",  // Gris ultra clair (parfait pour les fonds de cartes)
  100: "#f3f4f6", // Gris très clair (pour les bordures douces)
  200: "#e5e7eb", // Gris clair (hover sur les boutons gris)
  300: "#d1d5db", // Gris moyen clair
  400: "#9ca3af", // Gris moyen (parfait pour les textes secondaires / sous-titres)
  500: "#6b7280", // Gris principal (parfait pour les icônes discrètes)
  600: "#4b5563",
  700: "#374151", // Gris foncé (idéal pour le texte principal)
  800: "#1f2937",
  900: "#111827", // Presque noir (titres importants ou mode sombre)
};

const theme = extendTheme({
  breakpoints: {
    sm: "30em", // 480px - Mobile
    md: "48em", // 768px
    tablet: "59em", //
    lg: "62em", // 992px - Laptop
    xl: "80em", // 1280px - Écran large
    "2xl": "96em", // 1536px - Très grand écran
  },

  colors: {
    brand: {
      50: "#ffffff",
      100: "#ffe3e6ff",
      200: "#4f6d7a",
      300: "#ffbb6eff",
      400: "#f3f4f6",
      500: "#F8DE29",
      600: "#FFF7C0",
      700: "#000000",
    },
    yellow: myCustomYellow,
    gray: myCustomGray,
  },

  fonts: {
    heading: `'Shanti', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "brand.700",
      },
    },
  },
});

export default theme;

import { extendTheme } from "@chakra-ui/react";

const myCustomYellow = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#F8DE29",
  500: "#fef08a",
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
      500: "#F8DE29",
      600: "#FFF7C0",
      700: "#000000",
    },
    yellow: myCustomYellow,
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

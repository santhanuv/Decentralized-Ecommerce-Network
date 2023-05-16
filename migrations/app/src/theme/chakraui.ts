import { extendTheme } from "@chakra-ui/react";

const colors = {
  black: {
    100: "#373B3B",
    200: "#1E2021",
  },
  blue: {
    100: "#497FE5",
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  config,
  styles: {
    global: { body: { bg: "black.200", color: "white" } },
  },
});

export { theme };

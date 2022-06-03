import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";

function App() {
  const [darkmode, setDarkmode] = useState(false);
  const paletteType = darkmode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });
  const toggleDark = () => {
    setDarkmode(!darkmode);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header toggleDarkMode={toggleDark} isDarkMode={darkmode} />
        <Container>
          <Catalog />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

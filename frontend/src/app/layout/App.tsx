import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import { useStoreContext } from "../Context/StoreContext";
import { getCookie } from "../util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";

function App() {
  const dispatch = useAppDispatch();
  const { basket } = useAppSelector((state) => state.basket);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookie = getCookie("buyerId");
    if (cookie) {
      agent.Basket.get()
        .then((basket) => dispatch(setBasket(basket)))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]);

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
  if (loading) return <LoadingComponent message="Loading app..." />;
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer position="bottom-left" />
        <CssBaseline />
        <Header toggleDarkMode={toggleDark} isDarkMode={darkmode} />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

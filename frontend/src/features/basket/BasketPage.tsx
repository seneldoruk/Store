import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/Context/StoreContext";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { getAsCurrency } from "../../app/util";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";

export default function BasketPage() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    name: "",
  });
  const incrementQuantity = (productId: number, name: string) => {
    setLoadingStatus({
      loading: true,
      name: name,
    });
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .finally(() =>
        setLoadingStatus({
          loading: false,
          name: "",
        })
      );
  };

  const decrementQuantity = (productId: number, name: string, quantity = 1) => {
    setLoadingStatus({
      loading: true,
      name: name,
    });
    agent.Basket.deleteItem(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .finally(() =>
        setLoadingStatus({
          loading: false,
          name: "",
        })
      );
  };
  if (!basket) return <Typography variant="h3">Basket is empty</Typography>;
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{getAsCurrency(item.price)}</TableCell>
                <TableCell align="center">
                  <LoadingButton
                    loading={
                      loadingStatus.loading &&
                      loadingStatus.name === "rem" + item.productId
                    }
                    onClick={() =>
                      decrementQuantity(item.productId, "rem" + item.productId)
                    }
                    color="error"
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    loading={
                      loadingStatus.loading &&
                      loadingStatus.name === "add" + item.productId
                    }
                    onClick={() =>
                      incrementQuantity(item.productId, "add" + item.productId)
                    }
                    color="primary"
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  {getAsCurrency(item.price * item.quantity)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    loading={
                      loadingStatus.loading &&
                      loadingStatus.name === "del" + item.productId
                    }
                    onClick={() =>
                      decrementQuantity(
                        item.productId,
                        "del" + item.productId,
                        item.quantity
                      )
                    }
                    color="error"
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

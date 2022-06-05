import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { getAsCurrency } from "../../app/util";
import { useStoreContext } from "../../app/Context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const { id } = useParams<{ id: string }>();

  function getQuantityInBasket() {
    let tmp = basket?.items.find(
      (item) => item.productId === parseInt(id!)
    )?.quantity;
    if (tmp === null || tmp === undefined) tmp = 0;
    return tmp;
  }

  const inputChange = (event: any) => {
    if (event.target.value > 0)
      setQuantityInBasket(parseInt(event.target.value));
  };

  const updateCart = async () => {
    setSubmitting(true);
    if (quantityInBasket > initialQuantity) {
      agent.Basket.addItem(parseInt(id!), quantityInBasket - initialQuantity)
        .then((basket) => setBasket(basket))
        .finally(() => setSubmitting(false));
    } else {
      agent.Basket.deleteItem(parseInt(id!), initialQuantity - quantityInBasket)
        .then(() =>
          removeItem(parseInt(id!), initialQuantity - quantityInBasket)
        )
        .finally(() => setSubmitting(false));
      console.log("end");
    }
  };

  const [quantityInBasket, setQuantityInBasket] = useState(getQuantityInBasket);
  const initialQuantity = getQuantityInBasket();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Catalog.details(parseInt(id!))
      .then((product) => setProduct(product))
      .finally(() => setLoading(false));
  }, [id, quantityInBasket]);

  if (isLoading)
    return <LoadingComponent message="Loading product..."></LoadingComponent>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product?.pictureUrl}
          alt={product?.description}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product?.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4">
          {product ? getAsCurrency(product.price) : null}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product?.description}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product?.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product?.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity Available</TableCell>
                <TableCell>{product?.quantity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={inputChange}
              variant="outlined"
              type="number"
              fullWidth
              value={quantityInBasket}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              loading={isSubmitting}
              disabled={quantityInBasket === initialQuantity}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              onClick={updateCart}
            >
              {initialQuantity > 0 ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

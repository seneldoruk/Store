import {
  Avatar,
  CardMedia,
  Card,
  Button,
  CardActions,
  CardContent,
  Typography,
  CardHeader,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import type {} from "@mui/lab/themeAugmentation";
import { useStoreContext } from "../../app/Context/StoreContext";
import { getAsCurrency } from "../../app/util";

interface Props {
  product: Product;
}
export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { setBasket } = useStoreContext();
  const handleAddItem = (productid: number): void => {
    setLoading(true);
    agent.Basket.addItem(productid)
      .then((basket) => {
        setBasket(basket);
      })

      .finally(() => setLoading(false));
  };
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
        image={product.pictureUrl}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5" component="div">
          {getAsCurrency(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={loading}
          onClick={() => handleAddItem(product.id)}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
}

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
  Typography,
} from "@mui/material";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.details(parseInt(id!))
      .then((product) => setProduct(product))
      .finally(() => setLoading(false));
  }, [id]);

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
          {product ? (product.price / 100).toFixed(2) : null}$
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
      </Grid>
    </Grid>
  );
}

import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  fetchProductsAsync,
  getFilters,
  productSelectors,
  resetProductParams,
  setProductParams,
} from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  RadioGroup,
  TextField,
  Radio,
  FormGroup,
  Checkbox,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import StorePagination from "../../app/components/StorePagination";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price (Descending)" },
  { value: "price", label: "Price (Ascending)" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const {
    loaded,
    status,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded) dispatch(fetchProductsAsync());
  }, [loaded]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(getFilters());
  }, [filtersLoaded]);

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;
  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <RadioButtonGroup
              options={sortOptions}
              selectedValue={productParams.orderBy}
              onChange={(event) => {
                dispatch(setProductParams({ pageNumber: 1 }));
                dispatch(setProductParams({ orderBy: event.target.value }));
              }}
            />
          </FormControl>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            options={brands}
            checked={productParams.brands}
            onChange={(brands) => {
              dispatch(setProductParams({ pageNumber: 1 }));
              dispatch(setProductParams({ brands: brands }));
            }}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            options={types}
            checked={productParams.types}
            onChange={(types) => {
              dispatch(setProductParams({ pageNumber: 1 }));
              dispatch(setProductParams({ types: types }));
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData && (
          <StorePagination
            metaData={metaData}
            onPageChange={(page) => {
              dispatch(setProductParams({ pageNumber: page }));
            }}
          />
        )}
      </Grid>
    </Grid>
  );
}

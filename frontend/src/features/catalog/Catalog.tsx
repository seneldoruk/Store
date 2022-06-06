import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const { loaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!loaded) dispatch(fetchProductsAsync());
  }, [loaded]);
  if (status === "loading")
    return <LoadingComponent message="Loading products..." />;
  return (
    <>
      <ProductList products={products} />
    </>
  );
}

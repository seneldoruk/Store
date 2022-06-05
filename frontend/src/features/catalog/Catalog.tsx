import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    agent.Catalog.list()
      .then((products) => setProducts(products))
      .finally(() => setLoading(false));
  }, []);
  if (isLoading) return <LoadingComponent message="Loading products..." />;
  return (
    <>
      <ProductList products={products} />
    </>
  );
}

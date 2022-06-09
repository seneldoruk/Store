import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [search, setSearch] = useState(productParams.search);
  const dispatch = useAppDispatch();
  const onChangeHandler = debounce((event: any) => {
    dispatch(setProductParams({ pageNumber: 1 }));
    dispatch(setProductParams({ search: event.target.value }));
  }, 1000);
  return (
    <TextField
      label="Search products"
      variant="outlined"
      value={search ?? ""}
      onChange={(event) => {
        setSearch(event.target.value);
        onChangeHandler(event);
      }}
      fullWidth
    />
  );
}

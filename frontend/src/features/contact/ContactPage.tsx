import { decrement, increment } from "./counterState";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { Button } from "@mui/material";

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { data, title } = useAppSelector((state) => state.counter);
  return (
    <>
      <h4>{data}</h4>
      <Button onClick={() => dispatch(increment(1))}>+</Button>
      <Button onClick={() => dispatch(decrement(1))}>-</Button>
    </>
  );
}

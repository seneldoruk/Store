import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function ServerError() {
  const history = useNavigate();
  const { state }: any = useLocation();

  return (
    <Container component={Paper}>
      <Typography variant="h5"> Internal Server Error </Typography>
      <Divider />
      <Button onClick={() => history("/catalog")}>Go Back</Button>
    </Container>
  );
}

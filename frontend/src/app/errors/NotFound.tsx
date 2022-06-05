import { Container, Paper, Typography, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container component={Paper} sx={{ height: 40 }}>
      <Typography gutterBottom variant="h5">
        Page not found
      </Typography>
      <Divider />
      <Button fullWidth component={Link} to="/catalog">
        Go back to shop
      </Button>
    </Container>
  );
}

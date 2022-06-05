import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<String[]>([]);
  const getValidationError = () => {
    agent.Errors.validationError().catch((err) => setValidationErrors(err));
  };
  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Error testing
      </Typography>
      <ButtonGroup fullWidth>
        <Button onClick={() => agent.Errors.get400Error()} variant="contained">
          Get 400 Error
        </Button>
        <Button onClick={() => agent.Errors.get401Error()} variant="contained">
          Get 401 error
        </Button>
        <Button onClick={() => agent.Errors.get500Error()} variant="contained">
          Get 500 error
        </Button>
        <Button onClick={() => agent.Errors.get404Error()} variant="contained">
          Get 404 error
        </Button>
        <Button onClick={() => getValidationError()} variant="contained">
          Get validation error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation errors </AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem>Error</ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}

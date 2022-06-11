import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { history } from "../../index";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { signInUser } from "./accountSlice";
import { useAppDispatch } from "../../app/store/configureStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "all" });

  const dispatch = useAppDispatch();

  async function submitForm(data: FieldValues) {
    await dispatch(signInUser(data));
    history.push("/catalog");
  }

  return (
    <Container
      component={Paper}
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            error={!!errors.username}
            margin="normal"
            fullWidth
            label="Username"
            autoFocus
            {...register("username", { required: "Username is required" })}
            helperText={!!errors.username && "Username required"}
          />
          <TextField
            error={!!errors.password}
            margin="normal"
            label="Password"
            fullWidth
            type="password"
            {...register("password", { required: "Password is required" })}
            helperText={!!errors.password && "Password required"}
          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

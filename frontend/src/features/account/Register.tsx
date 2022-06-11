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
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { history } from "../../index";

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "all" });

  const handleApiErrors = (returnedErrors: string[]) => {
    returnedErrors.forEach((error) => {
      if (error.toLowerCase().includes("password")) {
        console.log(error);
        setError("password", { message: error });
      }
      if (error.toLowerCase().includes("username")) {
        setError("username", { message: error });
      }
      if (error.toLowerCase().includes("email")) {
        setError("email", { message: error });
      }
    });
    console.log(errors);
  };

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
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) =>
            agent.Account.register(data)
              .then((res) => {
                toast.success("User is registered, you can login", {
                  toastId: "Login",
                });
                history.push("/login");
              })
              .catch((error) => {
                handleApiErrors(error);
              })
          )}
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
            helperText={errors?.email?.username ?? "Username required"}
          />
          <TextField
            error={!!errors.email}
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                message: "Email adress is not valid",
              },
            })}
            helperText={errors?.email?.message ?? "Email required"}
          />
          <TextField
            error={!!errors.password}
            margin="normal"
            label="Password"
            fullWidth
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: "Password is not complex enough",
              },
            })}
            helperText={errors?.password?.message ?? "Password required"}
          />

          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Link to="/login">{"Login"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

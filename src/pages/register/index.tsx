import { useState } from "react";
import {
  Button,
  Divider,
  TextField,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "../../styles/login.module.css";
import sidebarStyles from "../../styles/sidebar.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerType } from "../../types/authType";
import { userRegisterValidations } from "../../validation_schema/authValidation";
import { HandleRegister } from "@/services/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import AuthSidebar from "../../common/LayoutNavigations/authSideLayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { CreateFirebase } from "../../firebase/firebaseFunctions";
import { HandleUpdateFirebaseId } from "@/services/user";
const theme = createTheme();
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerType>({ resolver: yupResolver(userRegisterValidations) });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  //user registratin
  const onSubmit = async (event: any) => {
    setLoading(true);
    try {
      const res = await HandleRegister(event)
      if (res.status === 201) {
        const db_id = res?.data?.id;
        const email = res?.data?.email;
        const password = event?.password;
        const getFirebaseUser = await CreateFirebase(event, db_id)
        const firebase_id = getFirebaseUser?.user?.uid
        const loginData = { email, password }
        const reqData = { db_id, firebase_id };
        HandleUpdateFirebaseId(loginData, reqData)
        setTimeout(() => {
          router.push("/login");
        }, 1000);
        setLoading(false);
      }
    }
    catch (error) {
      setLoading(false);
    }
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main">
        <AuthSidebar />
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box className={styles.mainBoxContent}>
            <Typography
              component="h1"
              variant="h4"
              className={styles.mainBoxLabel}
            >
              Create Your Account
            </Typography>
            <Grid container>
              <Grid item className={styles.registerPage}>
                Already have an account?
                <Link href="/login" className={styles.signInUpColor}>
                  {" "}
                  Login
                </Link>
              </Grid>
            </Grid>
            <Box
              component="form"
              method="POST"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className={styles.mainBoxContentForm}
            >
              <TextField
                autoFocus
                margin="normal"
                fullWidth
                id="outlined-fname"
                label="First Name"
                {...register("first_name")}
              />
              {errors && errors.first_name
                ? ErrorShowing(errors?.first_name?.message)
                : ""}
              <TextField
                margin="normal"
                fullWidth
                {...register("last_name")}
                label="Last Name"
                id="outlined-lname"
              />
              {errors && errors.last_name
                ? ErrorShowing(errors?.last_name?.message)
                : ""}
              <TextField
                margin="normal"
                fullWidth
                id="outlined-email"
                label="Email Address"
                {...register("email")}
              />
              {errors && errors.email
                ? ErrorShowing(errors?.email?.message)
                : ""}
              <TextField
                margin="normal"
                fullWidth
                id="outlined-password"
                label="Password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              {errors && errors.password
                ? ErrorShowing(errors?.password?.message)
                : ""}
              <TextField
                margin="normal"
                fullWidth
                {...register("confirm_password")}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="outlined-confirm_password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              {errors && errors.confirm_password
                ? ErrorShowing(errors?.confirm_password?.message)
                : ""}
              {!loading ? (
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  id={sidebarStyles.muibuttonBackgroundColor}
                  className={styles.mainBoxButton}
                >
                  Register
                </Button>
              ) : (
                <LoadingButton
                  loading={loading}
                  fullWidth
                  size="large"
                  className={styles.mainBoxButton}
                  variant="outlined"
                  disabled
                >
                  <CircularProgressBar />
                </LoadingButton>
              )}
              <Box className={styles.mainBoxDividerBox}>
                <Divider className={styles.mainBoxDivider}> Or </Divider>
              </Box>
              <Box textAlign={"center"}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <Box
                      component={"img"}
                      src={"/Images/pages_icon/google.svg"}
                      width={"18px"}
                      height={"18px"}
                    />
                  }
                  className={styles.googleButtonStyle}
                >
                  Continue with Google
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </ThemeProvider>
  );
}

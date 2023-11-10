import * as React from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import AuthSidebar from "../../common/LayoutNavigations/authSideLayout";
import sidebarStyles from "../../styles/sidebar.module.css";
import styles from "../../styles/login.module.css";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import { resetPasswordType } from "@/types/authType";
import { yupResolver } from "@hookform/resolvers/yup";
import { userResetPasswordValidations } from "@/validation_schema/authValidation";
import { useForm } from "react-hook-form";
import { HandleResetPassword } from "@/services/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const theme = createTheme();

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordType>({
    resolver: yupResolver(userResetPasswordValidations),
  });
  const router: any = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const { token } = router.query;

  const onSubmit = async (event: any) => {
    const reqData = {
      ...event,
      token,
    };
    setLoading(true)
    try {
      const result = await HandleResetPassword(reqData)
      if (result) {
        setTimeout(() => {
          router.push('/login')
          localStorage.removeItem('forgotPasswordToken')
        }, 900);
        setLoading(false)
      }
    }
    catch (err) {
      setLoading(false)
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
      <ToastContainer />
      <Grid container component="main">
        <AuthSidebar />
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box className={styles.loginmainBoxContent}>
            <Typography
              component="h1"
              variant="h4"
              className={styles.mainBoxLabel}
            >
              Reset Password
            </Typography>
            <Grid container>
              <Grid item className="GlobalTextColor" sx={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif !important' }}>
                Reset your password
              </Grid>
            </Grid>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className={styles.mainBoxContentForm}
            >
              <TextField
                margin="normal"
                fullWidth
                id="outlined-new-password"
                label="New Password "
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoFocus
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
                  className={styles.mainBoxButton}
                  id={sidebarStyles.muibuttonBackgroundColor}
                >
                  Reset
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
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

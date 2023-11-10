import * as React from "react";
import {
  Button,
  Divider,
  Box,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthSidebar from "../../common/LayoutNavigations/authSideLayout";
import sidebarStyles from "../../styles/sidebar.module.css";
import styles from "../../styles/login.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordType } from "@/types/authType";
import { userForgotPasswordValidations } from "@/validation_schema/authValidation";
import { HandleForgotPassword } from "@/services/auth";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import Link from "next/link";
const theme = createTheme();
export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordType>({
    resolver: yupResolver(userForgotPasswordValidations),
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (event: any) => {
    const reqData: any = {
      to: event.email,
      emailType: "forgot_password",
    };

    const formData = new FormData();
    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }
    setLoading(true);
    await HandleForgotPassword(formData)
      .then((res) => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
              Forgot Password
            </Typography>
            <Grid container>
              <Grid item className="GlobalTextColor" sx={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif !important' }}>
                Forgot your password
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
                id="outlined-email"
                label="Email Address"
                {...register("email")}
                autoFocus
              />
              {errors && errors.email
                ? ErrorShowing(errors?.email?.message)
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
                  Send
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
              <Link
                href="/login"
                className="GlobalTextColor"
              >
                <Grid item sx={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif !important' }}>Back to sign in</Grid>
              </Link>
              <Box className={styles.mainBoxDividerBox}>
                <Divider className={styles.mainBoxDivider}> Or </Divider>
              </Box>
              <Box textAlign={"center"}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <Box
                      component={"img"}
                      src={"/Images/pages/google.svg"}
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
    </ThemeProvider>
  );
}

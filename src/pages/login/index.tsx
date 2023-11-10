import * as React from "react";
import { Button, Divider, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styles from "../../styles/login.module.css";
import sidebarStyles from "../../styles/sidebar.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthSidebar from "../../common/LayoutNavigations/authSideLayout";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { userLoginValidations } from "@/validation_schema/authValidation";
import { useForm } from "react-hook-form";
import { loginType } from "../../types/authType";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GenerateToken,
  HandleLogin,
  HandleLoginByGoogle,
  HandleRegister,
} from "@/services/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { LoginFirestore } from "../../firebase/firebaseFunctions";

const theme = createTheme();

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({ resolver: yupResolver(userLoginValidations) });
  const router: any = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (event: any) => {
    setLoading(true);
    await HandleLogin(event)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.userDetails?.role_id === 1) {
            router.push("/profile");
          } else {
            router.push("/user/profile");
          }
          localStorage.setItem("loginToken", res.data.loginToken);
          localStorage.setItem(
            "userData",
            JSON.stringify(res.data.userDetails)
          );
          LoginFirestore(event).then((loginUser: any) => {
            localStorage.setItem('firebaseUser', loginUser)
          })
        }
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await HandleLoginByGoogle(tokenResponse)
        .then(async (res) => {
          const reqData = {
            first_name: res.data.given_name,
            last_name: res.data.family_name,
            profile_pic: res.data.picture,
            email: res.data.email,
            loggedin_by: "google",
          };
          setGoogleLoading(true);
          await HandleRegister(reqData)
            .then((res) => {
              if (res.status === 201) {
                localStorage.setItem("loginToken", res.data.loginToken);
                localStorage.setItem(
                  "userData",
                  JSON.stringify(res?.data?.updatedUser ? res?.data?.updatedUser : res?.data?.user
                  )
                );
                router.push("/profile");
              }
              setGoogleLoading(false);
            })
            .catch(() => {
              setGoogleLoading(false);
            });
        })
        .catch((err) => console.log(err));
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  React.useEffect(() => {
    GenerateToken();
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("loginToken")
    ) {
      // If token exists, redirect user to dashboard page
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/login"
      ) {
        router.push("/profile");
      } else {
        router.back();
      }
    }
  }, []);

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
              Login
            </Typography>
            <Grid container>
              <Grid item className={styles.registerPage}>
                Don&lsquo;t have an account?
                <Link href="/register" className={styles.signInUpColor}>
                  {" "}
                  Create Now
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
                margin="normal"
                fullWidth
                id="outlined-email"
                label="Email Address"
                autoFocus
                {...register("email")}
              />
              {errors && errors.email
                ? ErrorShowing(errors?.email?.message)
                : ""}
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="outlined-password"
                {...register("password")}
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
              {!loading ? (
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  id={sidebarStyles.muibuttonBackgroundColor}
                  className={styles.mainBoxButton}
                >
                  Sign In
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

              <Link href="/forgotpassword" className={styles.registerPage}>
                Forgot a password?
              </Link>

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
                  disabled={googleLoading}
                  onClick={() => googleLogin()}
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

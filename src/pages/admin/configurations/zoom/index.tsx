// ** External Components
import { useEffect, useState } from "react";

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";

// ** CSS Imports
import siteStyles from "../../../../styles/allConfigurations.module.css";
import styles from "../../../../styles/sidebar.module.css";
import { ToastContainer } from "react-toastify";

// ** React Imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types Imports
import { stripeType } from "@/types/siteType";

// ** Service & Validation Imports
import { stripeZoomConfigValidations } from "@/validation_schema/configurationValidation";
import {
  HandleSiteConfigCreate,
  HandleSiteConfigUpdate,
  HandleSiteGetByID,
} from "@/services/site";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";
import { useRouter } from "next/router";
import { FRONTEND_BASE_URL } from "@/config/config";
const Zoomtoken = () => {
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isAddOrEdit, setIsAddOrEdit] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<any>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<stripeType | any>({
    resolver: yupResolver(stripeZoomConfigValidations),
  });

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    const user_id = JSON.parse(localData);
    setLoading(true);
    handleGetDataById(user_id?.id);
  }, []);

  const handleGetDataById = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        if (res.data.length > 0) {
          const hasZoomCIDOrZoomCS = res.data.some(
            (item: any) => item.key === "zoom_client_id" || item.key === "zoom_client_secret"
          );

          if (hasZoomCIDOrZoomCS) {
            setIsAddOrEdit(true);
          }
          res.data.filter((item: any) =>
            item.key === "zoom_client_id"
              ? setValue("zoom_client_id", item.value)
              : item.key === "zoom_client_secret"
                ? setValue("zoom_client_secret", item.value)
                : ""
          );

          if(getValues().zoom_client_id !== ''){
            
            const thisUrl = new URL('https://zoom.us/oauth/authorize')
            thisUrl.searchParams.set('response_type', 'code')
            thisUrl.searchParams.set('redirect_uri', `${FRONTEND_BASE_URL}/admin/configurations/zoom/zoomtoken/`)
            thisUrl.searchParams.set('client_id', getValues().zoom_client_id)
            setUrl(thisUrl.href)
          }else {
            console.log('No zoom client id found')
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const onSubmit = async (event: any) => {
    const formData = new FormData();

    const reqData: any = {
      zoom_client_id: event.zoom_client_id,
      zoom_client_secret: event.zoom_client_secret,
    };

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    setLoadingButton(true);
    await HandleSiteConfigCreate(formData, "stripe saved")
      .then((res) => {
        setLoadingButton(false);

        handleGetDataById(res?.data?.user_id);
        setIsAddOrEdit(true);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  // const handleZoomAuth = () => {
  //   router.push()
  // }



  const onUpdate = async (event: any) => {
    const reqData: any = {
      zoom_client_id: event.zoom_client_id,
      zoom_client_secret: event.zoom_client_secret,
    };

    const formData: any = new FormData();
    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    // setUpdaLoadingButton(true);
    await HandleSiteConfigUpdate(formData, "stripe update")
      .then((res) => {
        // setLoadingButton(false);
        handleGetDataById(res.data[0]?.user_id);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  return (
    <>
      {" "}
      <Navbar />
      <ToastContainer />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Zoom Configuration"
            Text="CONFIGURATION"
            Link="/admin/configuration/"
          />

          {/* main content */}
          <Card>
            <CardContent>
              {!isLoading ? (
                !isAddOrEdit ? (
                  // Save data in portal
                  <Box
                    component="form"
                    method="POST"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                    onReset={reset}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Box
                          component="img"
                          src="/Images/sideImages/stripeSide.svg"
                          width={"100%"}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        margin={"70px 0px"}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          margin={"10px 0px 20px 0px"}
                        >
                          <InputLabel
                            shrink
                            htmlFor="zoom_client_id"
                            className={siteStyles.inputLabels}
                          >
                            Publishable Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="zoom_client_id"
                            {...register("zoom_client_id")}
                            placeholder="Provide your publishable key"
                          />
                          {errors && errors.zoom_client_id
                            ? ErrorShowing(errors?.zoom_client_id?.message)
                            : ""}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          marginBottom={"20px"}
                        >
                          <InputLabel
                            shrink
                            htmlFor="zoom_client_secret"
                            className={siteStyles.inputLabels}
                          >
                            Secret Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="zoom_client_secret"
                            {...register("zoom_client_secret")}
                            placeholder="Provide your secret key"
                          />
                          {errors && errors.zoom_client_secret
                            ? ErrorShowing(errors?.zoom_client_secret?.message)
                            : ""}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          textAlign={"right"}
                        >
                          {!isLoadingButton ? (
                            <Button
                              type="submit"
                              size="large"
                              variant="contained"
                              id={styles.muibuttonBackgroundColor}
                            >
                              Submit
                            </Button>
                          ) : (
                            <LoadingButton
                              loading={isLoadingButton}
                              size="large"
                              className={siteStyles.siteLoadingButton}
                              variant="contained"
                              disabled
                            >
                              <CircularProgressBar />
                            </LoadingButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  //  Show data from portal
                  <Box
                    component="form"
                    method="POST"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onUpdate)}
                    onReset={reset}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Box
                          component="img"
                          src="/Images/sideImages/siteSide.svg"
                          width={"100%"}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        margin={"70px 0px"}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          margin={"10px 0px 20px 0px"}
                        >
                          <InputLabel
                            shrink
                            htmlFor="zoom_client_id"
                            className={siteStyles.inputLabels}
                          >
                            Zoom Cient ID
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="zoom_client_id"
                            {...register("zoom_client_id")}
                            placeholder="Provide your publishable key"
                          />
                          {errors && errors.zoom_client_id
                            ? ErrorShowing(errors?.zoom_client_id?.message)
                            : ""}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          marginBottom={"20px"}
                        >
                          <InputLabel
                            shrink
                            htmlFor="zoom_client_secret"
                            className={siteStyles.inputLabels}
                          >
                            Zoom Client Secret
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="zoom_client_secret"
                            {...register("zoom_client_secret")}
                            placeholder="Provide your secret key"
                          />
                          {errors && errors.zoom_client_secret
                            ? ErrorShowing(errors?.zoom_client_secret?.message)
                            : ""}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          textAlign={"right"}
                        >
                          {!isLoadingButton ? (
                            <Grid >
                              <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                id={styles.muibuttonBackgroundColor}
                              >
                                 UPDATE
                              </Button>

                              {/* <Button variant="contained"
                                size="large"
                                id={styles.muibuttonBackgroundColor}
                                sx={{ margin: '5px' }} 
                                // onClick={handleZoomAuth}
                                >
                              <a href={url}>GET TOKEN</a>
                              </Button> */}
                            </Grid>
                          ) : (
                            <LoadingButton
                              loading={isLoadingButton}
                              size="large"
                              className={siteStyles.siteLoadingButton}
                              variant="contained"
                              disabled
                            >
                              <CircularProgressBar />
                            </LoadingButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                )
              ) : (
                <SpinnerProgress />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Zoomtoken;

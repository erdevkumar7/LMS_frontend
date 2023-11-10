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
import { stripeConfigValidations } from "@/validation_schema/configurationValidation";
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

const Stripe = () => {
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isAddOrEdit, setIsAddOrEdit] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<stripeType | any>({
    resolver: yupResolver(stripeConfigValidations),
  });

  const onSubmit = async (event: any) => {
    const formData = new FormData();

    const reqData: any = {
      org_pk: event.org_pk,
      org_sk: event.org_sk,
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

  const handleGetDataById = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        if (res.data.length > 0) {
          const hasPKOrSK = res.data.some(
            (item: any) => item.key === "org_pk" || item.key === "org_sk"
          );
          if (hasPKOrSK) {
            setIsAddOrEdit(true);
          }
          res.data.filter((item: any) =>
            item.key === "org_pk"
              ? setValue("org_pk", item.value)
              : item.key === "org_sk"
              ? setValue("org_sk", item.value)
              : ""
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    const user_id = JSON.parse(localData);
    setLoading(true);
    handleGetDataById(user_id?.id);
  }, []);

  const onUpdate = async (event: any) => {
    const reqData: any = {
      org_pk: event.org_pk,
      org_sk: event.org_sk,
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
            Current="Stripe Configuration"
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
                            htmlFor="org_pk"
                            className={siteStyles.inputLabels}
                          >
                            Publishable Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_pk"
                            {...register("org_pk")}
                            placeholder="Provide your publishable key"
                          />
                          {errors && errors.org_pk
                            ? ErrorShowing(errors?.org_pk?.message)
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
                            htmlFor="org_sk"
                            className={siteStyles.inputLabels}
                          >
                            Secret Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_sk"
                            {...register("org_sk")}
                            placeholder="Provide your secret key"
                          />
                          {errors && errors.org_sk
                            ? ErrorShowing(errors?.org_sk?.message)
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
                            htmlFor="org_pk"
                            className={siteStyles.inputLabels}
                          >
                            Publishable Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_pk"
                            {...register("org_pk")}
                            placeholder="Provide your publishable key"
                          />
                          {errors && errors.org_pk
                            ? ErrorShowing(errors?.org_pk?.message)
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
                            htmlFor="org_sk"
                            className={siteStyles.inputLabels}
                          >
                            Secret Key
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_sk"
                            {...register("org_sk")}
                            placeholder="Provide your secret key"
                          />
                          {errors && errors.org_sk
                            ? ErrorShowing(errors?.org_sk?.message)
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
                              UPDATE
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

export default Stripe;

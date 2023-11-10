// ***** React Import
import React, { useState } from "react";
import { useRouter } from "next/router";
// MUI Import
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../../common/LayoutNavigations/navbar";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
// Types Import
import { subscriptionPlan } from "@/types/subscription";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import Subscription from "../../../../styles/subscription.module.css";
import { ToastContainer } from "react-toastify";
// API services
import { subscriptionPlanValidations } from "@/validation_schema/subscriptionValidation";
import { CreateSubscriptionPlan } from "@/services/subscription";

export default function AddSubscriptionPlans() {
  const router: any = useRouter();
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<subscriptionPlan | any>({
    resolver: yupResolver(subscriptionPlanValidations),
  });

  const onSubmit = async (event: any) => {
    setLoadingButton(true);
    try {
      const res = await CreateSubscriptionPlan(event);

      if (res.status === 201) {
        setTimeout(() => {
          router.push("/admin/subscriptions/plans/");
        }, 2000);
      }
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
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
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Subscription Plans"
            Current="Add Subscription Plan"
            Text="SUBSCRIPTION PLANS"
            Link="admin/subscriptions/plans/"
          />
          {/* main content */}
          <Card>
            <CardContent>
              <Box
                component="form"
                method="POST"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                onReset={reset}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                    <Typography className={styles.headingTitle}>
                      ADD SUBSCRIPTION PLAN
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Subscription.InputLabelFont}>
                      Subscription Title
                    </InputLabel>

                    <TextField
                      placeholder="Subscription Title"
                      {...register("title")}
                      className={Subscription.inputFieldWidth}
                    />
                    {errors && errors.title
                      ? ErrorShowing(errors?.title?.message)
                      : ""}
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Subscription.InputLabelFont}>
                      Duration Term
                    </InputLabel>
                    <Controller
                      name="duration_term"
                      control={control}
                      defaultValue="month"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <Select
                            {...field}
                            className={Subscription.inputFieldWidth}
                            displayEmpty
                          >
                            <MenuItem value={"week"}>Week</MenuItem>
                            <MenuItem value={"month"}>Month</MenuItem>
                            <MenuItem value={"year"}>Year</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors && errors.duration_term
                      ? ErrorShowing(errors?.duration_term?.message)
                      : ""}
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Subscription.InputLabelFont}>
                      Duration Value
                    </InputLabel>
                    <TextField
                      type="number"
                      placeholder="Duration Value"
                      {...register("duration_value")}
                      className={Subscription.inputFieldWidth}
                    />
                    {errors && errors.duration_value
                      ? ErrorShowing(errors?.duration_value?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={Subscription.InputLabelFont}>
                      Price
                    </InputLabel>
                    <TextField
                      type="number"
                      placeholder="Subscription Price"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      {...register("amount")}
                      className={Subscription.inputFieldWidth}
                    />
                    {errors && errors.amount
                      ? ErrorShowing(errors?.amount?.message)
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
                    <Button
                      className={Subscription.cancelButton}
                      variant="contained"
                      size="large"
                      onClick={() => router.push("/admin/subscriptions/plans/")}
                      id={styles.muibuttonBackgroundColor}
                    >
                      Cancel
                    </Button>
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
                        className={Subscription.updateLoadingButton}
                        size="large"
                        variant="contained"
                        disabled
                      >
                        <CircularProgressBar />
                      </LoadingButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
}

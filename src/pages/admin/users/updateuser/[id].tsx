// ***** React Import
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// MUI Import
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import UserCSS from "../../../../styles/user.module.css";
import { ToastContainer } from "react-toastify";
import { userValidations } from "@/validation_schema/userValidation";
// API Service
import { HandleProfile, HandleUpdateProfile } from "@/services/user";

export default function UpdateUser() {
  const router: any = useRouter();
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<any>();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(userValidations),
  });

  useEffect(() => {
    getUsereData();
  }, []);
  //get user data
  const getUsereData = () => {
    const id = router.query.id;
    if (id) {
      HandleProfile(id).then((users) => {
        setRows(users.data);
        const fields = ["first_name", "last_name", "email", "role_id"];
        fields.forEach((field) => setValue(field, users.data[field]));
      });
    }
  };
  //handle Update
  const handleUpdate = (e: any) => {
    if (e.target.name === "first_name") {
      setRows({ ...rows, first_name: e.target.value });
    }
    if (e.target.name === "last_name") {
      setRows({ ...rows, last_name: e.target.value });
    }
    if (e.target.name === "email") {
      setRows({ ...rows, email: e.target.value });
    }
  };

  //submit form
  const onSubmit = async (event: any) => {
    const id = router.query.id;
    setLoading(true);
    setLoadingButton(false);
    try {
      const res = await HandleUpdateProfile(id, event);
      setLoading(false);
      setTimeout(() => {
        router.push("/admin/users");
      }, 1000);
    } catch (e) {
      console.log(e);
      setLoadingButton(true);
    }
  };
  //Errors
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
            Middle="User"
            Current="Update User"
            Text="USER"
            Link="admin/users"
          />
          {/* main content */}
          <Card>
            {/* <CardHeader title='UPDATE USER' subheader={<Divider></Divider>} className={styles.headingTitle}/> */}
            <CardContent>
              {!isLoading ? (
                <Box
                  component="form"
                  method="POST"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                  onReset={reset}
                >
                  <Grid container spacing={3}>
                    {/* /* <Grid item xs={12} sm={12} md={12} lg={6} >
                      <Box component="img" src="/Images/sideImages/update_section.svg" width={'100%'} />
                    </Grid>  */}

                    <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                      <Typography
                        className={`${UserCSS.InputLabelFont} ${UserCSS.InputLabelFontSize}`}
                      >
                        UPDATE USER
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={UserCSS.InputLabelFont}>
                        First Name
                      </InputLabel>
                      <TextField
                        {...register("first_name")}
                        value={rows?.first_name}
                        onChange={handleUpdate}
                        placeholder="First Name"
                        className={UserCSS.inputFieldWidth}
                      />
                      {errors && errors.first_name
                        ? ErrorShowing(errors?.first_name?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={UserCSS.InputLabelFont}>
                        Last Name
                      </InputLabel>
                      <TextField
                        value={rows?.last_name}
                        placeholder="Last Name"
                        {...register("last_name")}
                        onChange={handleUpdate}
                        className={UserCSS.inputFieldWidth}
                      />
                      {errors && errors.last_name
                        ? ErrorShowing(errors?.last_name?.message)
                        : ""}
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12} className={UserCSS.sessionNameGride} > */}
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={UserCSS.InputLabelFont}>
                        Email
                      </InputLabel>
                      <TextField
                        value={rows?.email}
                        placeholder="Email Id"
                        {...register("email")}
                        onChange={handleUpdate}
                        className={UserCSS.inputFieldWidth}
                      />
                      {errors && errors.email
                        ? ErrorShowing(errors?.email?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={UserCSS.InputLabelFont}>
                        Role
                      </InputLabel>
                      <Controller
                        name="role_id"
                        control={control}
                        defaultValue={rows?.role_id || ""}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <Select
                              {...field}
                              displayEmpty
                              className={UserCSS.inputFieldWidth}
                            >
                              <MenuItem value={1}>Admin</MenuItem>
                              <MenuItem value={2}>Learner</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                      {errors && errors.role_id
                        ? ErrorShowing(errors?.role_id?.message)
                        : ""}
                    </Grid>
                    {/* </Grid> */}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      textAlign={"right"} 
                      // p={4}
                      // mr={3}
                    >
                      <Button
                        className={UserCSS.cancelButton}
                        variant="contained"
                        size="large"
                        onClick={() => router.push("/admin/users")}
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
                          className={UserCSS.updateLoadingButton}
                          size="large"
                          variant="contained"
                          disabled
                        >
                          <CircularProgressBar />
                        </LoadingButton>
                      )}
                    </Grid>
                  </Grid>

                  {/* </Grid> */}
                </Box>
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
}

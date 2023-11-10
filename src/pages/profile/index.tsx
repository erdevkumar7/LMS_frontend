// React Import
import { useState, useEffect } from "react";
// MUI Import
import {
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  Box,
  CardContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { LoadingButton } from "@mui/lab";
// validation import
import { userProfileValidations } from "@/validation_schema/profileValidation";
// Helper Import
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Types Import
import { userType } from "@/types/userType";
// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
// CSS Import
import profiles from "../../styles/profile.module.css";
import styles from "../../styles/sidebar.module.css";
// API services
import { HandleProfile } from "@/services/user";
import { HandleUpdateProfile } from "@/services/user";
import { BASE_URL } from "@/config/config";

export default function Profile() {
  const [previewProfile, setPreviewProfile] = useState<string | any>("");
  const [file, setFile] = useState<string | any>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [getUserData, setUserData] = useState<userType | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<string | any>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<userType | any>({
    resolver: yupResolver(userProfileValidations),
  });
  var profile_picManage: any;
  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      const userId = JSON.parse(localData);
      getProfileData(userId?.id);
    }
  }, []);

  const onSubmit = async (event: any) => {
    const reqData = { ...event, profile_pic: file };
    const formData = new FormData();

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }
    setLoadingButton(true);
    await HandleUpdateProfile(reqData.id, formData)
      .then((res) => {
        setLoadingButton(false);
        setTimeout(() => {
          setToggle(!toggle);
          getProfileData(res.data.id);
        }, 1000);
        setLoadingButton(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  const getProfileData = (userId: any) => {
    setLoading(true);
    let localData1: any;
    HandleProfile(userId).then((user) => {
      setUserData(user.data);
      const fields = [
        "id",
        "first_name",
        "last_name",
        "email",
        "role_id",
        "profile_pic",
      ];
      fields.forEach((field) => setValue(field, user.data[field]));
      // setValue("role_id",user.data['role_id'] === "1" ? "Admin" : "Learner")
      setLoading(false);
      if (typeof window !== "undefined") {
        localData1 = window.localStorage.getItem("userData");
      }
      if (localData1) {
        const userId = JSON.parse(localData1);
        profile_picManage = { ...userId, profile_pic: user.data?.profile_pic };
        window.localStorage.setItem(
          "userData",
          JSON.stringify(profile_picManage)
        );
      }
    });
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleEdit = async () => {
    setToggle(!toggle);
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const extension = fileName.split(".").pop();
    if (e.target.name === "profile_pic") {
      if (
        extension === "jpg" ||
        extension === "gif" ||
        extension === "png" ||
        extension === "jpeg"
      ) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          setPreviewProfile(e.target.result);
          setFile(file);
        };
        reader.readAsDataURL(file);
      }
    }
  };


  return (
    <>
      <Navbar
        profilePic={getUserData?.profile_pic}
        firstName={getUserData?.first_name}
        lastName={getUserData?.last_name}
      />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Profile"
            Text="PROFILE"
            Link="/profile"
          />

          {/* main content */}
          <Card>
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
                  {getUserData ? (
                    <>
                      <Grid container spacing={3} marginBottom={"20px"}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Box className={profiles.profileImageBox}>
                            <Box>
                              {!toggle ? (
                                <Box
                                  component="img"
                                  className={profiles.imageComponent}
                                  src={
                                    getUserData.profile_pic
                                      ? `${BASE_URL}/${getUserData.profile_pic}`
                                      : "/profile.png"
                                  }
                                />
                              ) : (
                                <InputLabel>
                                  <Box>
                                    <Box
                                      component="img"
                                      className={profiles.imageComponent}
                                      src={
                                        previewProfile
                                          ? previewProfile
                                          : getUserData.profile_pic
                                          ? `${BASE_URL}/${getUserData.profile_pic}`
                                          : "/profile.png"
                                      }
                                    />
                                    <IconButton
                                      className={profiles.profileCameraIcon}
                                      aria-label="upload picture"
                                      component="label"
                                    >
                                      {" "}
                                      <CameraAltIcon
                                        className={profiles.cameraAltIcon}
                                      />{" "}
                                      <input
                                        type="file"
                                        {...register("profile_pic")}
                                        onChange={handleChange}
                                        hidden
                                      />
                                    </IconButton>
                                  </Box>
                                </InputLabel>
                              )}
                            </Box>
                            <Box className={profiles.userData}>
                              <Typography
                                variant="subtitle1"
                                className={profiles.useNameFront}
                              >
                                {getUserData
                                  ? capitalizeFirstLetter(
                                      getUserData?.first_name
                                    )
                                  : ""}{" "}
                                {getUserData
                                  ? capitalizeFirstLetter(
                                      getUserData?.last_name
                                    )
                                  : ""}{" "}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                className={profiles.userDetailFront}
                              >
                                {getUserData?.email}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                className={profiles.userDetailFront}
                              >
                                {getUserData?.role_id === 2
                                  ? "Learner"
                                  : "Admin"}
                              </Typography>

                              <IconButton onClick={handleEdit}>
                                <EditIcon
                                  className={
                                    toggle && toggle
                                      ? profiles.editiconbtnn
                                      : ""
                                  }
                                ></EditIcon>
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={4}
                        className={profiles.userDetailGrid}
                      >
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            {...register("first_name")}
                            defaultValue={getUserData?.first_name}
                            disabled={!toggle}
                          />
                          {errors && errors.first_name
                            ? ErrorShowing(errors?.first_name?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            {...register("last_name")}
                            defaultValue={capitalizeFirstLetter(
                              getUserData?.last_name
                            )}
                            disabled={!toggle}
                          />
                          {errors && errors.last_name
                            ? ErrorShowing(errors?.last_name?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            {...register("email")}
                            defaultValue={getUserData?.email}
                            disabled={!toggle}
                          />
                          {errors && errors.email
                            ? ErrorShowing(errors?.email?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <FormControl fullWidth>
                            <InputLabel>Role </InputLabel>

                            <Select
                              label="Role"
                              {...register("role_id")}
                              defaultValue={getUserData.role_id}
                              // disabled={!toggle}
                              disabled
                              // onChange={changeRole}
                            >
                              <MenuItem value={1}>Admin</MenuItem>

                            </Select>
                          </FormControl>
                        </Grid>

                        {toggle && (
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
                                Update Profile
                              </Button>
                            ) : (
                              <LoadingButton
                                loading={isLoadingButton}
                                size="large"
                                className={profiles.updateLoadingButton}
                                variant="contained"
                                disabled
                              >
                                <CircularProgressBar />
                              </LoadingButton>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    </>
                  ) : (
                    "Record not found"
                  )}
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

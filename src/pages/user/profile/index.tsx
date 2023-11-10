// React Import
import { useState, useEffect } from "react";
// MUI Import
import {
  Button,
  TextField,
  Grid,
  InputLabel,
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
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
// CSS Import
import profiles from "../../../styles/profile.module.css";
import styles from "../../../styles/sidebar.module.css";
// API services
import { HandleProfile } from "@/services/user";
import { HandleUpdateProfile } from "@/services/user";
import { BASE_URL } from "@/config/config";
import Footer from "@/common/LayoutNavigations/footer";
import { CurrentUser, UpdateFireStoreData } from "../../../firebase/firebaseFunctions";
//firebase functions
import { auth, storage } from "../../../firebase/firebase";
import { getIdToken, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// const auth = firebase.auth();

export default function Profile() {
  const [previewProfile, setPreviewProfile] = useState<string | any>("");
  const [file, setFile] = useState<string | any>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [getUserData, setUserData] = useState<userType | any>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<userType | any>({
    resolver: yupResolver(userProfileValidations),
  });

  const onSubmit = async (event: any) => {
    const reqData = { ...event, profile_pic: file };
    const formData = new FormData();

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }
    setLoadingButton(true);
    try {
      const res = await HandleUpdateProfile(reqData.id, formData)
      setLoadingButton(false);
      UpdateFireStoreData(event)
      //-----------------------------------------------------------------  
      if (res) {
        const displayName = event?.first_name
        const user:any = auth.currentUser;
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);

        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {

            const data = updateProfile(user, {
              displayName,
              photoURL: downloadURL,
              // Add other profile-related properties here if needed
            })
            console.log('dt', data)
          });
        });
        // .then(() => {
        //   console.log('Profile updated successfully!');
        // })
        // .catch((error: any) => {
        //   console.error('Error updating profile:', error);
        // });


        // Usage example:
        // const newDisplayName = event?.first_name;
        // updateProfileData(newDisplayName);



        // user.updateProfile({
        //   displayName: event?.first_name,
        //   // Add other profile-related properties here if needed
        // })
        //   .then(() => {
        //     console.log('Profile updated successfully!');
        //   })
        //   .catch((error: any) => {
        //     console.error('Error updating profile:', error);
        //   });
        // auth.currentUser
        //   try {
        //     const displayName = event?.first_name
        //     //Create user
        //     const loginUser = await CurrentUser()
        //     console.log("user", loginUser);
        //       if (loginUser) {
        //      await updateProfile(loginUser, {
        //         displayName,
        //       }).then((dt) => {
        //         console.log('dt',dt)
        //       });}
        //     // const loginUser = await onAuthStateChanged(auth);

        //     // //Create a unique image name

        //     // //Update profile
        //     // if (loginUser) {
        //     //  await updateProfile(loginUser.user, {
        //     //     displayName,
        //     //   }).then((dt) => {
        //     //     console.log('dt',dt)
        //     //   });

        //     // }

        //     // user.updateProfile({
        //     //   displayName: newDisplayName,
        //     // })
        //     //   .then(() => {
        //     //     console.log('Profile name updated successfully!');
        //     //   })
        //     //   .catch((error) => {
        //     //     console.error('Error updating profile name:', error);
        //     //   });
        //     // const dt = await updateProfile(loginUser.user, {
        //     //   displayName,
        //     // });
        //     // console.log('dt',dt)

        //     // //create user on firestore
        //     // await setDoc(doc(db, "users", res.user.uid), {
        //     //   uid: res.user.uid,
        //     //   displayName,
        //     //   email,
        //     //   photoURL: downloadURL,
        //     // });

        //     // //create empty user chats on firestore
        //     // await setDoc(doc(db, "userChats", res.user.uid), {});

        //   } catch (err) {
        //     setLoading(false);
        //   }

      }
      //-------------------------------------------------------------
      setTimeout(() => {
        setToggle(!toggle);
        getProfileData(res.data.id);
      }, 1000);
    } catch (err) {
      setLoadingButton(false);
    }
    //     await HandleUpdateProfile(reqData.id, formData)
    //       .then((res) => {
    //         setLoadingButton(false);

    //         setTimeout(() => {
    //           setToggle(!toggle);
    //           getProfileData(res.data.id);
    //         }, 900);
    //       })
    //       .catch((err) => {
    //         setLoadingButton(false);
    //       });
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
      setLoading(false);
      if (typeof window !== "undefined") {
        localData1 = window.localStorage.getItem("userData");
      }
      if (localData1) {
        const userId = JSON.parse(localData1);
        profile_picManage = {
          ...userId,
          profile_pic: user.data?.profile_pic,
          first_name: user.data?.first_name,
          last_name: user.data?.last_name,
        };
        window.localStorage.setItem(
          "userData",
          JSON.stringify(profile_picManage)
        );
      }
    });
  };
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
    if (e.target.name === "profile_pic") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewProfile(e.target.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
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
            Text="USER PROFILE"
            Link="/user/profile"
          />

          {/* main content */}
          <Card data-testid="textcheck">
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
                                data-testid="step1"
                                className={profiles.useNameFront}
                              >
                                {getUserData
                                  ? capitalizeFirstLetter(
                                    getUserData?.first_name
                                  )
                                  : ""}
                                &nbsp;
                                {getUserData
                                  ? capitalizeFirstLetter(
                                    getUserData?.last_name
                                  )
                                  : ""}
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
                                {"Learner"}
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
                            defaultValue={getUserData?.last_name}
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
                          <TextField
                            fullWidth
                            label="Role"
                            {...register("role")}
                            defaultValue={capitalizeFirstLetter("learner")}
                            disabled={true}
                          />
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
                                data-testid="button"
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

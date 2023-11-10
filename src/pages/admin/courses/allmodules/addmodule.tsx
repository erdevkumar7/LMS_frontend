// ***** React Import
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// MUI Import
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
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
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { moduleValidations } from "@/validation_schema/moduleValidation";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
// Types Import
import { courseType } from "@/types/courseType";
import { moduleType } from "@/types/moduleType";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import ModuleCss from "../../../../styles/modules.module.css";
import { ToastContainer } from "react-toastify";
// API services
import { HandleCourseGet } from "@/services/course";
import { HandleModuleCreate } from "@/services/module";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { HandleAIText, aiBtnCss } from "@/services/text_AI";
import { HandleSiteGetByID } from "@/services/site";

export default function AddSession() {
  const router: any = useRouter();
  const [despcriptionContent, setdespcriptionContent] = useState<any>("");
  const [getCourses, setCourses] = useState<courseType | any>();
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [getCourseId, setCourseId] = React.useState<any>(0);
  const [title, setTitle] = useState("");
  const [aiLoader, setAiLoader] = useState<any>(false);
  const [siteKey, setSiteKey] = useState(false);
  const [secretKey, setSecretKey] = useState<any>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<moduleType | any>({
    resolver: yupResolver(moduleValidations),
  });

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      const user_id = JSON.parse(localData);
      HandleSiteGetData(user_id?.id);
      getCourseData();
    }
  }, []);

  const handleContentChange = (value: string, identifier: string) => {
    setdespcriptionContent(value);
    setValue(identifier, value);
  };

  const onSubmit = async (event: any) => {
    setLoadingButton(true);
    try {
      const res = await HandleModuleCreate({
        ...event,
        course_id: getCourseId,
      });
      setTimeout(() => {
        router.push("/admin/courses/allmodules/");
      }, 1000);
      setLoadingButton(false);
    } catch (e) {
      console.log(e);
      setLoadingButton(false);
    }
  };

  const getCourseData = () => {
    HandleCourseGet("", "").then((courses) => {
      setCourses(courses.data);
    });
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const generateShortDescription = async () => {
    try {
      setAiLoader(true);
      await HandleAIText(title, secretKey).then((data) => {
        // let shortDesc = data?.substring(0, 400);
        setdespcriptionContent(data);
        setAiLoader(false);
      });
    } catch (e) {
      setAiLoader(false);
      console.log(e);
    }
  };
  const HandleSiteGetData = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        const getSiteData = res.data.filter(
          (item: any) => item.key === "content_sk" && item.is_deleted === true
        );
        if (getSiteData?.length === 0) {
          setSiteKey(false);
        } else {
          setSiteKey(true);
          setSecretKey(getSiteData[0]?.value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Module"
            Current="Add Module"
            Text="MODULE"
            Link="admin/courses/allmodules"
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
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                      <Typography className={styles.headingTitle}>
                        ADD MODULE
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={ModuleCss.InputLabelFont}>
                        Module Name
                      </InputLabel>
                      <TextField
                        placeholder="Module Name"
                        {...register("title")}
                        onChange={(e: any) => setTitle(e.target.value)}
                        className={ModuleCss.inputFieldWidth}
                      />
                      {errors && errors.title
                        ? ErrorShowing(errors?.title?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={ModuleCss.InputLabelFont}>
                        Course of Module
                      </InputLabel>
                      <Autocomplete
                        id="combo-box-demo"
                        options={getCourses}
                        getOptionLabel={(option: any) => option?.course?.title}
                        renderInput={(params) => (
                          <TextField
                            {...register("course_id")}
                            {...params}
                            placeholder="Select Course"
                          />
                        )}
                        onChange={(event, newValue) => {
                          setCourseId(newValue?.course?.id);
                        }}
                      />

                      {errors && errors.course_id
                        ? ErrorShowing(errors?.course_id?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel className={ModuleCss.InputLabelFont}>
                        Status
                      </InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <Select {...field} displayEmpty>
                              <MenuItem disabled value="">
                                Status
                              </MenuItem>
                              <MenuItem value={"active"}>Active</MenuItem>
                              <MenuItem value={"inactive"}>Inactive</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                      {errors && errors.status
                        ? ErrorShowing(errors?.status?.message)
                        : ""}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box className={styles.aiCss}>
                        <InputLabel className={ModuleCss.InputLabelFont}>
                          Description
                        </InputLabel>
                        {title && title !== null && siteKey === true ? (
                          <Button
                            variant="text"
                            className={styles.aiButton}
                            onClick={generateShortDescription}
                          >
                            {aiLoader ? (
                              <AutorenewIcon sx={aiBtnCss} />
                            ) : (
                              <AutorenewIcon />
                            )}{" "}
                            &nbsp;Auto Generate
                          </Button>
                        ) : (
                          ""
                        )}
                      </Box>
                      <RichEditor
                        {...register("description")}
                        value={despcriptionContent}
                        onChange={(e) => handleContentChange(e, "description")}
                        className={ModuleCss.quillDescription}
                      />

                      {errors && errors.description
                        ? ErrorShowing(errors?.description?.message)
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
                        className={ModuleCss.cancelButton}
                        variant="contained"
                        size="large"
                        onClick={() => router.push("/admin/courses/allmodules")}
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
                          className={ModuleCss.updateLoadingButton}
                          size="large"
                          variant="contained"
                          disabled
                        >
                          <CircularProgressBar />
                        </LoadingButton>
                      )}
                      {/* </Grid> */}
                      {/* </Grid> */}
                    </Grid>
                  </Grid>
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

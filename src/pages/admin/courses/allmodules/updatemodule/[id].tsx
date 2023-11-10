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
  NativeSelect,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../../../common/LayoutNavigations/navbar";
import RichEditor from "@/common/RichTextEditor/textEditor";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
// Types Import
import { moduleType } from "@/types/moduleType";
// CSS Import
import styles from "../../../../../styles/sidebar.module.css";
import ModuleCss from "../../../../../styles/modules.module.css";
import { ToastContainer } from "react-toastify";
// API services
import {
  HandleCourseGet,
  HandleCourseGetByID,
  HandleCourseUpdate,
} from "@/services/course";
import { HandleModuleGetByID, HandleModuleUpdate } from "@/services/module";
import { moduleValidations } from "@/validation_schema/moduleValidation";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { HandleAIText, aiBtnCss } from "@/services/text_AI";
import { HandleSiteGetByID } from "@/services/site";

export default function UpdateModule() {
  const router: any = useRouter();
  const [getDespcriptionContent, setDespcriptionContent] = useState("");
  const [getModule, setModule] = useState<moduleType | any>();
  const [getCourses, setCourses] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>([]);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErrors] = useState<string>();
  const [value, setNewValue] = useState<any>({});
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
    setError,
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
      getModuleData();
    }
  }, [router.query]);

  // handle changes for decriptions
  const handleContentChange = (value: string, identifier: string) => {
    if (identifier === "description") {
      if (value === "<p><br></p>") {
        setError(identifier, { message: "Description is a required field" });
        setValue(identifier, "");
      } else {
        setError(identifier, { message: "" });
        setValue(identifier, value);
      }
      setDespcriptionContent(value);
    }
  };

  //submit form
  const onSubmit = async (event: any) => {
    const id = router.query.id;
    const reqData = { ...event, course_id: value?.id };
    if (
      errors.description?.message === "" ||
      (typeof errors === "object" && errors !== null)
    ) {
      setLoadingButton(true);
      try {
        const res = await HandleModuleUpdate(id, reqData);
        getModuleData();
        setTimeout(() => {
          router.push("/admin/courses/allmodules/");
        }, 1000);
        setLoadingButton(false);
      } catch (e) {
        console.log(e);
        setLoadingButton(false);
      }
    } else {
      setError("description", { message: "Description is a required field" });
    }
  };

  const handleUpdate = (e: any) => {
    if (e.target.name === "title") {
      setModule({ ...getModule, title: e.target.value });
    }
  };
  // get module data
  const getModuleData = async () => {
    const id = router.query.id;
    if (id) {
      setLoading(true);
      HandleModuleGetByID(id)
        .then((module) => {
          setModule(module.data);
          const fields = ["course_id", "title", "status", "description"];
          fields.forEach((field) => setValue(field, module.data[field]));
          if (module?.data?.id > 0) {
            HandleCourseGet("", "").then((courses) => {
              if (courses?.data.length > 0) {
                setCourses(courses.data);
                setLoading(false);
                const findCourse = courses.data?.filter((item: any) => {
                  return item?.course?.id === module?.data?.course_id;
                });
                setNewValue({
                  id: findCourse && findCourse[0]?.course?.id,
                  title:
                    findCourse && findCourse[0]?.course?.title
                      ? findCourse[0]?.course?.title
                      : "",
                });
              }
            });
          }
        })
        .catch((error) => {
          setErrors(error.message);
        });
    }
    if (error) {
      return <Typography>{error}</Typography>;
    }
    if (!getModule) {
      return <Typography>Loading...</Typography>;
    }
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const option: { id: number; title: string }[] = [];
  getCourses &&
    getCourses.map((data: any, key: any) => {
      return option.push({
        id: data?.course?.id,
        title: data?.course?.title,
      });
    });

  const generateShortDescription = async () => {
    try {
      setAiLoader(true);
      await HandleAIText(getModule?.title, secretKey).then((data) => {
        // let shortDesc = data?.substring(0, 400);
        setDespcriptionContent(data);
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
            Current="Update Module"
            Text="MODULE"
            Link="admin/courses/allmodules"
          />
          {/* main content */}
          <Card>
            <CardContent>
              {!isLoading ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                      <Typography className={styles.headingTitle}>
                        UPDATE MODULE
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={ModuleCss.InputLabelFont}>
                        Module Name
                      </InputLabel>
                      <TextField
                        {...register("title")}
                        value={getModule?.title}
                        onChange={handleUpdate}
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
                        value={value}
                        inputValue={inputValue}
                        onChange={(event, newValue) => {
                          setNewValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        options={option}
                        getOptionLabel={(option) => option?.title}
                        renderInput={(params) => (
                          <TextField
                            {...register("course_id")}
                            {...params}
                            variant="outlined"
                            placeholder="Search Course"
                          />
                        )}
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
                        defaultValue={getModule?.status || ""}
                        // defaultValue=''
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <Select {...field} displayEmpty>
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
                        {getModule &&
                        getModule?.title !== null &&
                        siteKey === true ? (
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
                      <Box>
                        <RichEditor
                          {...register("description")}
                          value={
                            getDespcriptionContent
                              ? getDespcriptionContent
                              : getModule?.description
                          }
                          onChange={(value) =>
                            handleContentChange(value, "description")
                          }
                          className={ModuleCss.quillDescription2}
                        />
                      </Box>
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
                          UPDATE
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
                    </Grid>
                  </Grid>
                </form>
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

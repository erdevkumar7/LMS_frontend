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
import Preview from "@/common/PreviewAttachments/previewAttachment";
// Helper Import
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sessionUpdateValidation } from "@/validation_schema/sessionValidation";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
// Types Import
import { sessionType } from "@/types/sessionType";
import { courseType } from "@/types/courseType";
import { moduleType } from "@/types/moduleType";
// CSS Import
import styles from "../../../../../styles/sidebar.module.css";
import Sessions from "../../../../../styles/session.module.css";
import { ToastContainer } from "react-toastify";
// API services
import { HandleCourseGet } from "@/services/course";
import { HandleModuleGet } from "@/services/module";
import { HandleSessionUpdate, HandleSessionGetByID } from "@/services/session";
import { HandleAIText, aiBtnCss } from "@/services/text_AI";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { HandleSiteGetByID } from "@/services/site";

export default function UpdateSession() {
  const router: any = useRouter();
  const [despcriptionContent, setdespcriptionContent] = useState("");
  const [updateSession, setUpdateSession] = useState<sessionType | any>([]);
  const [getCourses, setCourses] = useState<courseType | any>();
  const [getSession, setSession] = useState<sessionType | any>();
  const [getModules, setModules] = useState<moduleType | any>();
  const [file, setFile] = useState<string | any>("");
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErrors] = useState<string>();
  const [inputValue, setInputValue] = useState<any>([]);
  const [mdinputValue, setmdInputValue] = useState<any>([]);
  const [value, setNewValue] = useState<any>({});
  const [mdvalue, setmdvalue] = useState<any>({});
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
  } = useForm<sessionType | any>({
    resolver: yupResolver(sessionUpdateValidation),
  });

  useEffect(() => {
    const id = router.query.id;
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      const user_id = JSON.parse(localData);
      HandleSiteGetData(user_id?.id);
      getSessionData(id);
    }
  }, []);

  const getSessionData = async (id: any) => {
    if (id) {
      setLoading(true);
      HandleSessionGetByID(id)
        .then((session) => {
          setLoading(false);
          setSession(session.data);
          const fields = [
            "title",
            "course_id",
            "module_id",
            "description",
            "attachment",
          ];

          fields.forEach((field) => setValue(field, session.data[field]));

          if (session.data?.id > 0) {
            HandleCourseGet("", "").then((courses) => {
              setCourses(courses.data);
              if (courses?.data.length > 0) {
                const findCourse = courses.data?.filter((item: any) => {
                  return item?.course?.id === session?.data?.course?.id;
                });
                setNewValue({
                  id: findCourse && findCourse[0]?.course?.id,
                  title: findCourse && findCourse[0]?.course?.title,
                });
                handleGetModules(session?.data?.course?.id);
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
  };

  const handleGetModules = (courseId: any) => {
    HandleModuleGet("", "").then((modules) => {
      const findModule = modules.data?.filter((item: any) => {
        return (
          item?.module?.course_id ===
          (typeof courseId === "object" ? courseId.id : courseId)
        );
      });
      setModules(findModule);
      setmdvalue({
        id: findModule && findModule[0]?.module?.id,
        title: findModule && findModule[0]?.module?.title,
      });
    });
  };

  const handleContentChange = (value: string, identifier: string) => {
    if (value === "<p><br></p>") {
      setError(identifier, { message: "Description is a required field" });
      setValue(identifier, "");
    } else {
      setError(identifier, { message: "" });
      setValue(identifier, value);
    }
    setdespcriptionContent(value);
  };

  const onSubmit = async (event: any) => {
    const id = router.query.id;
    // const reqData = { ...event, 'attachment': file }
    if (
      errors.description?.message === "" ||
      (typeof errors === "object" && errors !== null)
    ) {
      const reqData: any = {
        description: event.description,
        module_id: mdvalue?.id,
        course_id: value?.id,
        title: event.title,
        attachment: file,
      };

      const formData = new FormData();
      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }

      setLoadingButton(true);
      try {
        const res = await HandleSessionUpdate(id, formData);
        getSessionData(id);
        setLoadingButton(false);
        setTimeout(() => {
          router.push("/admin/courses/allsessions/");
        }, 1000);
      } catch (e) {
        console.log(e);
        setLoadingButton(false);
      }
    } else {
      setError("description", { message: "Description is a required field" });
    }
  };

  const handleUpdate = (e: any) => {
    setSession({ ...getSession, title: e.target.value });
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "attachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setFile(file);
        setValue("file", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const option: { id: number; title: string }[] = [];
  getCourses &&
    getCourses.map((data: any, key: any) => {
      return option.push({
        id: data?.course?.id,
        title: data?.course?.title,
      });
    });

  const mdoption: { id: number; title: string }[] = [];
  getModules &&
    getModules.map((data: any, key: any) => {
      return mdoption.push({
        id: data?.module?.id,
        title: data?.module?.title,
      });
    });

  const generateShortDescription = async () => {
    try {
      setAiLoader(true);
      await HandleAIText(getSession?.title, secretKey).then((data) => {
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
            Middle="Session"
            Current="Update Session"
            Text="SESSION"
            Link="admin/courses/allsessions"
          />
          {/* main content */}
          <Card>
            <CardContent>
              {!isLoading && getModules && getSession && getCourses ? (
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
                        UPDATE SESSION
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={Sessions.InputLabelFont}>
                        Session Name
                      </InputLabel>
                      <TextField
                        {...register("title")}
                        value={updateSession.title}
                        onChange={handleUpdate}
                        className={Sessions.inputFieldWidth}
                      />
                      {errors && errors.title
                        ? ErrorShowing(errors?.title?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={Sessions.InputLabelFont}>
                        Course of session
                      </InputLabel>
                      <Autocomplete
                        value={value}
                        inputValue={inputValue}
                        onChange={(event, newValue) => {
                          setNewValue(newValue);
                          handleGetModules(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        options={option}
                        getOptionLabel={(option) => option?.title}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            {...register("course_id")}
                            placeholder="Search Course"
                          />
                        )}
                      />
                      {errors && errors.course_id
                        ? ErrorShowing(errors?.course_id?.message)
                        : ""}
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={Sessions.InputLabelFont}>
                        Module of session
                      </InputLabel>
                      <Autocomplete
                        id="combo-box-demo"
                        value={mdvalue}
                        inputValue={mdinputValue}
                        options={mdoption}
                        getOptionLabel={(mdoption: any) => mdoption?.title}
                        onChange={(event, newValue) => {
                          setmdvalue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setmdInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...register("module_id")}
                            {...params}
                            placeholder="Search for module"
                          />
                        )}
                      />
                      {errors && errors.module_id
                        ? ErrorShowing(errors?.module_id?.message)
                        : ""}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <InputLabel className={Sessions.InputLabelFont}>
                        Attachment
                      </InputLabel>
                      <Box className={Sessions.sessionAttachmentBox}>
                        <Box component="span">
                          {getSession !== undefined && (
                            <Preview name={getSession.attachment} />
                          )}
                        </Box>
                        <Box component="span">
                          <InputLabel
                            className={Sessions.updateSessionAttachments}
                          >
                            <input
                              type="file"
                              {...register("attachment")}
                              onChange={handleChange}
                              hidden
                            />
                            <Typography>
                              {" "}
                              {!file.name ? "Upload" : file.name}
                            </Typography>
                          </InputLabel>
                        </Box>
                      </Box>
                      {file
                        ? ""
                        : errors && errors.file
                        ? ErrorShowing(errors?.file?.message)
                        : ""}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} mb={2}>
                      <Box className={styles.aiCss}>
                        <InputLabel className={Sessions.InputLabelFont}>
                          Description
                        </InputLabel>
                        {getSession &&
                        getSession?.title !== null &&
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
                      <RichEditor
                        {...register("description")}
                        value={
                          despcriptionContent
                            ? despcriptionContent
                            : getSession?.description
                        }
                        onChange={(e) => handleContentChange(e, "description")}
                        className={Sessions.quillDescription2}
                      />
                      {errors && errors.description
                        ? ErrorShowing(errors?.description?.message)
                        : ""}
                      {/* {despcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
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
                        className={Sessions.cancelButton}
                        variant="contained"
                        size="large"
                        onClick={() =>
                          router.push("/admin/courses/allsessions")
                        }
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
                          className={Sessions.updateLoadingButton}
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

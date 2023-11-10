// ** External Components
import { Fragment, useEffect, useState } from "react";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import { BASE_URL } from "@/config/config";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Switch,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  createMuiTheme,
  createTheme,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";

// ** CSS Imports
import styles from "../../../../styles/sidebar.module.css";
import siteStyles from "../../../../styles/allConfigurations.module.css";
import { ToastContainer, toast } from "react-toastify";

// ** React Imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types Imports
import { siteType } from "@/types/siteType";

// ** Service & Validation Imports
import { siteConfigValidations } from "@/validation_schema/configurationValidation";
import {
  HandleSecretKeyUpdate,
  HandleSiteConfigCreate,
  HandleSiteConfigUpdate,
  HandleSiteGetByID,
} from "@/services/site";
import { NextPageContext } from "next";
import Footer from "@/common/LayoutNavigations/footer";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Link from "next/link";

interface SiteConfigPageProps {
  siteConfigData: any; // Replace with the actual type of your site config data
}

const SiteConfiguration = () => {
  const [previewProfile, setPreviewProfile] = useState<siteType>({
    org_logo: "",
    org_favicon: "",
  });
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAddOrEdit, setIsAddOrEdit] = useState<boolean>(false);
  const [portalData, setPortalData] = useState<siteType | any>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [idd, setIdd] = useState<any>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<siteType | any>({
    resolver: yupResolver(siteConfigValidations),
  });

  const onSubmit = async (event: any) => {
    const formData = new FormData();

    const reqData: any = {
      title: event.org_title,
      org_logo: event.org_logoo,
      org_favicon: event.org_favicoon,
      content_sk: event.content_sk,
    };

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    setLoadingButton(true);
    await HandleSiteConfigCreate(formData, "site saved")
      .then((res) => {
        setLoadingButton(false);
        handleGetDataById(res?.data?.user_id);
        setPreviewProfile({
          org_logo: "",
          org_favicon: "",
        });
        setIsAddOrEdit(true);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];

    if (e.target.name === "org_logo") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewProfile({ ...previewProfile, org_logo: e.target.result });
        setValue("org_logoo", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === "org_favicon") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewProfile({ ...previewProfile, org_favicon: e.target.result });
        setValue("org_favicoon", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
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
        setLoading(false);
        if (res.data.length > 0) {
          const hasOLOrOFOrT = res.data.some(
            (item: any) =>
              item.key === "org_logo" ||
              item.key === "org_favicon" ||
              item.key === "title" ||
              item.key === "content_sk"
          );

          if (hasOLOrOFOrT) {
            setIsAddOrEdit(true);
          }
          const result = res.data.reduce((acc: any, { key, value }: any) => {
            acc[key] = value;
            return acc;
          }, {});
          setPortalData(result);
          localStorage.setItem("SiteConfig", JSON.stringify(result));

          res.data.filter((item: any) =>
            item.key === "org_logo"
              ? setValue("org_logoo", item.value)
              : item.key === "org_favicon"
              ? setValue("org_favicoon", item.value)
              : item.key === "title"
              ? setValue("org_title", item.value)
              : item.key === "content_sk"
              ? setValue("content_sk", item.value)
              : ""
          );
          res.data.filter((item: any) =>
            item.key === "content_sk" ? setIdd(item?.id) : ""
          );
          res.data.filter((item: any) =>
            item.key === "content_sk" ? setBtnLoading(item?.is_deleted) : ""
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
      title: event?.org_title,
      org_logo: event?.org_logoo,
      org_favicon: event?.org_favicoon,
      content_sk: event.content_sk,
    };

    const formData: any = new FormData();
    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    setLoadingButton(true);
    await HandleSiteConfigUpdate(formData, "site update")
      .then((res) => {
        setLoadingButton(false);
        handleGetDataById(res.data[0]?.user_id);
        setPreviewProfile({
          org_logo: "",
          org_favicon: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  const handleClick = (isChecked: any) => {
    if (isChecked === true) {
      onStatusUpdate(1);
      setBtnLoading(!btnLoading);
      toast.success("Secret key is enabled");
    } else if (isChecked === false) {
      onStatusUpdate(0);
      setBtnLoading(!btnLoading);
      toast.success("Secret key is disabled");
    }
  };

  const onStatusUpdate = async (data: any) => {
    const reqData: any = {
      is_deleted: data,
    };

    await HandleSecretKeyUpdate(idd, reqData)
      .then((res) => {
        console.log("!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const theme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: "#9b9b9b !important",
          },
          colorPrimary: {
            "&.Mui-checked": {
              color: " #e8661b !important",
            },
          },
          track: {
            opacity: 0.2,
            backgroundColor: "#020202 !important",
            ".Mui-checked.Mui-checked + &": {
              opacity: 0.7,
              backgroundColor: "#e8661be6 !important",
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Navbar portalData={portalData} />
      <ToastContainer />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Site Configuration"
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
                          src="/Images/sideImages/siteSide.svg"
                          width={"100%"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          mt={4}
                          mb={3}
                        >
                          <Typography className={styles.headingTitle}>
                            SITE INFORMATION
                          </Typography>
                          <Divider />
                        </Grid>
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
                            htmlFor="org_title"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Title
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_title"
                            {...register("org_title")}
                            placeholder="Provide your organisation title"
                          />
                          {errors && errors.org_title
                            ? ErrorShowing(errors?.org_title?.message)
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
                            htmlFor="org_llogo"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Logo
                          </InputLabel>

                          {/* upload in db */}

                          <Box className={siteStyles.siteAttachmentBox}>
                            <InputLabel className={siteStyles.subbox}>
                              <TextField
                                type="file"
                                {...register("org_logo")}
                                onChange={handleChange}
                                sx={{ display: "none" }}
                              />
                              {previewProfile?.org_logo ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={previewProfile?.org_logo}
                                    className={siteStyles.previewImage}
                                    width={"200px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconLogo}
                                  />{" "}
                                </Box>
                              ) : (
                                <Typography
                                  className={siteStyles.siteAttachments}
                                >
                                  {" "}
                                  <UploadIcon /> UPLOAD
                                </Typography>
                              )}
                            </InputLabel>
                          </Box>
                          {previewProfile?.org_logo
                            ? ""
                            : errors && errors.org_logoo
                            ? ErrorShowing(errors?.org_logoo?.message)
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
                            htmlFor="org_logo"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Favicon
                          </InputLabel>
                          {/* upload in db */}

                          <Box className={siteStyles.siteAttachmentBox}>
                            <InputLabel className={siteStyles.subbox}>
                              <TextField
                                type="file"
                                {...register("org_favicon")}
                                onChange={handleChange}
                                sx={{ display: "none" }}
                              />
                              {previewProfile?.org_favicon ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={previewProfile?.org_favicon}
                                    className={siteStyles.previewImage}
                                    width={"50px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconFavicon}
                                  />{" "}
                                </Box>
                              ) : (
                                <Typography
                                  className={siteStyles.siteAttachments}
                                >
                                  {" "}
                                  <UploadIcon /> UPLOAD
                                </Typography>
                              )}
                            </InputLabel>
                          </Box>
                          {previewProfile?.org_favicon
                            ? ""
                            : errors && errors.org_favicoon
                            ? ErrorShowing(errors?.org_favicoon?.message)
                            : ""}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          mt={5}
                          mb={3}
                        >
                          <Typography className={styles.headingTitle}>
                            CONTENT GENERATOR
                          </Typography>
                          <Divider className="vvv" />
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
                            htmlFor="content_sk"
                            className={siteStyles.inputLabels}
                          >
                            Secret Key
                            <Tooltip
                              title={
                                <Box>
                                  <Fragment>
                                    <Typography variant="caption">
                                      Please provide your openAI API secret
                                      key.For more information &nbsp;
                                      <Link
                                        target="_blank"
                                        href="https://openai.com/"
                                        className={siteStyles.tooltipcss}
                                      >
                                        Click here
                                      </Link>
                                    </Typography>
                                  </Fragment>
                                </Box>
                              }
                              placement="right-start"
                            >
                              <IconButton>
                                <HelpOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="content_sk"
                            {...register("content_sk")}
                            placeholder="Provide your secret key"
                          />
                          {errors && errors.content_sk
                            ? ErrorShowing(errors?.content_sk?.message)
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
                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          mt={4}
                          mb={3}
                        >
                          <Typography className={styles.headingTitle}>
                            SITE INFORMATION
                          </Typography>
                          <Divider />
                        </Grid>
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
                            htmlFor="org_title"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Title
                          </InputLabel>
                          <TextField
                            fullWidth
                            id="org_title"
                            {...register("org_title")}
                            defaultValue={`${portalData.title}`}
                          />
                          {errors && errors.org_title
                            ? ErrorShowing(errors?.org_title?.message)
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
                            htmlFor="org_llogo"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Logo
                          </InputLabel>
                          <Box className={siteStyles.siteAttachmentBox}>
                            <InputLabel className={siteStyles.subbox}>
                              <TextField
                                type="file"
                                {...register("org_logo")}
                                onChange={handleChange}
                                sx={{ display: "none" }}
                              />
                              {previewProfile?.org_logo ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={previewProfile?.org_logo}
                                    className={siteStyles.previewImage}
                                    width={"200px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconLogo}
                                  />{" "}
                                </Box>
                              ) : portalData?.org_logo ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={BASE_URL + "/" + portalData?.org_logo}
                                    className={siteStyles.previewImage}
                                    width={"200px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconLogo}
                                  />{" "}
                                </Box>
                              ) : (
                                <Typography
                                  className={siteStyles.siteAttachments}
                                >
                                  {" "}
                                  <UploadIcon /> UPLOAD
                                </Typography>
                              )}
                            </InputLabel>
                          </Box>
                          {previewProfile?.org_logo
                            ? ""
                            : errors && errors.org_logoo
                            ? ErrorShowing(errors?.org_logoo?.message)
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
                            htmlFor="org_logo"
                            className={siteStyles.inputLabels}
                          >
                            Organisation Favicon
                          </InputLabel>
                          {/* upload in db */}

                          <Box className={siteStyles.siteAttachmentBox}>
                            <InputLabel className={siteStyles.subbox}>
                              <TextField
                                type="file"
                                {...register("org_favicon")}
                                onChange={handleChange}
                                sx={{ display: "none" }}
                              />
                              {previewProfile?.org_favicon ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={previewProfile?.org_favicon}
                                    className={siteStyles.previewImage}
                                    width={"50px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconFavicon}
                                  />{" "}
                                </Box>
                              ) : portalData?.org_favicon ? (
                                <Box className={siteStyles.cameraIconMain}>
                                  <Box
                                    component={"img"}
                                    src={
                                      BASE_URL + "/" + portalData?.org_favicon
                                    }
                                    className={siteStyles.previewImage}
                                    width={"50px"}
                                  />
                                  <UploadIcon
                                    className={siteStyles.cameraAltIconFavicon}
                                  />{" "}
                                </Box>
                              ) : (
                                <Typography
                                  className={siteStyles.siteAttachments}
                                >
                                  {" "}
                                  <UploadIcon /> UPLOAD
                                </Typography>
                              )}
                            </InputLabel>
                          </Box>
                          {previewProfile?.org_favicon
                            ? ""
                            : errors && errors.org_favicoon
                            ? ErrorShowing(errors?.org_favicoon?.message)
                            : ""}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          mt={5}
                          mb={3}
                        >
                          <Typography className={styles.headingTitle}>
                            CONTENT GENERATOR
                          </Typography>
                          <Divider />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          marginBottom={"20px"}
                        >
                          <Box className={siteStyles.secretbox}>
                            <InputLabel
                              shrink
                              htmlFor="content_sk"
                              className={siteStyles.inputLabels1}
                            >
                              Secret Key
                              <Tooltip
                                placement="right-start"
                                title={
                                  <Box>
                                    <Fragment>
                                      <Typography variant="caption">
                                        This is your openAI APIs secret key.For
                                        more information &nbsp;
                                        <Link
                                          target="_blank"
                                          href="https://openai.com/"
                                          className={siteStyles.tooltipcss}
                                        >
                                          Click here
                                        </Link>
                                      </Typography>
                                    </Fragment>
                                  </Box>
                                }
                              >
                                <IconButton>
                                  <HelpOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </InputLabel>
                            <ThemeProvider theme={theme}>
                              <FormGroup>
                                <FormControlLabel
                                  sx={{
                                    display: "block",
                                  }}
                                  className={siteStyles.switchCss}
                                  control={
                                    <Switch
                                      checked={btnLoading}
                                      onClick={(e: any) =>
                                        handleClick(e.target.checked)
                                      }
                                      name="btnLoading"
                                      color="primary"
                                    />
                                  }
                                  label={undefined}
                                />
                              </FormGroup>
                            </ThemeProvider>
                          </Box>
                          <TextField
                            fullWidth
                            id="content_sk"
                            {...register("content_sk")}
                            defaultValue={`${portalData.content_sk}`}
                          />
                          {errors && errors.content_sk
                            ? ErrorShowing(errors?.content_sk?.message)
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
    </>
  );
};

SiteConfiguration.getInitialProps = async (
  ctx: NextPageContext
): Promise<SiteConfigPageProps> => {
  // Fetch the site config data
  let user_id: any;

  let localData: any;
  if (typeof window !== "undefined") {
    localData = window.localStorage.getItem("userData");
  }
  if (localData) {
    user_id = JSON.parse(localData);
  }
  const siteConfigData = await HandleSiteGetByID(user_id?.id)
    .then((res) => {
      const result = res.data.reduce((acc: any, { key, value }: any) => {
        acc[key] = value;
        return acc;
      }, {});
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return { siteConfigData };
};

export default SiteConfiguration;

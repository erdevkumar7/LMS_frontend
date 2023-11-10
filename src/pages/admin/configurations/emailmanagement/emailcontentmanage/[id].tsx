import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import { Box } from "@mui/system";
import styles from "../../../../../styles/sidebar.module.css";
import {
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailmanagementConfigValidations } from "@/validation_schema/configurationValidation";
import emailStyle from "../../../../../styles/allConfigurations.module.css";
import { emailmanagementType } from "@/types/siteType";
import {
  HandleEmailContentGetByID,
  HandleEmailContentUpdate,
} from "@/services/email";
import CodeMirror from "@uiw/react-codemirror";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { HandleSiteGetByID } from "@/services/site";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EmailContentManage = () => {
  const [tabs, setTab] = useState(0);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [emailBodyText, setEmailBodyText] = useState<string>("");
  const [orgLogo, setOrgLogo] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<emailmanagementType | any>({
    resolver: yupResolver(emailmanagementConfigValidations),
  });

  const emailBodyTextManage =  emailBodyText && emailBodyText?.replace("{{org_logo}}",orgLogo)

  const router = useRouter();
  const { id } = router.query;

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleGetData = async () => {
    await HandleEmailContentGetByID(id)
      .then((res) => {
        if (res.data.length > 0) {
          const fields = ["emailtype", "emailfrom", "emailsubject"];
          fields.forEach((field) => setValue(field, res.data[0][field]));
          setEmailBodyText(res.data[0]?.emailbodytext);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetSiteOptionsDataById = async (userId:any) => {
    setLoading(true)
  await HandleSiteGetByID(userId).then((res) => {

    const hasOLOrOFOrT = res.data.filter(
      (item: any) =>
        item.key === "org_logo"
    );

    setOrgLogo(hasOLOrOFOrT && hasOLOrOFOrT[0]?.value)
    setLoading(false)

  }).catch((err) => {
    console.log(err)
    setLoading(false)

  });

  }
  useEffect(() => {
      let localData: any;
      if (typeof window !== "undefined") {
        localData = window.localStorage.getItem("userData");
      }
      const user_id = JSON.parse(localData);
      handleGetSiteOptionsDataById(user_id?.id);
    handleGetData();
  }, []);

  const onUpdate = async (event: any) => {
    const reqData = {
      emailfrom: event.emailfrom,
      emailtype: event.emailtype,
      emailsubject: event.emailsubject,
      emailbodytext: emailBodyText,
    };

    setLoadingButton(true);
    await HandleEmailContentUpdate(reqData, id)
      .then((res) => {
        setLoadingButton(false);
        handleGetData();
        if (res?.status === 201) {
          setTimeout(() => {
            router.replace("/admin/configurations/emailmanagement/");
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
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
            Middle="Email Management"
            Current="Update Email Management"
            Text="EMAIL"
            Link="admin/configurations/emailmanagement"
          />

          {/* main content */}
          <Card>
            <CardContent>
            {!loading?
            <>
              <Box sx={{ borderBottom: 1, borderColor: "rgb(0,0,0,0.12)" }}>
                <Tabs
                  value={tabs}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="General"
                    sx={{ fontWeight: "bold" }}
                    className={styles.wholeWebsiteButtonColor}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Contents"
                    sx={{ fontWeight: "bold" }}
                    className={styles.wholeWebsiteButtonColor}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Preview"
                    sx={{ fontWeight: "bold" }}
                    className={styles.wholeWebsiteButtonColor}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
            
              <Box
                component="form"
                method="POST"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onUpdate)}
                onReset={reset}
              >
                <TabPanel value={tabs} index={0}>
                  {/* // update data in portal  */}

                  <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel
                        shrink
                        htmlFor="emailtype"
                        className={emailStyle.inputLabels}
                      >
                        E-Mail Type
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="emailtype"
                        {...register("emailtype")}
                        disabled
                      />
                      {errors && errors.emailtype
                        ? ErrorShowing(errors?.emailtype?.message)
                        : ""}
                    </Grid>


                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel
                        shrink
                        htmlFor="emailfrom"
                        className={emailStyle.inputLabels}
                      >
                        E-mail From
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="emailfrom"
                        {...register("emailfrom")}
                        placeholder="Provide your email"
                      />
                      {errors && errors.emailfrom
                        ? ErrorShowing(errors?.emailfrom?.message)
                        : ""}
                    </Grid>

                   
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel
                        shrink
                        htmlFor="emailsubject"
                        className={emailStyle.inputLabels}
                      >
                        E-mail Subject
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="emailsubject"
                        {...register("emailsubject")}
                        placeholder="Provide your subject for email"
                      />
                      {errors && errors.emailsubject
                        ? ErrorShowing(errors?.emailsubject?.message)
                        : ""}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabs} index={1}>
                  <CodeMirror
                    height="383px"
                    maxWidth="1200px"
                    value={emailBodyText}
                    onChange={setEmailBodyText}
                  />
                </TabPanel>
                <TabPanel value={tabs} index={2}>
                  <Box className={emailStyle.emailBodyTextPreview}>
                    <Box
                      dangerouslySetInnerHTML={{ __html: emailBodyTextManage }}
                      padding={2}
                    ></Box>
                  </Box>
                </TabPanel>
                {tabs !== 2 && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    textAlign={"right"}
                    mt={2}
                    pr={3}
                  >
                    <Button
                      type="button"
                      size="large"
                      className={emailStyle.bothButtonSpace}
                      id={styles.muibuttonBackgroundColor}
                      variant="contained"
                      onClick={() => router.back()}
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
                        Update
                      </Button>
                    ) : (
                      <LoadingButton
                        loading={isLoadingButton}
                        size="large"
                        className={emailStyle.siteLoadingButton}
                        variant="contained"
                        disabled
                      >
                        <CircularProgressBar />
                      </LoadingButton>
                    )}
                  </Grid>
                )}
              </Box></>:<SpinnerProgress/>}
            </CardContent>
          </Card>
        </Box>
      </Box>
			<Footer />
      <ToastContainer />
    </>
  );
};

export default EmailContentManage;

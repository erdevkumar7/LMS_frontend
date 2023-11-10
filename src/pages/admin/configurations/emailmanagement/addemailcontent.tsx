import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import { Box } from "@mui/system";
import styles from "../../../../styles/sidebar.module.css";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import emailStyle from "../../../../styles/allConfigurations.module.css";
import { emailmanagementType } from "@/types/siteType";
import {
  HandleEmailContentCreate,
  HandleEmailTypeGetByID,
} from "@/services/email";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import ReactCodeMirror from "@uiw/react-codemirror";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
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

const AddEmailContent = () => {
  const [tabs, setTab] = useState(0);
  const [emailBodyText, setEmailBodyText] = useState<string>("");
  const [emailType, setEmailType] = useState<string>("");
  const [emailTypesData, setEmailTypesData] = useState<[]>([]);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<emailmanagementType | any>({
    resolver: yupResolver(emailmanagementConfigValidations),
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setEmailType(event.target.value as string);
    setValue("emailtype", event.target.value as string);
    setError("emailtype", { message: "" });
  };

  const router = useRouter();

  const onSubmit = async (event: any) => {
    const reqData = {
      emailfrom: event.emailfrom,
      emailtype: event.emailtype,
      emailsubject: event.emailsubject,
      emailbodytext: emailBodyText,
    };
    setLoadingButton(true);
    await HandleEmailContentCreate(reqData)
      .then((res) => {
        if (res?.status === 201) {
          setTimeout(() => {
            router.replace("/admin/configurations/emailmanagement/");
          }, 2000);
        }
        setLoadingButton(false);
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

  const getEmailType = async () => {
    HandleEmailTypeGetByID()
      .then((res) => {
        console.log(res, "emailtype");
        setEmailTypesData(res.data);
      })
      .catch((error) => {
        console.log(error, "Email Type");
      });
  };

  useEffect(() => {
    getEmailType();
  }, []);

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Email"
            Current="Add Email"
            Text="EMAIL MANAGEMENT"
            Link="admin/configurations/emailmanagement/"
          />

          {/* main content */}
          <Card>
            <CardContent>
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
                onSubmit={handleSubmit(onSubmit)}
                onReset={reset}
              >
                <TabPanel value={tabs} index={0}>
                  {/* save data in portal db */}
                  <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel
                        shrink
                        htmlFor="emailtype"
                        className={emailStyle.inputLabels}
                      >
                        E-Mail Type
                      </InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="demo-simple-select"
                          {...register("emailtype")}
                          value={emailType}
                          onChange={handleChange}
                        >
                          <MenuItem value={""} disabled>
                            Please select a type
                          </MenuItem>

                          {emailTypesData.map((e_type: any) => {
                            return (
                              <MenuItem key={e_type.id} value={e_type.type}>
                                {capitalizeFirstLetter(e_type.type)}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

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
                  <ReactCodeMirror
                    height="383px"
                    maxWidth="1200px"
                    value={emailBodyText}
                    onChange={setEmailBodyText}
                  />
                </TabPanel>
                <TabPanel value={tabs} index={2}>
                  <Box className={emailStyle.emailBodyTextPreview}>
                    <Box
                      dangerouslySetInnerHTML={{ __html: emailBodyText }}
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
                      variant="contained"
                      id={styles.muibuttonBackgroundColor}
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
                        Submit
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
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
			<Footer />
      <ToastContainer />
    </>
  );
};

export default AddEmailContent;

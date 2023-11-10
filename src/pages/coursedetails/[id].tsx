import "react-toastify/dist/ReactToastify.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  AccordionSummaryProps,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from "../../styles/webview.module.css";
import {
  HandleCourseByCourseId,
  HandleCourseGet,
  TotalLearner,
} from "@/services/course";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  CourseCard,
  SubscribtionPanCard,
} from "@/common/ResuableCardCmp/coursescard";
import {
  GetAllSubsctionPlans,
  HandleSubscriptionGetByUserID,
} from "@/services/subscription";
import { capitalizeFirstLetter } from "../../common/CapitalFirstLetter/capitalizeFirstLetter";
import ReactPlayer from "react-player";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import {
  CheckEnrolledCourses,
  TopEnrolledCourses,
  UserEnrolledCourses,
} from "@/services/course_enroll";
import { ToastContainer, toast } from "react-toastify";
import { API, BASE_URL } from "@/config/config";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CoursesDetailsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { id } = router.query;
  const [coursedet, setcoursedet] = useState<any>([]);
  const [coursetopic, setcoursetopic] = useState<any>([]);
  const [coursematerial, setcoursematerial] = useState<any>([]);
  const [subsdata, setsubsdata] = useState([]);
  const [Courses, setCourses] = useState([]);
  const [FreeCourses, setFreeCourses] = useState([]);
  const [PaidCourses, setPaidCourses] = useState([]);
  const [modulesdet, setmodulesdet] = useState([]);
  const [userData, setUserData] = useState<any>("");
  const [enrolled, setenrolled] = useState<any>(false);
  const [EnrolledCourses, setEnrolledCoursess] = useState([]);
  const [checkuserSubscStatus, setcheckuserSubscStatus] = useState<any>([]);
  const [totalLearner, setTotalLearner] = useState<any>(0);

  useEffect(() => {
    if (router.isReady) {
      let localData: any;
      if (typeof window !== "undefined") {
        localData = window.localStorage.getItem("userData");
      }
      if (localData) {
        setUserData(JSON.parse(localData));
      }
      getCourseDetails();
      getAllCourseData();
      getSubscribtion();
      getTopEnrolledCourses();

      if (localData) {
        const dt = JSON.parse(localData);
        CheckenrolledCourse(dt?.id);
        ChecUserSubscription(dt?.id);
      }
    }
  }, [router.isReady, id]);

  //get course details by id
  const getCourseDetails = () => {
    HandleCourseByCourseId(id).then((coursedetails) => {
      setcoursedet(coursedetails?.data);
      getTotalLearner(coursedetails?.data?.id);
      setcoursetopic(
        JSON.parse(JSON.parse(coursedetails?.data?.course_learning_topics))
      );
      setcoursematerial(
        JSON.parse(JSON.parse(coursedetails?.data?.Course_learning_material))
      );
      setmodulesdet(coursedetails?.data?.modules);
    });
  };

  //get courses
  const getAllCourseData = () => {
    HandleCourseGet("", "").then((courses) => {
      setCourses(courses?.data?.reverse().slice(0, 10));
      setFreeCourses(
        courses?.data?.filter(
          (a: any) =>
            a?.course?.is_chargeable === "free" &&
            a?.moduleCount.length > 0 &&
            a?.sessionCount.length > 0
        )
      );
      setPaidCourses(
        courses?.data?.filter(
          (a: any) =>
            a?.course?.is_chargeable === "paid" &&
            a?.moduleCount.length > 0 &&
            a?.sessionCount.length > 0
        )
      );
    });
  };
  //get subscription
  const getSubscribtion = () => {
    GetAllSubsctionPlans().then((subscdata) => {
      setsubsdata(subscdata);
    });
  };

  //get total enrolled(total learner)courses by course id
  const getTotalLearner = (course_id: any) => {
    TotalLearner(course_id).then((res) => {
      setTotalLearner(res?.data);
    });
  };

  //get top enrolled courses
  const getTopEnrolledCourses = () => {
    TopEnrolledCourses().then((res) => {
      setEnrolledCoursess(res?.data);
    });
  };
  //enroll course
  const enrolledCourse = () => {
    const reqData = {
      user_id: userData?.id,
      course_id: id,
      course_type: coursedet?.is_chargeable,
    };
    UserEnrolledCourses(reqData).then((res) => {
      if (res?.status) {
        toast.success("Course Enrolled successfully");
        CheckenrolledCourse(userData?.id);
      }
    });
  };
  //check course enrolled or not
  const CheckenrolledCourse = (dt: any) => {
    const reqData = {
      user_id: dt,
      course_id: id,
    };
    CheckEnrolledCourses(reqData).then((res) => {
      if (res?.data?.length > 0) {
        setenrolled(true);
      } else {
        setenrolled(false);
      }
    });
  };
  //check user subscription
  const ChecUserSubscription = (user_id: any) => {
    HandleSubscriptionGetByUserID(user_id).then((res) => {
      if (res) {
        setcheckuserSubscStatus(res?.data?.reverse());
      }
    });
  };
  //dialogs
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [open1, setOpen1] = useState(false);
  const handleClickOpenCheckSubsc = () => {
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const LoginforSubsc = () => {
    setOpen(false);
    router.push("/login");
  };
  const Getsubscription = () => {
    setOpen(false);
    if (checkuserSubscStatus[0]?.status === "inactive") {
      router.push(`/user/subscription/view/${checkuserSubscStatus[0]?.id}`);
    } else if (checkuserSubscStatus[0]?.status === "expired") {
      router.push(`/user/subscription/view/${checkuserSubscStatus[0]?.id}`);
    } else {
      router.push("/subscribeplan");
    }
  };

  const Enrolled = () => {
    router.push(`/user/course/detail/${coursedet?.id}`);
  };

  const breadcrumbs = [
    <Link key="2" color="inherit" href="/courses">
      Course
    </Link>,
    <Typography key="3" sx={{ color: "#e8661b" }}>
      Course Details
    </Typography>,
  ];

  let rotalsession = 0;
  coursedet &&
    coursedet?.modules?.forEach((element: any) => {
      rotalsession += element?.sessions?.length;
    });


  return (
    <>
      {/*header*/}
      <WebViewNavbar />
      {/*main part*/}
      <Box className={styles.coursesdetails}>
        <Container maxWidth="lg">
          <Box sx={{ paddingLeft: "1.7rem" }} marginBottom={"25px"}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          {/*main card content*/}

          <Grid container spacing={2} className={styles.crsgrid}>
            <Grid item xs={12} md={3} >
              <CardMedia
                component="img"
                sx={{

                  display: { xs: 'block', sm: "block", md: "block", lg: "block", borderRadius: "10px" },
                }}
                image={
                  coursedet?.image !== null
                    ? `${BASE_URL}/${coursedet?.image}`
                    : "https://leverageedu.com/blog/wp-content/uploads/2020/06/Short-term-Professional-Courses-after-Graduation.jpg"
                }
                alt={"image"}
              />
              {/* </Box> */}
            </Grid>
            <Grid item xs={12} md={6} >
              <CardContent sx={{ flex: 1, paddingTop: "0px", paddingBottom: "0px" }}>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
                >
                  {coursedet?.title
                    ? capitalizeFirstLetter(coursedet?.title)
                    : ""}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Type :{" "}
                  {coursedet?.is_chargeable
                    ? capitalizeFirstLetter(coursedet?.is_chargeable)
                    : ""}
                </Typography>
                <Typography
                  variant="subtitle1"
                  paragraph
                  sx={{ fontFamily: "sans - serif" }}
                >
                  {coursedet?.short_description
                    ? capitalizeFirstLetter(
                      coursedet?.short_description
                        ? coursedet?.short_description?.replace(
                          /(<([^>]+)>)/gi,
                          ""
                        )
                        : ""
                    )
                    : ""}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  paragraph
                  sx={{ fontFamily: "sans - serif" }}
                >
                  {totalLearner === 0 ? 10 : totalLearner * 2} <sup>+</sup>{" "}
                  Enrolled Students
                </Typography>
                {userData && coursedet && modulesdet ? (
                  <>
                    {enrolled === true ? (
                      <Button
                        variant="contained"
                        className="authPageButton"
                        id={styles.muibuttonBackgroundColor}
                        onClick={Enrolled}
                      >
                        Start Course
                      </Button>
                    ) : checkuserSubscStatus.length <= 0 &&
                      coursedet?.is_chargeable === "free" ? (
                      <Button
                        variant="contained"
                        className="authPageButton"
                        id={styles.muibuttonBackgroundColor}
                        onClick={enrolledCourse}
                      >
                        Enroll Now
                      </Button>
                    ) : checkuserSubscStatus.length > 0 &&
                      coursedet?.is_chargeable === "paid" &&
                      checkuserSubscStatus[0]?.status === "active" ? (
                      <Button
                        variant="contained"
                        className="authPageButton"
                        id={styles.muibuttonBackgroundColor}
                        onClick={enrolledCourse}
                      >
                        Enroll Now
                      </Button>
                    ) : checkuserSubscStatus.length > 0 &&
                      coursedet?.is_chargeable === "free" &&
                      (checkuserSubscStatus[0]?.status === "active" ||
                        checkuserSubscStatus[0]?.status === "canceled" ||
                        checkuserSubscStatus[0]?.status === "expired" ||
                        checkuserSubscStatus[0]?.status === "inactive") ? (
                      <Button
                        variant="contained"
                        className="authPageButton"
                        id={styles.muibuttonBackgroundColor}
                        onClick={enrolledCourse}
                      >
                        Enroll Now
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        className="authPageButton"
                        id={styles.muibuttonBackgroundColor}
                        onClick={handleClickOpenCheckSubsc}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </>
                ) : coursedet && modulesdet ? (
                  <Button
                    variant="contained"
                    className="authPageButton"
                    id={styles.muibuttonBackgroundColor}
                    onClick={handleClickOpen}
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      "&:hover": { backgroundColor: "red" },
                      backgroundColor: "red",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      cursor: "default",
                    }}
                  >
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Grid>
            <Grid item xs={12} md={3} >
              <center>
                <Box sx={{ display: "flex", }}>
                  <Box
                    sx={{
                      background: "white",
                      border: "border: 1px solid #80808024",
                      borderRadius: "6px",
                      width: "auto"
                    }}
                  >
                    <ReactPlayer
                      url={`${BASE_URL}/${coursedet?.video}`}
                      width={'300'}
                      height={"auto"}
                      playing={true}
                      muted={true}
                      controls={true}
                    />
                  </Box>
                </Box>
              </center>
            </Grid>
          </Grid>

          {/*main card details*/}
          <Grid container spacing={2} className={styles.crsgrid} mt={5}>
            <Grid item xs={12} md={8} lg={9}>
              <Card sx={{ padding: "20px" }}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    About This Course
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    mt={1}
                    sx={{ lineHeight: "26px" }}
                  >
                    {coursedet?.long_description
                      ? capitalizeFirstLetter(
                        coursedet?.long_description?.replace(
                          /(<([^>]+)>)/gi,
                          ""
                        )
                      )
                      : ""}
                  </Typography>
                  {(coursetopic && coursetopic?.length === 0) ||
                    coursetopic === null ? (
                    ""
                  ) : (
                    <Box
                      sx={{
                        border: "1px solid gray",
                        marginTop: "30px",
                        padding: "10px",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        What you&apos;ll learn
                      </Typography>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        {coursetopic?.map((item: any, key: any) => {
                          return (
                            <Grid item xs={6} key={key}>
                              <ListItem>
                                <ListItemIcon>
                                  <CheckOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={Object.values(item)} />
                              </ListItem>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}
                  {(coursematerial && coursematerial?.length === 0) ||
                    coursematerial === null ? (
                    ""
                  ) : (
                    <Fragment>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        mt={3}
                        sx={{ fontWeight: "bold" }}
                      >
                        This course includes:
                      </Typography>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        {coursematerial?.map((item: any, key: any) => {
                          return (
                            <Grid item xs={6} key={key}>
                              <ListItem>
                                <ListItemIcon>
                                  <CheckOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={Object.values(item)} />
                              </ListItem>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Fragment>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <center>
                <Card sx={{ maxWidth: 345, display: "flex" }}>
                  <CardActionArea>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <PeopleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              (totalLearner === 0 ? 10 : totalLearner * 2) +
                              " " +
                              "Learner"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AlarmOnIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              coursedet?.duration === "three_months"
                                ? "3 Months"
                                : coursedet?.duration === "six_months"
                                  ? "6 Months"
                                  : "12 Months"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WorkspacePremiumIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              capitalizeFirstLetter(coursedet?.level) +
                              " " +
                              "level"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AlarmOnIcon />
                          </ListItemIcon>
                          <ListItemText primary="3-4 Hour per week" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </center>
              <Box sx={{ maxWidth: 345, display: "flex" }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Related Courses
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      pl: 2.5,
                      "& .MuiListItem-root": {
                        display: "list-item",
                      },
                    }}
                  >
                    {Courses?.slice(0, 10).map((data: any, key: any) => {
                      return (
                        <ListItem key={key}>
                          <Link
                            href={`/coursedetails/${data?.course.id}`}
                            className={styles.listitems}
                          >
                            {data?.course?.title
                              ? capitalizeFirstLetter(data?.course?.title)
                              : ""}
                          </Link>
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Box>
            </Grid>
          </Grid>

          {coursedet && modulesdet ? (
            <Grid container spacing={2} className={styles.crsgrid} mt={5}>
              <Grid item xs={12} md={8} lg={9}>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  Course content
                </Typography>
                <Box mt={1}>
                  <Typography sx={{ fontSize: "15px" }} mb={1}>
                    {coursedet && coursedet?.modules === undefined
                      ? 0
                      : coursedet?.modules?.length}{" "}
                    Modules, {rotalsession} sessions
                  </Typography>
                  {modulesdet?.map((value: any, key) => {
                    return (
                      <Accordion key={key}>
                        <AccordionSummary
                          aria-controls="panel1d-content"
                          id="panel1d-header"
                        >
                          <Typography> {value?.title}</Typography>
                        </AccordionSummary>
                        {value?.sessions.map((session: any, key: any) => {
                          return (
                            <AccordionDetails key={key}>
                              <Typography>{session?.title}</Typography>
                            </AccordionDetails>
                          );
                        })}
                      </Accordion>
                    );
                  })}
                </Box>
              </Grid>
              <Grid item xs={12} md={3} lg={3}></Grid>
            </Grid>
          ) : (
            ""
          )}
          {/*top enrolled course*/}
          <Box className={styles.enrolled}>
            <Container maxWidth="lg">
              <Box className={styles.headerbox}>
                <Typography variant="h6" gutterBottom className={styles.h6}>
                  Our Subscription plan
                </Typography>
                <Divider className={styles.divder} />
              </Box>
              <Box className={styles.freecourses} mt={5}>
                <Container maxWidth="lg">
                  <Box>
                    <Grid container spacing={2} justifyContent={"space-evenly"}>
                      {subsdata &&
                        subsdata?.map((data, key) => {
                          return (
                            <SubscribtionPanCard subsdata={data} key={key} />
                          );
                        })}
                    </Grid>
                  </Box>
                </Container>
              </Box>
            </Container>
          </Box>
          {/*top enrolled course*/}
          <Box className={styles.enrolled}>
            <Container maxWidth="lg">
              <Box className={styles.headerbox}>
                <Typography variant="h6" gutterBottom className={styles.h6}>
                  Top Enrolled Courses
                </Typography>
                <Divider className={styles.divder} />
              </Box>
              <Box className={styles.articles}>
                {EnrolledCourses?.slice(0, 6).map((data, key) => {
                  return <CourseCard key={key} enrolledCourses={data} />;
                })}
              </Box>
            </Container>
          </Box>
          {/*top Free course*/}
          <Box className={styles.freecourses}>
            <Container maxWidth="lg">
              <Box className={styles.headerbox}>
                <Typography variant="h6" gutterBottom className={styles.h6}>
                  Top Free Courses
                </Typography>
                <Divider className={styles.divder} />
              </Box>
              <Box className={styles.articles}>
                {FreeCourses?.slice(0, 6).map((data, key) => {
                  return <CourseCard key={key} freecourses={data} />;
                })}
              </Box>
            </Container>
          </Box>
          {/*top Paid course*/}
          <Box className={styles.freecourses}>
            <Container maxWidth="lg">
              <Box className={styles.headerbox}>
                <Typography variant="h6" gutterBottom className={styles.h6}>
                  Top Paid Courses
                </Typography>
                <Divider className={styles.divder} />
              </Box>
              <Box className={styles.articles}>
                {PaidCourses?.slice(0, 6).map((data, key) => {
                  return <CourseCard key={key} freecourses={data} />;
                })}
              </Box>
            </Container>
          </Box>
        </Container>
      </Box>
      {/*footer*/}
      <WebViewFooter />
      {/*dialouge box1*/}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Take Subscription Now
                </BootstrapDialogTitle> */}
        <DialogContent>
          <Typography gutterBottom>
            {/* Hii, user if you have a already subscriptins in LMS Portal.  */}
            Please login to enroll in courses.
          </Typography>
          {/* <Typography gutterBottom>
                        Don&apos;t have a subscriptions please subscribe.
                    </Typography> */}
        </DialogContent>
        <DialogActions style={{ padding: "0px 10px 10px 0px" }}>
          <Button
            autoFocus
            variant="contained"
            id={styles.muibuttonBackgroundColor}
            onClick={LoginforSubsc}
          >
            {/* Subscribe Now */}
            Login
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/*  {/*dialouge box2 */}
      <BootstrapDialog
        onClose={handleClose1}
        aria-labelledby="customized-dialog-title"
        open={open1}
      >
        {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose1}>
                    Take Subscription Now
                </BootstrapDialogTitle> */}
        <DialogContent>
          <Typography gutterBottom>
            {/* Hii,  <Typography gutterBottom sx={{ fontWeight: "bold" }}> {userData?.first_name} </Typography> You Don&apos;t have a any subscriptions in LMS portal. Please subscribe and enroll paid courses. */}
            Please Subscribe to paid courses and enroll
          </Typography>
          <Typography gutterBottom></Typography>
        </DialogContent>
        <DialogActions style={{ padding: "0px 10px 10px 0px" }}>
          <Button
            autoFocus
            variant="contained"
            id={styles.muibuttonBackgroundColor}
            onClick={Getsubscription}
          >
            Subscribe
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <ToastContainer />
    </>
  );
}

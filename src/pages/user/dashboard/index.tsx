// React Import
import React, { useState, useEffect, Fragment } from "react";

// MUI Import
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// Helper Import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import Paper from "@mui/material/Paper";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";


import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import moment from "moment";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";

// CSS Import
import styles from "../../../styles/sidebar.module.css";
import style from "../../../styles/webview.module.css";
import subs from "../../../styles/subscription.module.css";
import dashboardStyles from "../../../styles/dashboard.module.css";

import { GetdateAfterOneMonth } from "@/common/commonfunctions/connonfun";
import {
  EnrolledCourseCard,
  EnrolledCourseCardListView,
} from "@/common/ResuableCardCmp/coursescard";
import { GetEnrolledCoursesByUserId } from "@/services/course_enroll";
import Image from "next/image";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Link from "next/link";
import Footer from "@/common/LayoutNavigations/footer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Dashboard() {
  const [subsData, setSubsdata] = useState<any>([]);
  const [enrollCourse, setEnrollCourses] = useState<any>([]);
  const [userId, setuserId] = useState<any>();
  const [gridview, setgridview] = useState<any>(true);
  const [subsError, setSubsError] = useState<any>("");
  const [dynamicCss, setDynamicCss] = useState<any>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let localData: any;
    var getId: any;

    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      getId = JSON.parse(localData);
    }
    setIsLoading(true);
    // getSubsData();
    setuserId(getId?.id);
    getEnrollCourse();
  }, [userId]);



  const getEnrollCourse = async () => {
    if (userId) {
      GetEnrolledCoursesByUserId(userId).then((data: any) => {
        setEnrollCourses(data?.data?.enroll_course);
        setSubsdata(data?.data?.subscription);
        setIsLoading(false);
      });
    }
  };

  //gridview
  const gridView = () => {
    setgridview(true);
    setDynamicCss(1);
  };

  const listView = () => {
    setgridview(false);
    setDynamicCss(2);
  };

  function multiply(a: any, b: any) {
    return a * b;
  }

  return (
    <>
      <Navbar />
      <Box
        className={styles.combineContentAndSidebar}
        data-testid="checkInDocument"
      >
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <Box className={subs.maindisplay}>
            <BreadcrumbsHeading
              First="Home"
              Current="Dashboard"
              Text="DASHBOARD"
              Link="/user/dashboard"
            />
          </Box>
          {/* main content */}
          {!isLoading ? (
            !subsData || subsData?.status !== "active" ? (
              <Fragment>
                <Card>
                  <CardContent>
                    <Typography variant="h5" className={style.headingcss}>
                      Your Subscription Plan
                    </Typography>
                    <Divider sx={{ marginTop: "5px" }}></Divider>
                    <br />
                    <br />
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid
                        container
                        spacing={2}
                        className={style.textHeadingCenter}
                      >
                        <Typography
                          variant="h5"
                          className={style.headingcssError}
                        >
                          You dont have subscription plan{" "}
                          <Link className={style.plancss} href="/subscribeplan">
                            Subscribe Now
                          </Link>
                        </Typography>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
                <br />
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="h5" className={style.headingcss}>
                        Enrolled Courses
                      </Typography>

                      <Box className={style.alignendcss}>
                        <Stack spacing={1} className={style.gridicon}>
                          <IconButton
                            className={style.actionview1}
                            onClick={gridView}
                          >
                            <GridViewIcon
                              className={
                                dynamicCss === 1
                                  ? style.gridColor
                                  : style.iconColor
                              }
                            />
                          </IconButton>
                          <IconButton
                            className={style.actionview1}
                            onClick={listView}
                          >
                            <FormatListBulletedIcon
                              className={
                                dynamicCss === 2
                                  ? style.gridColor
                                  : style.iconColor
                              }
                            />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                    <Divider sx={{ marginTop: "5px" }}></Divider>
                    <br />
                    <br />
                    {enrollCourse && enrollCourse?.length === 0 ? (
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          className={style.textHeadingCenter}
                        >
                          <Typography
                            variant="h5"
                            className={style.headingcssError}
                          >
                            Enrolled courses not found!
                          </Typography>
                        </Grid>
                      </Box>
                    ) : (
                      <Box className={style.courses1}>
                        <Container maxWidth="lg">
                          {gridview ? (
                            <Box className={style.articles1}>
                              {enrollCourse &&
                                enrollCourse.map((data: any, key: any) => {
                                  return (
                                    <EnrolledCourseCard
                                      key={key}
                                      coursedata={data.course}
                                    />
                                  );
                                })}
                            </Box>
                          ) : (
                            <Box className={style.listviewarticles}>
                              <Container maxWidth="lg">
                                {enrollCourse &&
                                  enrollCourse.map((data: any, key: any) => {
                                    return (
                                      <EnrolledCourseCardListView
                                        key={key}
                                        coursedata={data.course}
                                      />
                                    );
                                  })}
                              </Container>
                            </Box>
                          )}
                        </Container>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <br />
              </Fragment>
            ) : (
              <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Card>
                      <CardContent
                        className={dashboardStyles.quickstatText1user}
                      >
                        <Box className={dashboardStyles.quickstatBoxes}>
                          <Box>
                            <Typography
                              className={dashboardStyles.quickstatText}
                              data-testid="checkText"
                            >
                              Subscription Name
                            </Typography>
                            <Typography>
                              {capitalizeFirstLetter(
                                subsData && subsData?.name
                              )}
                            </Typography>
                          </Box>
                          <Box
                            component={"img"}
                            src="/Images/pages_icon/bell1.png"
                            width={"20%"}
                            className={dashboardStyles.bdradius}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Card>
                      <CardContent
                        className={dashboardStyles.quickstatText2user}
                      >
                        <Box className={dashboardStyles.quickstatBoxes}>
                          <Box>
                            <Typography
                              className={dashboardStyles.quickstatText}
                            >
                              Duration Term
                            </Typography>
                            <Typography>
                              {capitalizeFirstLetter(
                                subsData && subsData?.duration_term
                              )}
                            </Typography>
                          </Box>
                          <Box
                            component={"img"}
                            src="/Images/pages_icon/calender11.png"
                            width={"20%"}
                            // className={dashboardStyles.bdradius}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Card>
                      <CardContent
                        className={dashboardStyles.quickstatText3user}
                      >
                        <Box className={dashboardStyles.quickstatBoxes}>
                          <Box>
                            <Typography
                              className={dashboardStyles.quickstatText}
                            >
                              Renew Date
                            </Typography>
                            <Typography>
                              {moment(
                                GetdateAfterOneMonth(subsData?.start_date)
                              ).format("DD MMMM YYYY")}
                            </Typography>
                          </Box>
                          <Box
                            component={"img"}
                            src="/Images/pages_icon/renew1.png"
                            width={"20%"}
                            className={dashboardStyles.bdradius}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <br />
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="h5" className={style.headingcss}>
                        Enrolled Courses
                      </Typography>

                      <Box className={style.alignendcss}>
                        <Stack spacing={1} className={style.gridicon}>
                          <IconButton
                            className={style.actionview1}
                            onClick={gridView}
                          >
                            <GridViewIcon
                              className={
                                dynamicCss === 1
                                  ? style.gridColor
                                  : style.iconColor
                              }
                            />
                          </IconButton>
                          <IconButton
                            className={style.actionview2}
                            onClick={listView}
                          >
                            <FormatListBulletedIcon
                              className={
                                dynamicCss === 2
                                  ? style.gridColor
                                  : style.iconColor
                              }
                            />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                    <Divider sx={{ marginTop: "5px" }}></Divider>
                    <br />
                    {enrollCourse && enrollCourse?.length === 0 ? (
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          className={style.textHeadingCenter}
                        >
                          <Typography
                            variant="h5"
                            className={style.headingcssError}
                          >
                            Enrolled courses not found!
                          </Typography>
                        </Grid>
                      </Box>
                    ) : (
                      <Box className={style.courses1}>
                        <Container maxWidth="lg">
                          {gridview ? (
                            <Box className={style.articles1}>
                              {enrollCourse &&
                                enrollCourse.map((data: any, key: any) => {
                                  return (
                                    <EnrolledCourseCard
                                      key={key}
                                      coursedata={data.course}
                                    />
                                  );
                                })}
                            </Box>
                          ) : (
                            <Box className={style.listviewarticles}>
                              <Container maxWidth="lg">
                                {enrollCourse &&
                                  enrollCourse.map((data: any, key: any) => {
                                    return (
                                      <EnrolledCourseCardListView
                                        key={key}
                                        coursedata={data.course}
                                      />
                                    );
                                  })}
                              </Container>
                            </Box>
                          )}
                        </Container>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <br />
              </Fragment>
            )
          ) : (
            <Card>
              <CardContent>
                <SpinnerProgress />
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
}

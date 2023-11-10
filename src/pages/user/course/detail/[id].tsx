// React Import
import React, { useState, useEffect, Fragment } from "react";
import Countdown from 'react-countdown';

// MUI Import
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useProSidebar } from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ReactPlayer from "react-player/lazy";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

// Helper Import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import Paper from "@mui/material/Paper";

import { useRouter } from "next/router";
import { HandleCourseByCourseId } from "@/services/course";
import { HandlePDF } from "@/services/pdfdownload";
import moment from 'moment';

import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import MenuBookIcon from "@mui/icons-material/MenuBook";

// CSS Import
import LiveTvIcon from '@mui/icons-material/LiveTv';
import styles from "../../../../styles/sidebar.module.css";
import subs from "../../../../styles/subscription.module.css";
import courseStyle from "../../../../styles/course.module.css";
import Image from "next/image";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { BASE_URL } from "@/config/config";
import Link from "next/link";
import Preview from "@/common/PreviewAttachments/previewAttachment";
import {
  HandleCourseGetByUserId,
  MarkAsComplete,
  UpdateMarkAsComplete,
} from "@/services/course_enroll";
import Footer from "@/common/LayoutNavigations/footer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  marginBottom: "4px",
}));

export default function Couseview() {
  const [couseData, setCousedata] = useState<any>([]);
  const [files, setFiles] = useState<any>("");
  const [activeToggle, setActiveToggle] = useState<any>("");
  const [sessionData, setSessionData] = useState<any>([]);
  const [progress, setProgress] = useState<any>(10);
  const [allData, setAllData] = useState<any>([]);
  const [userId, setUserId] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iscomplete, setComplete] = useState<boolean>(false)
  const { collapseSidebar, toggleSidebar, toggled } = useProSidebar();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  var fileViewComplete: any = 0;
  var viewhistoryLength: any = [];

  // const Completionist = () => <span>Live Now</span>;
  const currentDate = new Date(); // Get the current date and time
  const year = currentDate.getFullYear(); // Get the year
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get the month (zero-based)
  const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day
  const hours = String(currentDate.getHours()).padStart(2, '0'); // Get the hours
  const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get the minutes
  const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Get the seconds
  const formattedCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // const Completionist = () => <span>Streaming over</span>;
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      setComplete(true)
      // return <Completionist />;
    } else {
      setComplete(false)
      return (
        <Box>
          {days == 0 ? <Box>{hours}h {minutes}m {seconds}s </Box> :
            <Box>{days}d {hours}h {minutes}m {seconds}s </Box>}
        </Box>
      );
    }
  };
  useEffect(() => {
    let localData: any;
    let getId: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      getId = JSON.parse(localData);
    }
    setIsLoading(true);
    setUserId(getId.id);
    getCourseData();
    setProgress((prevProgress: any) =>
      prevProgress >= 100 ? 10 : prevProgress + 10
    );

  }, [userId]);

  const router = useRouter();
  const { id } = router?.query;

  const getCourseData = async () => {
    const idd = router?.query?.id;
    if (idd) {
      HandleCourseByCourseId(idd).then((data: any) => {
        setCousedata(data?.data);
      });

      if (userId && userId) {
        HandleCourseGetByUserId(userId).then((data1) => {
          setAllData(data1.data);
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    }
  };

  //tooltip
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "#e8661b",
      boxShadow: theme.shadows[1],
      fontSize: 13,
    },
  }));

  const handlebtnClick = (rowData: any) => {
    setMobileMoreAnchorEl(null);
    // console.log(rowData)
    setSessionData([]);
    setActiveToggle(rowData.id);
    setSessionData(rowData);
    if (rowData.attachment !== null) {
      setFiles(rowData.attachment);
    } else {
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      collapseSidebar();
    } else {
      collapseSidebar();
    }
  };

  const handleLiveSession = () => {
    const sessionIDD = sessionData?.id
    window.open(`/user/course/liveusersession/${sessionIDD}?course_id=${id}`, '_blank')
  }


  const download = async (identifier: any) => {

    if (identifier === "image") {
      let reqData = {
        imagename: files,
        identifier: "image",
      };
      HandlePDF(reqData).then((itemSeached: any) => { });
    } else if (identifier === "pdf") {
      let reqData = {
        imagename: files,
        identifier: "pdf",
      };
      HandlePDF(reqData).then((itemSeached: any) => { });
    } else if (identifier === "txt") {
      let reqData = {
        imagename: files,
        identifier: "txt",
      };
      HandlePDF(reqData).then((itemSeached: any) => { });
    } else if (identifier === "mp4") {
      let reqData = {
        imagename: files,
        identifier: "mp4",
      };
      HandlePDF(reqData).then((itemSeached: any) => { });
    } else {
      toast.warn("Something went wrong");
    }
  };

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            className="linercss"
          />
        </Box>
        <Box sx={{ minWidth: -1 }} className="progressCss">
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(props.value)}%`}&nbsp;Complete
          </Typography>
        </Box>
      </Box>
    );
  }
  function LinearProgressWithLabel1(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            className="linercss"
          />
        </Box>
        <Box sx={{ minWidth: -1 }} className="progressCss">
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(props.value)}%`}&nbsp;Complete
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleMarkAsComplete = () => {
    let reqData = {
      user_id: userId,
      course_id: sessionData.course_id,
      module_id: sessionData.module_id,
      session_id: sessionData.id,
    };
    MarkAsComplete(reqData).then((data: any) => {
      getCourseData();
    });
  };

  var calculate: any;
  var isMatchFound: any;

  //Dont remove 'getPercentage' variable
  const getPercentage =
    allData &&
    allData.map((row: any) => {
      const obj = row?.courseIdCounts;
      const key: any = router?.query?.id;
      const value = obj[key];
      if (id && id) {
        let courseId: any = router?.query?.id;
        const item =
          row &&
          row?.sessionCount.find(
            (item: any) => item.course_id === parseInt(courseId)
          );

        const sessionCount = item ? item.sessionCount : null;
        if (sessionCount) {
          calculate = (value / sessionCount) * 100;
        }
        if (calculate && calculate === 100) {
          let reqData = {
            user_id: userId,
            course_id: sessionData.course_id,
            module_id: sessionData.module_id,
            session_id: sessionData.id,
            status: couseData.is_chargeable,
          };
          UpdateMarkAsComplete(reqData).then((data: any) => { });
        }
      }
    });

  //Dont remove 'completeMark' variable
  const completeMark =
    allData &&
    allData.map((row: any) => {
      let item = row && row.course.view_history;
      let moduleId = sessionData?.module_id;
      let sessionId: any = sessionData?.id;
      item &&
        item.map((data: any) => {
          isMatchFound = Object.entries(data).some(([key, value]: any) => {
            return key == moduleId && value.includes(sessionId);
          });
        });
      if (isMatchFound === true) {
        fileViewComplete = 1;
      }
    });

  var moduleCheckId: any = [];
  let courseIdd: any = router?.query?.id;

  const filteredData =
    allData &&
    allData.filter(
      (item: any) => item.course.course.id === parseInt(courseIdd)
    );
  const moduleIdd = couseData && couseData?.modules;

  if (moduleIdd) {
    for (let i = 0; i < moduleIdd.length; i++) {
      const viewHistory = filteredData && filteredData[0]?.course?.view_history;
      if (viewHistory === null) {
      } else {
        for (let j = 0; j < viewHistory?.length; j++) {
          Object.entries(viewHistory[j]).map(([key, value]: any) => {
            viewhistoryLength.push({
              viewPercent: value.length,
              module_id: moduleIdd[i].id,
            });
            moduleCheckId.push(parseInt(key));
          });
        }
      }
    }
  }

  if (!id) {
    return null;
  }
  var moduleCheckIdManage = Array.from(new Set(moduleCheckId));
  var viewhistoryLengthManage: any = Array.from(new Set(viewhistoryLength));

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      sx={{ marginTop: "25px !important" }}
      onClose={handleMobileMenuClose}
    >
      <MenuItem >
        <Grid item sm={12} xs={12} md={3} lg={3} xl={3} sx={{ height: '300px', overflow: 'auto' }}>
          <Box className={subs.maindiv}>
            <Typography variant="h5" className={subs.useNameFront2}>
              Course Curriculum
            </Typography>
            <Box sx={{ width: "92%" }}>
              <LinearProgressWithLabel
                value={
                  calculate && calculate !== null ? calculate : 0
                }
              />
            </Box>
            <br />
            {couseData &&
              couseData?.modules?.map(
                (item: any, index: number) => {
                  const numberConversion: any =
                    viewhistoryLengthManage[index]?.module_id ===
                      item.id
                      ? viewhistoryLengthManage[index]?.viewPercent
                      : viewhistoryLengthManage[index]?.viewPercent;

                  return (
                    <Accordion key={item?.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Box>
                          <Typography
                            className={courseStyle.typoTitle}
                          >
                            <MenuBookIcon
                              className={subs.iconcss}
                            />{" "}
                            &nbsp;{" "}
                            {capitalizeFirstLetter(item?.title)}
                          </Typography>
                          <Box
                            sx={{ width: "60%", float: "right" }}
                          >
                            <LinearProgressWithLabel1
                              value={
                                moduleCheckIdManage &&
                                  moduleCheckIdManage.includes(
                                    item.id
                                  )
                                  ? (numberConversion /
                                    item?.sessions?.length) *
                                  100
                                  : 0
                              }
                            />
                          </Box>
                        </Box>
                      </AccordionSummary>


                      <AccordionDetails>
                        {item?.sessions.map((itemData: any) => {
                          const togglee =
                            itemData?.id === activeToggle
                              ? "active"
                              : "";

                          return (

                            <Fragment key={itemData?.id}>
                              <Box
                                sx={{
                                  width: "100%",
                                  bgcolor: "background.paper",
                                }}
                              >
                                <nav aria-label="main mailbox folders">
                                  <List>
                                    <ListItem disablePadding>
                                      <ListItemButton
                                        className={
                                          togglee &&
                                          courseStyle.backgroundClick
                                        }
                                        onClick={() =>
                                          handlebtnClick(itemData)
                                        }
                                      >
                                        {itemData.attachment && (
                                          <Preview
                                            name={
                                              itemData.attachment
                                            }
                                            identifier="user"
                                          />
                                        )}
                                        <Typography
                                          variant="subtitle2"
                                          className={
                                            courseStyle.typolist
                                          }
                                        >
                                          &nbsp;
                                          {capitalizeFirstLetter(itemData?.title)}
                                        </Typography>
                                        <Box sx={{ color: '#d32f2f', marginLeft: 'auto' }} >
                                          {(itemData?.live_end_date) < new Date() ? "" : <LiveTvIcon />}

                                        </Box>
                                      </ListItemButton>
                                    </ListItem>
                                  </List>
                                </nav>
                                <Divider />
                              </Box>
                            </Fragment>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              )}
          </Box>
        </Grid>
      </MenuItem>

    </Menu>
  );
  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <Box className={subs.maindisplay}>
            <BreadcrumbsHeading
              First="Home"
              Middle="Courses"
              Current={couseData && couseData?.title}
              Text=""
              Link="user/course"
            />
            <Box className={courseStyle.backbtn}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                className={courseStyle.backbtncscourse}
                id={styles.muibuttonBackgroundColor}
                onClick={() => router.back()}
              >
                <ArrowBackOutlinedIcon />
                &nbsp;Back
              </Button>
            </Box>
          </Box>
          <br />

          {/* main content */}
          <Box className={subs.corseDetaildiv}>
            <Card className={subs.mediaque}>
              <CardContent>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item sm={12} xs={12} md={9} lg={9} xl={9}>
                      <Item className={subs.shadoww}>
                        {(files && files?.includes("mp4")) ||
                          files?.includes("3gp") ||
                          files?.includes("webm") ? (
                          <Fragment>
                            <Grid item xs={12}>
                              <Item className={subs.videodisplay}>
                                <ReactPlayer
                                  config={{
                                    file: {
                                      attributes: {
                                        controlsList: "nodownload",
                                      },
                                    },
                                  }}
                                  controls={true}
                                  url={`${BASE_URL}/${files}`}
                                  width="167%"
                                  height="100%"
                                />
                                <Box className={subs.maindisplay}>
                                  <Typography
                                    variant="h5"
                                    className={subs.useNameFront1}
                                  >
                                    {capitalizeFirstLetter(
                                      sessionData && sessionData?.title
                                    )}
                                  </Typography>


                                </Box>

                                <Typography
                                  variant="subtitle2"
                                  className={courseStyle.fontCS}
                                >
                                  {capitalizeFirstLetter(
                                    sessionData &&
                                    sessionData?.description?.replace(
                                      /(<([^>]+)>)/gi,
                                      ""
                                    )
                                  )}
                                </Typography>
                              </Item>
                            </Grid>
                          </Fragment>
                        ) : files && files?.includes("pdf") ? (
                          <Grid item xs={12}>
                            <Item>
                              <Box className={subs.maindisplay}>
                                <Typography
                                  variant="h5"
                                  className={subs.useNameFront1}
                                >
                                  {capitalizeFirstLetter(
                                    sessionData && sessionData?.title
                                  )}

                                </Typography>
                                &nbsp;
                                <LightTooltip title="Download File">
                                  <Button onClick={() => download("pdf")}>
                                    <FileDownloadOutlinedIcon
                                      className={courseStyle.filedownloadcss}
                                    />
                                  </Button>
                                </LightTooltip>
                              </Box>
                              <Typography
                                variant="subtitle2"
                                className={courseStyle.fontCS}
                              >
                                {capitalizeFirstLetter(
                                  sessionData &&
                                  sessionData?.description?.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  )
                                )}
                              </Typography>
                            </Item>
                          </Grid>
                        ) : files && files?.includes("txt") ? (
                          <Grid item xs={12}>
                            <Item>
                              <Box className={subs.maindisplay}>
                                <Typography
                                  variant="h5"
                                  className={subs.useNameFront1}
                                >
                                  {capitalizeFirstLetter(
                                    sessionData && sessionData?.title
                                  )}
                                </Typography>
                                &nbsp;
                                <LightTooltip title="Download File">
                                  <Button onClick={() => download("txt")}>
                                    <FileDownloadOutlinedIcon
                                      className={courseStyle.filedownloadcss}
                                    />
                                  </Button>
                                </LightTooltip>
                              </Box>
                              <Typography
                                variant="subtitle2"
                                className={courseStyle.fontCS}
                              >
                                {capitalizeFirstLetter(
                                  sessionData &&
                                  sessionData?.description?.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  )
                                )}
                              </Typography>
                            </Item>
                          </Grid>
                        ) : (files && files?.includes("jpeg")) ||
                          (files && files?.includes("jpg")) ||
                          (files && files?.includes("png")) ||
                          (files && files?.includes("gif")) ? (
                          <Grid item xs={12}>
                            <Item>
                              <Box sx={{ display: "flex", background: '#ebebeb', width: '100%', justifyContent: "space-between", }}>
                                <Typography
                                  variant="body1"
                                  className={subs.useNameFront2}
                                >
                                  Course -  {(sessionData && capitalizeFirstLetter(sessionData?.title))}
                                </Typography>

                                <Box >
                                  &nbsp;
                                  <LightTooltip title="Download Image">
                                    <Button
                                      className={courseStyle.hoverbtn}
                                      onClick={() => download("image")}
                                    >
                                      <FileDownloadOutlinedIcon
                                        className={courseStyle.filedownloadcss}
                                      />
                                    </Button>
                                  </LightTooltip>
                                </Box>

                                <Box className='test1' sx={{ display: { xs: "flex", md: "none" } }}>
                                  <IconButton
                                    size="large"
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                  >
                                    <MenuIcon
                                      onClick={() => {
                                        toggle();
                                      }}
                                    />
                                  </IconButton>
                                </Box>

                              </Box>
                              <Image
                                className={courseStyle.imagecss}
                                alt="image"
                                src={`${BASE_URL}/${files}`}
                                width={300}
                                height={300}

                              />
                              {sessionData?.is_live_session == 1 ? <>
                                <Card>
                                  <CardContent>
                                    <Typography sx={{ color: "#e8661b", fontSize: "18px", }} variant="body1" >
                                      Live Session <LiveTvIcon sx={{ margin: '0px -3px -4px 10px' }} />
                                    </Typography>
                                    {new Date() > new Date(sessionData?.live_end_date) ?
                                      <Grid item xs={12}>
                                        <Grid item xs={12} sx={{ display: 'flex' }}>
                                          <CalendarMonthIcon sx={{ fontSize: '22px' }} />
                                          <Typography variant="body2" fontSize="15px" sx={{ marginLeft: "20px" }}>
                                            {moment(sessionData?.live_date).format('LLL')}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex' }}>
                                          <QueryBuilderIcon sx={{ fontSize: "22px", marginTop: '5px' }} />
                                          <Typography variant="body2" fontSize="15px" sx={{ padding: "6px 0px", marginLeft: "20px" }}>
                                            Session has been ended
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      :
                                      <Grid container spacing={2}>
                                        <Grid item xs={8} >
                                          <Grid >
                                            <Grid item xs={12} sx={{ display: 'flex' }}>
                                              <CalendarMonthIcon sx={{ fontSize: '22px' }} />
                                              <Typography variant="body2" fontSize="15px" sx={{ marginLeft: "20px" }}>
                                                {moment(sessionData?.live_date).format('LLL')}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: 'flex' }}>
                                              <QueryBuilderIcon sx={{ fontSize: '22px', marginTop: '5px' }} />
                                              <Typography variant="body2" fontSize="15px" sx={{ padding: '6px 0px', marginLeft: "20px" }}>
                                                {new Date(sessionData?.live_date) > new Date() ? (
                                                  <Countdown date={sessionData?.live_date} renderer={renderer} />
                                                ) : (
                                                  'Session has been started'
                                                )}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                          {new Date(sessionData?.live_date) > new Date() ? (
                                            <Button variant="outlined" size="large" className={courseStyle.backbtncs12} disabled>
                                              Join
                                            </Button>
                                          ) : (
                                            <Button
                                              size="large"
                                              variant="contained"
                                              className={courseStyle.backbtncs12}
                                              id={styles.muibuttonBackgroundColor}
                                              onClick={handleLiveSession}
                                            >
                                              Join
                                            </Button>
                                          )}
                                        </Grid>
                                      </Grid>}
                                  </CardContent>
                                </Card>
                              </> : ''}

                              <Typography
                                variant="body2"
                                className={courseStyle.fontCSS2}
                              >
                                {capitalizeFirstLetter(
                                  sessionData &&
                                  sessionData?.description?.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  )
                                )}
                              </Typography>
                            </Item>
                          </Grid>
                        ) : !files ? (
                          <Fragment>
                            <Box sx={{ display: "flex", background: '#ebebeb', justifyContent: "space-between", }}>
                              <Typography
                                variant="body1"
                                className={subs.useNameFront2}
                              >
                                {capitalizeFirstLetter(
                                  couseData && couseData?.title
                                )}
                              </Typography>
                              <Box className='test1' sx={{ display: { xs: "flex", md: "none" }, padding: '10px 0 0 0' }}>
                                <IconButton
                                  size="large"
                                  aria-label="show more"
                                  aria-controls={mobileMenuId}
                                  aria-haspopup="true"
                                  onClick={handleMobileMenuOpen}
                                  color="inherit"
                                >
                                  <MenuIcon
                                    onClick={() => {
                                      toggle();
                                    }}
                                  />
                                </IconButton>
                              </Box>

                            </Box>
                            <br />
                            <Typography
                              variant="subtitle2"
                              className={subs.fontCSS1}
                            >
                              {capitalizeFirstLetter(
                                (couseData &&
                                  couseData?.long_description?.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  )) ||
                                (couseData &&
                                  couseData?.short_description?.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  ))
                              )}
                            </Typography>
                          </Fragment>
                        ) : (
                          ""
                        )}
                        {files && (
                          <Box className={courseStyle.backcss}>
                            {fileViewComplete && fileViewComplete ? (
                              <Button
                                type="submit"
                                size="large"
                                variant="outlined"
                                className={courseStyle.backbtncs12}
                                disabled
                              >
                                Mark as complete
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                className={courseStyle.backbtncs12}
                                onClick={handleMarkAsComplete}
                                id={styles.muibuttonBackgroundColor}
                              >
                                Mark as complete
                              </Button>
                            )}
                          </Box>
                        )}
                      </Item>
                    </Grid>

                    {renderMobileMenu}
                    <Grid item sx={{ display: { xs: "none", sm: "none", md: "flex", lg: 'flex', xl: 'flex' } }}>
                      <Box className={subs.maindiv}>
                        <Typography variant="h5" className={subs.useNameFront2}>
                          Course Curriculum
                        </Typography>
                        <Box sx={{ width: "92%" }}>
                          <LinearProgressWithLabel
                            value={
                              calculate && calculate !== null ? calculate : 0
                            }
                          />
                        </Box>
                        <br />
                        {couseData &&
                          couseData?.modules?.map(
                            (item: any, index: number) => {
                              const numberConversion: any =
                                viewhistoryLengthManage[index]?.module_id ===
                                  item.id
                                  ? viewhistoryLengthManage[index]?.viewPercent
                                  : viewhistoryLengthManage[index]?.viewPercent;

                              return (
                                <Accordion key={item?.id}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Box>
                                      <Typography
                                        className={courseStyle.typoTitle}
                                      >
                                        <MenuBookIcon
                                          className={subs.iconcss}
                                        />{" "}
                                        &nbsp;{" "}
                                        {capitalizeFirstLetter(item?.title)}
                                      </Typography>
                                      <Box
                                        sx={{ width: "60%", float: "right" }}
                                      >
                                        <LinearProgressWithLabel1
                                          value={
                                            moduleCheckIdManage &&
                                              moduleCheckIdManage.includes(
                                                item.id
                                              )
                                              ? (numberConversion /
                                                item?.sessions?.length) *
                                              100
                                              : 0
                                          }
                                        />
                                      </Box>
                                    </Box>
                                  </AccordionSummary>


                                  <AccordionDetails>
                                    {item?.sessions.map((itemData: any) => {
                                      const togglee =
                                        itemData?.id === activeToggle
                                          ? "active"
                                          : "";

                                      return (

                                        <Fragment key={itemData?.id}>
                                          <Box
                                            sx={{
                                              width: "100%",
                                              bgcolor: "background.paper",
                                            }}
                                          >
                                            <nav aria-label="main mailbox folders">
                                              <List>
                                                <ListItem disablePadding>
                                                  <ListItemButton
                                                    className={
                                                      togglee &&
                                                      courseStyle.backgroundClick
                                                    }
                                                    onClick={() =>
                                                      handlebtnClick(itemData)
                                                    }
                                                  >
                                                    {itemData.attachment && (
                                                      <Preview
                                                        name={
                                                          itemData.attachment
                                                        }
                                                        identifier="user"
                                                      />
                                                    )}
                                                    <Typography
                                                      variant="subtitle2"
                                                      className={
                                                        courseStyle.typolist
                                                      }
                                                    >
                                                      &nbsp;
                                                      {capitalizeFirstLetter(itemData?.title)}
                                                    </Typography>
                                                    <Box sx={{ color: '#d32f2f', marginLeft: 'auto' }} >
                                                      {(itemData?.live_end_date) < new Date() ? "" : <LiveTvIcon />}
                                                    </Box>
                                                  </ListItemButton>
                                                </ListItem>
                                              </List>
                                            </nav>
                                            <Divider />
                                          </Box>
                                        </Fragment>
                                      );
                                    })}
                                  </AccordionDetails>
                                </Accordion>
                              );
                            }
                          )}
                      </Box>
                    </Grid>
                    <br />
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box >
        </Box >
      </Box >
      <ToastContainer />
      <Footer />
    </>
  );
}

import * as React from "react";
import { Badge, Button, Container, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from "../styles/webview.module.css";
// import Carousel from "react-material-ui-carousel";
import LockIcon from "@mui/icons-material/Lock";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SchoolIcon from "@mui/icons-material/School";
import { HandleCourseGet } from "@/services/course";
import { TopEnrolledCourses } from "@/services/course_enroll";
import { CourseCard } from "@/common/ResuableCardCmp/coursescard";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function HomePage() {
  const [FreeCourses, setFreeCourses] = React.useState([]);
  const [PaidCourses, setPaidCourses] = React.useState([]);
  const [EnrolledCourses, setEnrolledCoursess] = React.useState([]);

  React.useEffect(() => {
    getAllCourseData();
    getTopEnrolledCourses();
  }, []);

  //get top enrolled courses
  const getTopEnrolledCourses = () => {
    TopEnrolledCourses().then((res) => {
      setEnrolledCoursess(res?.data);
    });
  };

  //get courses
  const getAllCourseData = () => {
    HandleCourseGet("", "").then((courses) => {
      setFreeCourses(
        courses?.data?.filter(
          (a: any) =>
            a?.course?.is_chargeable === "free" &&
            a?.course?.status === "active" &&
            a?.moduleCount.length > 0 &&
            a?.sessionCount.length > 0
        )
      );
      setPaidCourses(
        courses?.data?.filter(
          (a: any) =>
            a?.course?.is_chargeable === "paid" &&
            a?.course?.status === "active" &&
            a?.moduleCount.length > 0 &&
            a?.sessionCount.length > 0
        )
      );
    });
  };

  var items = [
    {
      heading: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      image:
        "https://www.skillsfuture.gov.sg/images/default-source/carousel/banner-img-3.png?Status=Master&sfvrsn=d474dd3d_0",
    },
    {
      heading: "Random Name #2",
      description: "Hello World!",
      image:
        "https://www.skillsfuture.gov.sg/images/default-source/carousel/student-initiatives-banner-img.png?Status=Master&sfvrsn=7f86b81f_0",
    },
    {
      heading: "Random Name #3",
      description: "Hello World!",
      image:
        "https://www.skillsfuture.gov.sg/images/default-source/carousel/banner-img-3.png?Status=Master&sfvrsn=d474dd3d_0",
    },
  ];

  function Item(props: any) {
    return (
      <Box className={styles.gridcols2}>
        <Box className={styles.griditem1}>
          <Typography className={styles.mainheading}>
            We Provide
            <Typography className={styles.span} component={"span"}>
              {" "}
              Smart
            </Typography>
          </Typography>
          <Typography className={styles.mainheading}>
            <Typography className={styles.span} component={"span"}>
              Solution{" "}
            </Typography>
            For Your
          </Typography>
          <Typography className={styles.mainheading}>
            Learning Skills
          </Typography>
          <Typography className={styles.infotext}>
            Build a beautiful, modern website with flexible components built
            from scratch. Build a beautiful, modern website with flexible
            components built modern website with flexible from scratch.
          </Typography>
          <Box className={styles.btnwrapper}>
            <Link href={"/courses"}>
              <Button className={styles.viewmorebtn}>View More</Button>
            </Link>
          </Box>
        </Box>
        <Box className={styles.griditem2}>
          <Box className={styles.teamimgwrapper}>
            <Box component="img" src={props?.item?.image} alt="team-img" />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {/*header*/}
      <WebViewNavbar />
      {/*Landing page carousel*/}
      <Box className={styles.landingpagecarousel}>
        <Container maxWidth="lg">
          {/* <Carousel
            autoPlay={true}
            animation="slide"
            // navButtonsAlwaysVisible={true}
            IndicatorIcon={<HorizontalRuleIcon />}
            indicatorIconButtonProps={{
              style: {
                padding: "15px",
                color: "black",
              },
            }}
            indicatorContainerProps={{
              style: {
                textAlign: "center",
                // position: "absolute",
                //zIndex: 999999,
                // right: "278px !important",
                // top: "350px !important"
              },
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: "#e8661b", // 2
              },
            }}
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel> */}

          <Carousel
            autoPlay={true}
            interval={3000}
            infiniteLoop={true}
            showArrows={false}
            showStatus={false}
            showThumbs={false}
          >
            {items?.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </Container>
      </Box>
      {/*how it works page*/}
      <Box className={styles.howitworks}>
        <Container maxWidth="lg">
          <Box className={styles.headerbox}>
            <Typography variant="h6" gutterBottom className={styles.h6}>
              How It Works ?
            </Typography>
            <Divider className={styles.divders} />
          </Box>
          <Box className={styles.iconarticles}>
            <Box>
              <Box className={styles.iconarticle1}>
                {/* <Badge badgeContent={1} color="warning"> */}
                <Box className={styles.iconarticle2}>
                  <Box className={styles.iconarticlewrapper}>
                    <Box className={styles.iconfigure}>
                      <LockIcon />
                    </Box>
                  </Box>
                </Box>
                {/* </Badge> */}
              </Box>
              <Typography className={styles.h2}>Sign Up</Typography>
            </Box>
            <Box>
              <Box className={styles.iconarticle1}>
                {/* <Badge badgeContent={2} color="warning"> */}
                <Box className={styles.iconarticle2}>
                  <Box className={styles.iconarticlewrapper}>
                    <Box className={styles.iconfigure}>
                      <SchoolIcon />
                    </Box>
                  </Box>
                </Box>
                {/* </Badge> */}
              </Box>
              <Typography className={styles.h2}>Select Courses</Typography>
            </Box>
            <Box>
              <Box className={styles.iconarticle1}>
                {/* <Badge badgeContent={3} color="warning"> */}
                <Box className={styles.iconarticle2}>
                  <Box className={styles.iconarticlewrapper}>
                    <Box className={styles.iconfigure}>
                      <LocalLibraryIcon />
                    </Box>
                  </Box>
                </Box>
                {/* </Badge> */}
              </Box>
              <Typography className={styles.h2}>Start Learning</Typography>
            </Box>
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
            {EnrolledCourses &&
              EnrolledCourses?.slice(0, 4)?.map((data, key) => {
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
            {FreeCourses?.slice(0, 4).map((data, key) => {
              return <CourseCard key={key} freecourses={data} />;
            })}
          </Box>
        </Container>
      </Box>

      {/*top paid course*/}
      <Box className={styles.freecourses}>
        <Container maxWidth="lg">
          <Box className={styles.headerbox}>
            <Typography variant="h6" gutterBottom className={styles.h6}>
              Top Paid Courses
            </Typography>
            <Divider className={styles.divder} />
          </Box>
          <Box className={styles.articles}>
            {PaidCourses?.slice(0, 4).map((data, key) => {
              return <CourseCard key={key} freecourses={data} />;
            })}
          </Box>
        </Container>
      </Box>
      <WebViewFooter />
    </>
  );
}

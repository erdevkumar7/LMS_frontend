import * as React from "react";
import {
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from "../styles/webview.module.css";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { HandleCourseGet } from "@/services/course";
import {
  CourseCard,
  CourseCardListView,
} from "@/common/ResuableCardCmp/coursescard";
import { usePagination } from "@/common/Pagination/paginations";
import Image from "next/image";

export default function Courses() {
  const [courseData, setcourseData] = React.useState([]);
  const [courseStatus, setcourseStatus] = React.useState(0);
  const [gridview, setgridview] = React.useState(true);
  const [color, setcolor] = React.useState(true);
  const [loader, setLoadar] = React.useState(true);
  const [dynamicCss, setDynamicCss] = React.useState<any>(1);
  const landingpagecontent = {
    image: "/Images/sideImages/couseBanner.png",
  };
  const setcustStatus = (e: any) => {
    setLoadar(true);
    if (page !== 1) {
      setPage(1);
      DATA.jump(1);
    }
    const is_chargeable = e === 2 ? "free" : e === 3 ? "paid" : 0;
    setcourseStatus(e);
    HandleCourseGet("", {
      is_chargeable: is_chargeable,
      status: "active",
    }).then((courses) => {
      setcourseData(courses?.data);
      setLoadar(false);
    });
  };
  //get courses
  const getAllCourseData = () => {
    setLoadar(true);
    HandleCourseGet("", "").then((courses) => {
      setcourseData(courses?.data?.reverse());
      setLoadar(false);
    });
  };
  React.useEffect(() => {
    getAllCourseData();
  }, []);
  //pagination
  const [row_per_page, set_row_per_page] = React.useState(12);
  let [page, setPage] = React.useState<any>(1);
  const startIndex = (page - 1) * row_per_page;
  const endIndex = Math.min(
    startIndex + row_per_page,
    courseData && courseData.length
  );
  function handlerowchange(e: any) {
    setPage(1);
    DATA.jump(1);
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(courseData?.length / PER_PAGE);
  const DATA = usePagination(courseData, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //gridview listview
  const gridView = () => {
    setgridview(true);
    setDynamicCss(1);
  };
  const listView = () => {
    setgridview(false);
    setDynamicCss(2);
  };
  return (
    <>
      {/*header*/}
      <WebViewNavbar />
      {/*Landing page carousel*/}
      <Box>
        <Container maxWidth={false} className={styles.imgwidthcss}>
          <Grid>
            <Image
              src="/Images/sideImages/courseBanner2.jpg"
              alt="image"
              width={100}
              height={300}
              className={styles.imagecssbanner}
            />
          </Grid>
        </Container>
      </Box>

      {/*courses*/}
      <Box className={styles.courses}>
        <Container maxWidth="lg">
          <Grid className={styles.filtersection}>
            <Grid spacing={2} className={styles.filtercontainer}>
              <Grid item xs={12} md={3} lg={3}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <Select
                      className={styles.filterinput}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      size="small"
                      onChange={(e: any) => setcustStatus(e.target.value)}
                      value={courseStatus}
                    >
                      <MenuItem value={0} disabled>
                        Filter By
                      </MenuItem>
                      <MenuItem value={1}>All</MenuItem>
                      <MenuItem value={2}>Free</MenuItem>
                      <MenuItem value={3}>Paid</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={3} className={styles.gridbtn}>
                <Stack spacing={1} className={styles.gridicon}>
                  <IconButton className={styles.actionview1} onClick={gridView}>
                    <GridViewIcon
                      className={
                        dynamicCss === 1 ? styles.gridColor : styles.iconColor
                      }
                    />
                  </IconButton>
                  <IconButton className={styles.actionview2} onClick={listView}>
                    <FormatListBulletedIcon
                      className={
                        dynamicCss === 2 ? styles.gridColor : styles.iconColor
                      }
                    />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Box className={styles.coursesheaderbox}>
            <Typography variant="h6" gutterBottom className={styles.h6}>
              Courses Information
            </Typography>
            <Divider className={styles.divder} />
          </Box>
          {gridview ? (
            <Box className={styles.articles}>
              {courseData &&
                DATA.currentData() &&
                DATA.currentData().map((data: any, key: any) => {
                  return <CourseCard key={key} coursedata={data} />;
                })}
            </Box>
          ) : (
            <Box className={styles.listviewarticles}>
              <Container maxWidth="lg">
                {courseData &&
                  DATA.currentData() &&
                  DATA.currentData().map((data: any, key: any) => {
                    return <CourseCardListView key={key} coursedata={data} />;
                  })}
              </Container>
            </Box>
          )}
          <Grid className={styles.filtersection} pb={6} pt={3}>
            <Grid spacing={2} className={styles.filtercontainer}>
              <Grid item xs={12} md={3} lg={3}>
                <Stack spacing={1}>
                  <Pagination
                    className="pagination"
                    count={count}
                    page={page}
                    color="primary"
                    onChange={handlePageChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={3} className={styles.perpagedt}>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{ margin: "auto" }}
                  >
                    Showing {endIndex} of {courseData && courseData?.length}{" "}
                    Results
                  </Typography>
                  <FormControl>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={12}
                      onChange={handlerowchange}
                      size="small"
                      className={styles.paignation}
                      style={{ height: "35px", marginRight: "11px" }}
                      sx={{ margin: "0px 0px 0px 15px" }}
                    >
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={24}>24</MenuItem>
                      <MenuItem value={48}>48</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/*footer*/}
      <WebViewFooter />
    </>
  );
}

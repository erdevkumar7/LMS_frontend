import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styles from "../../../styles/sidebar.module.css";
import dashboardStyles from "../../../styles/dashboard.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HandleAdminDashboardContent } from "@/services/dashboard";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import Footer from "@/common/LayoutNavigations/footer";

const Dashboard = () => {

  const [dashboardContent , setDashboardContent]= useState<any>()
  const [isLoading , setIsLoading]= useState<boolean>(false)

  const getDashboardContent = () =>{

    HandleAdminDashboardContent().then((content:any) =>{
      setIsLoading(false)
      setDashboardContent(content.data);
    }).catch((error) =>{
      console.log(error)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    getDashboardContent()
  
  }, [])

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Dashboard"
            Text="DASHBOARD"
            Link="/dashboard"
          />

          {/* main content */}
        {!isLoading ? 
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Card>
                <CardContent className={dashboardStyles.quickstatText1}>
                  <Box className={dashboardStyles.quickstatBoxes} >
                    <Box>
                      <Typography className={dashboardStyles.quickstatText}>
                        Welcome Users
                      </Typography>
                      <Typography>{dashboardContent?.totalUsers}</Typography>
                    </Box>
                    <Box
                      component={"img"}
                      src="/Images/pages_icon/users.png"
                      width={"20%"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Card>
                <CardContent className={dashboardStyles.quickstatText2}>
                  <Box className={dashboardStyles.quickstatBoxes} >
                    <Box>
                      <Typography className={dashboardStyles.quickstatText}>
                        Courses
                      </Typography>
                      <Typography>{dashboardContent?.totalCourses}</Typography>
                    </Box>
                    <Box
                      component={"img"}
                      src="/Images/pages_icon/course.png"
                      width={"20%"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Card>
                <CardContent className={dashboardStyles.quickstatText3}>
                  <Box className={dashboardStyles.quickstatBoxes} >
                    <Box>
                      <Typography className={dashboardStyles.quickstatText}>
                        Earning
                      </Typography>
                      <Typography>{dashboardContent?.totalSubscriptionsPrice ? `$${dashboardContent?.totalSubscriptionsPrice}`:0}</Typography>
                    </Box>
                    <Box
                      component={"img"}
                      src="/Images/pages_icon/earning.png"
                      width={"20%"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Card>
                <CardContent className={dashboardStyles.quickstatText4}>
                  <Box className={dashboardStyles.quickstatBoxes}>
                    <Box>
                      <Typography className={dashboardStyles.quickstatText}>
                        Subscriptions
                      </Typography>
                      <Typography>{dashboardContent?.totalSubscriptions}</Typography>
                    </Box>
                    <Box
                      component={"img"}
                      src="/Images/pages_icon/sub.png"
                      width={"20%"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card>
                <CardHeader
                  title={<Typography component={'span'} className={dashboardStyles.tableColumnFont}>Today&apos;s Registered Users</Typography>
                 
                }
                  subheader={<Divider></Divider>}
                ></CardHeader>
                <CardContent>
                  <TableContainer component={Paper} className={dashboardContent && dashboardContent.todaysUsersData.length > 0 ? dashboardStyles.tableHeight: ''}>
                    <Table className={dashboardStyles.tableMinWidth} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={dashboardStyles.tableColumnFont}>Id</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Name</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Email</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Role</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { dashboardContent && dashboardContent.todaysUsersData.length > 0 ? dashboardContent?.todaysUsersData.map((user:any) =>(
                        <TableRow key={user.id}>
                          <TableCell align="left">{user.id}</TableCell>
                          <TableCell align="left">{capitalizeFirstLetter(user.first_name)} {capitalizeFirstLetter(user.last_name)}</TableCell>
                          <TableCell align="left">{user.email}</TableCell>
                          <TableCell align="left">{user.role === 1 ? 'Admin' : 'Learner'}</TableCell>
                        </TableRow>
                        )): <TableRow >
                        <TableCell align="center" colSpan={4}  className={dashboardStyles.tableColumnFont} >Record not found</TableCell>
                        </TableRow>}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card>
              <CardHeader
                  title={<Typography component={'span'} className={dashboardStyles.tableColumnFont}>Today&apos;s Subscriptions</Typography>
                  
                }
                  subheader={<Divider></Divider>}
                ></CardHeader>
                <CardContent>
                  <TableContainer component={Paper} className={dashboardContent && dashboardContent?.todaysSubscriptionData?.length > 0 ? dashboardStyles.tableHeight : ''}>
                    <Table className={dashboardStyles.tableMinWidth} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={dashboardStyles.tableColumnFont}>Id</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Name</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Description</TableCell>
                          <TableCell className={dashboardStyles.tableColumnFont}>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {dashboardContent && dashboardContent?.todaysSubscriptionData?.length > 0 ? dashboardContent?.todaysSubscriptionData?.map((subs:any) =>(
                        <TableRow key={subs.id}>
                          <TableCell align="left">{subs.id}</TableCell>
                          <TableCell align="left">{subs.name}</TableCell>
                          <TableCell align="left">{subs.description}</TableCell>
                          <TableCell align="left">${subs.price}</TableCell>
                        </TableRow>
                        )): <TableRow >
                        <TableCell align="center" colSpan={4}  className={dashboardStyles.tableColumnFont} >Record not found</TableCell>
                        </TableRow>}
                        
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>: <Card><CardContent><SpinnerProgress/></CardContent></Card>}
        </Box>
      </Box>
			<Footer />
    </>
  );
};

export default Dashboard;

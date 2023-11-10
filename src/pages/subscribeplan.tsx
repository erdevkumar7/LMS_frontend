import * as React from "react";
import { Container, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from "../styles/webview.module.css";
import { SubscribtionPanCard } from "@/common/ResuableCardCmp/coursescard";
import { GetAllSubsctionPlans } from "@/services/subscription";
import Image from "next/image";

export default function HomePage() {
  const [subsdata, setsubsdata] = React.useState([]);
  React.useEffect(() => {
    getSubscribtion();
  }, []);

  //get subscription
  const getSubscribtion = () => {
    GetAllSubsctionPlans().then((subscdata) => {
      setsubsdata(subscdata);
    });
  };

  return (
    <>
      {/*header*/}
      <WebViewNavbar />
      {/*subscribe plan*/}
      <Box>
        <Container maxWidth={false} className={styles.imgwidthcss}>
          <Grid>
            <Image
              src="/Images/sideImages/plan2.jpg"
              alt="image"
              width={100}
              height={300}
              className={styles.imagecssbanner}
            />
          </Grid>
        </Container>
      </Box>
      <Box className={styles.enrolledplan}>
        <Container maxWidth="lg">
          <Box className={styles.headerbox}>
            <Typography variant="h6" gutterBottom className={styles.h6}>
              Our Subscription plan
            </Typography>
            <Divider className={styles.divder} />
          </Box>
        </Container>
      </Box>
      <Box className={styles.freecourses} mt={5}>
        <Container maxWidth="lg">
          <Box>
            <Grid container spacing={2} justifyContent={"space-evenly"}>
              {subsdata && subsdata?.map((data, key) => {
                return <SubscribtionPanCard subsdata={data} key={key} />;
              })}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/*footer*/}
      <WebViewFooter />
    </>
  );
}

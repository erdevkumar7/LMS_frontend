import { Box, Grid } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import styles from "../../styles/login.module.css";
import { useEffect, useState } from "react";
import { HandleGetAllSiteGet, HandleSiteGetByID } from "@/services/site";
import Link from "next/link";

const AuthSidebar = () => {
  const [orgLogo, setOrgLogo] = useState<string>("");

  const handleGetSiteOptionsDataById = async () => {
    await HandleGetAllSiteGet()
      .then((res) => {
        const hasOLOrOFOrT = res.data.filter(
          (item: any) => item.key === "org_logo"
        );

        setOrgLogo(hasOLOrOFOrT && hasOLOrOFOrT[0]?.value);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleGetSiteOptionsDataById();
  }, []);

  return (
    <>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Link href="/">
          <Box
            component={"img"}
            src={
              orgLogo
                ? `https://api-mangoit-lms.mangoitsol.com/${orgLogo}`
                : "/Images/pages_icon/company_logo.png"
            }
            width={"210px"}
            height={"70px"}
            className={styles.loginSideLogo}
          />
        </Link>
        <Box
          component={"img"}
          src={"/Images/sideImages/Sign in-amico.svg"}
          className={styles.loginSideImage}
          height={"86vh"}
        />
      </Grid>
    </>
  );
};

export default AuthSidebar;

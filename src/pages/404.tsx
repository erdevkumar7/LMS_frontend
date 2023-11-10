// ** MUI Components
import { Button, Typography, Box } from "@mui/material";

// ** Demo Imports
import FooterIllustrations from "@/common/ServerPagesFooter/footerIllustrations";

// ** Next Imports
import { useRouter } from "next/navigation";

// ** Styled Components
import { BoxWrapper, Img } from "../lib/errorCodePagesDesign";
import styles from "../styles/errorCodePages.module.css";

const Error404 = () => {
  const router = useRouter();
  return (
    <Box className="content-center">
      <Box className={styles.mainBoxContainer}>
        <BoxWrapper marginTop="25px">
          <Typography variant="h1" className={styles.errorCodeTypography}>
            404
          </Typography>
          <Typography
            variant="h5"
            className={styles.errorCodeTypographyMessage}
          >
            Page Not Found ⚠️
          </Typography>
          <Typography variant="body2">
            We couldn&prime;t find the page you are looking for.
          </Typography>
        </BoxWrapper>
        <Img alt="error-illustration" src="/Images/error_pages/404.png" />
        <Button
          onClick={() => router.back()}
          variant="contained"
          className={styles.errorCodeBackButton}
        >
          Go Back
        </Button>
      </Box>
      <FooterIllustrations pageCode="404" />
    </Box>
  );
};

export default Error404;

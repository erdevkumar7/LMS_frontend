import { AppBar, Box, Container, Grid, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import styles from "../../styles/webviewHeaderFooter.module.css";
import Link from "next/link";


const WebViewFooter = () => {
    return (
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position="static" className={styles.appBarFooterCss}>
                <Container maxWidth="lg">
                    <Toolbar className={styles.appBarFooterToolbarCss}>
                        <Link href="/" >
                            <Box
                                component="img"
                                src="/Images/pages_icon/company_logo.png"
                                width={"180px"}
                                height={"50px"}
                                sx={{ display: { xs: "block", sm: "block" } }}
                                alt="Company logo"
                            />
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: "block", md: "flex" } }}>
                            <Typography
                                variant="body2"
                                className={styles.windowFullWidthNameAlignfooter}
                            >
                                Term & Conditions
                            </Typography>
                            <Typography
                                variant="body2"
                                className={styles.windowFullWidthNameAlignfooter}
                            >
                                Privacy Policy
                            </Typography>
                            <Typography
                                variant="body2"
                                className={styles.windowFullWidthNameAlignfooters}
                            >
                                @2023 LMS. All Right Reserved
                            </Typography>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>

        </Box>
    );
}

export default WebViewFooter;
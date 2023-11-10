import React from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from "../styles/payment.module.css";
import Link from "next/link";
export default function PaymentCancel() {
    return (
        <Box>
            <Box className={styles.content}>
                <Box className={styles.wrapper1}>
                    <Box className={styles.wrapper2}>
                        <Typography variant="h3" color={"error"}>
                            Payment failed due to some reason.
                        </Typography>
                        <Link href={"/"} >
                            <Button
                                className={styles.gohome}
                            >
                                go to home
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
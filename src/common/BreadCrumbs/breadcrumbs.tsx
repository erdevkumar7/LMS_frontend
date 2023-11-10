import Link from "next/link";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { breadcrumbsVariableTypes } from "@/types/breadcrumbs";
import { FRONTEND_BASE_URL } from "@/config/config";
import styles from "../../styles/login.module.css";
const BreadcrumbsHeading: FC<breadcrumbsVariableTypes> = (props): any => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Stack>
        <Stack spacing={3}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              key="1"
              color="inherit"
              href={
                props && props?.Link?.includes("user") ? `/user/dashboard` : `/admin/dashboard`
              }
              className={`${styles.breadcrumbsTextFirstandSecond}`}
              >
              {props.First}
            </Link>
            {props.Middle ? 
            <Link
              key="2"
              color="inherit"
              href={`/${props.Link}`}
              className={`${styles.breadcrumbsTextFirstandSecond}`}
            >
              {props.Middle}
            </Link>:
            ''}
            
            <Link
            key="2"
            color="inherit"
            href={'#'}
            className={`${styles.breadcrumbsTextLast}`}
            
          >
            {props.Current}
          </Link>
          </Breadcrumbs>
        </Stack>
        <Typography
          variant="h5"
          gutterBottom
          className={`${styles.breadcrumbsMainBoldText}`}
        >
          {props.Text}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default BreadcrumbsHeading;

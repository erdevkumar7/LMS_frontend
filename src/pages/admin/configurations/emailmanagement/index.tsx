import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import { Box } from "@mui/system";
import styles from "../../../../styles/sidebar.module.css";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { useRouter } from "next/router";
import { HandleEmailContentGetByID } from "@/services/email";
import { handleSortData } from "@/common/Sorting/sorting";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { emailmanagementType } from "@/types/siteType";
import emailStyles from "../../../../styles/allConfigurations.module.css";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface Column {
  id: "id" | "emailtype" | "emailfrom" | "emailsubject" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "emailtype", label: "E-MAIL TYPE", minWidth: 170 },
  { id: "emailfrom", label: "E-MAIL FROM", minWidth: 100 },
  { id: "emailsubject", label: "E-MAIL SUBJECT", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const EmailConfiguration = () => {
  const [rows, setRows] = useState<emailmanagementType | any>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const router = useRouter();

  const handleGetData = async () => {
    await HandleEmailContentGetByID()
      .then((res) => {
        setRows(res.data);
        setLoadingButton(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  const handleSort = (rowsData: any) => {
    const sortedData: any = handleSortData(rowsData);
    setRows(sortedData);
    setToggle(!toggle);
  };

  useEffect(() => {
    setLoadingButton(true);
    handleGetData();
  }, []);

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Email Management"
            Text="EMAIL"
            Link="admin/configurations/emailmanagement/"
          />

          {/* main content */}
          <Card>
            <CardContent>
              {!isLoadingButton ? (
                <>
                  <Box className={emailStyles.listEmailPageBox}>
                    <Typography className={emailStyles.allEmailCountStyle}>All Email ({rows?.length > 0 ? rows?.length : 0})</Typography>
                    <Button
                      variant="contained"
                      id={styles.muibuttonBackgroundColor}
                      onClick={() =>
                        router.push("/admin/configurations/emailmanagement/addemailcontent")
                      }
                    >
                      + Add New{" "}
                    </Button>
                  </Box>
                  <Paper>
                    <TableContainer
                      className={emailStyles.tableContainerMainClass}
                    >
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ top: 0, minWidth: column.minWidth }}
                                onClick={() => {
                                  column.label === "ID" ? handleSort(rows) : "";
                                }}
                                className={emailStyles.tableHeadingFontWeight}
                              >
                                {column.label === "ID" ? (
                                  <>
                                    {column.label}
                                    {toggle ? (
                                      <ArrowDownwardOutlinedIcon fontSize="small" />
                                    ) : (
                                      <ArrowUpwardOutlinedIcon fontSize="small" />
                                    )}
                                  </>
                                ) : (
                                  column.label
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows?.length > 0 ? (
                            rows.map((row: any) => {
                              // const statusColor = (row.status === "active" ? Sessions.activeClassColor : row.status === "inactive" ? Sessions.inactiveClassColor : Sessions.draftClassColor)
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id}
                                >
                                  <TableCell>{row.id}</TableCell>
                                  <TableCell>
                                    {capitalizeFirstLetter(row.emailtype)}
                                  </TableCell>
                                  <TableCell>
                                    {row.emailfrom}
                                  </TableCell>
                                  <TableCell>{row.emailsubject}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() =>
                                        router.push(
                                          `/admin/configurations/emailmanagement/emailcontentmanage/${row.id}`
                                        )
                                      }
                                      variant="outlined"
                                      color="success"
                                    >
                                      <ModeEditOutlineIcon />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5}>
                                {" "}
                                <Typography align="center">Record not Found</Typography>{" "}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </>
              ) : (
                <SpinnerProgress />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
			<Footer />
    </>
  );
};

export default EmailConfiguration;

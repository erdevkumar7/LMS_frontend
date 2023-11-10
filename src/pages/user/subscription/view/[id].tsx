// React Import
import React, { useState, useEffect, Fragment } from "react";

// MUI Import
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

// Helper Import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";

// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import courseStyle from "../../../../styles/course.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  HandleSubscriptionGetByID,
  HandleSubscriptionPayment,
  HandleSubscriptionUpdate,
} from "@/services/subscription";
import {
  CreateOrderForSubscription,
  HandleOrderGetByUserID,
} from "@/services/order";
import { GetTransactiondet } from "@/services/transaction";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
import moment from "moment";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

// CSS Import
import profiles from "../../../../styles/profile.module.css";
import styles from "../../../../styles/sidebar.module.css";
import subs from "../../../../styles/subscription.module.css";
import Link from "next/link";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";
import { AlertSubscriptionDialog } from "@/common/SubscriptionStatus/subscriptionManage";
import { handleSortData } from "@/common/Sorting/sorting";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { GetdateAfterOneMonth } from "@/common/commonfunctions/connonfun";
import { Dateformat } from "../../../../common/commonfunctions/connonfun";
import { useTheme } from "@mui/material/styles";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import {
  HandleDownloadInvoice,
  HandleDownloadReceipt,
} from "../../../../services/invoice_receipt";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";
interface Column {
  id:
    | "id"
    | "amount"
    | "date"
    | "transaction_id"
    | "payment_method"
    | "pay_of_month"
    | "action"
    | "status";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID", minWidth: 100 },
  { id: "amount", label: "AMOUNT", minWidth: 120 },
  { id: "date", label: "ORDER DATE", minWidth: 150 },
  { id: "pay_of_month", label: "PAY OF MONTH", minWidth: 150 },
  { id: "transaction_id", label: "TRX. ID", minWidth: 120 },
  { id: "payment_method", label: "PAY. METHOD", minWidth: 130 },
  { id: "status", label: "STATUS", minWidth: 120 },
  { id: "action", label: "ACTION", minWidth: 120 },
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const d = new Date();

export default function View() {
  const [rows, setRows] = useState<any>([]);
  const [subsData, setSubsdata] = useState<any>([]);
  const [trxdata, settrxdata] = useState<any>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [dialougeopen, setDialougeopenOpen] = useState(false);
  const [subsId, setSubId] = useState<any>();
  const [userId, setuserId] = useState<any>();
  const [spinner, setshowspinner] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let localData: any;
    var getId: any;

    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      getId = JSON.parse(localData);
    }
    setIsLoading(true);
    getSubsData();
    setuserId(getId?.id);
  }, []);

  const router = useRouter();
  const getSubsData = async () => {
    const id = router?.query?.id;
    if (id) {
      HandleSubscriptionGetByID(id).then((data) => {
        getAllCourseData(id);
        setSubsdata(data?.data);
        setIsLoading(false);
      });
    }
  };

  //pagination
  const [row_per_page, set_row_per_page] = React.useState(10);
  let [page, setPage] = React.useState<any>(1);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(rows?.length / PER_PAGE);
  const DATA = usePagination(rows, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //get all order
  const getAllCourseData = (id: any) => {
    HandleOrderGetByUserID(id).then((subs) => {
      setRows(subs?.data?.reverse());
      setIsLoading(false);
    });
  };

  //cancel subscription popup
  const cancelSubscription = (id: any) => {
    setOpen(!open);
    setSubId(id);
  };

  //subscription update
  const handleSubsUpdate = async () => {
    let reqData = {
      status: "canceled",
    };
    setOpen(false);
    setLoadingButton(true);
    await HandleSubscriptionUpdate(subsId, reqData)
      .then((res) => {
        setTimeout(() => {
          setToggle(!toggle);
          toast.success(`Subscription updated successfully`);
          router.push("/user/subscription");
          setLoadingButton(false);
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        setIsLoading(false);
        setLoadingButton(false);
      });
  };

  //acccept payment renew subscription
  const AcceptPayment = () => {
    setshowspinner(true);
    const reqData = {
      userId: userId,
      subscriptioId: subsData?.id,
    };
    CreateOrderForSubscription(reqData).then((result) => {
      if (result?.status === 201 && result?.data) {
        localStorage.setItem("orderId", result?.data?.id);
        const data = {
          productName: subsData?.name,
          amount: result?.data?.amount,
          quantity: 1,
        };
        HandleSubscriptionPayment(data).then((result) => {
          if (result) {
            setshowspinner(false);
            router.push(result);
          }
        });
      }
    });
  };

  //acept payment by order renew subscription or failed
  const AcceptPaymentByorder = (order_id: any, order_amount: any) => {
    setshowspinner(true);
    localStorage.setItem("orderId", order_id);
    const data = {
      productName: subsData?.name,
      amount: order_amount,
      quantity: 1,
    };
    HandleSubscriptionPayment(data).then((result) => {
      if (result) {
        setshowspinner(false);
        router.push(result);
      }
    });
  };

  //handle sort
  const handleSort = (rowsData: any) => {
    const sortData = handleSortData(rowsData);
    setRows(sortData);
    setToggle(!toggle);
  };

  //open dialouge box view popup
  const handleClickOpenDialouge = (item: any) => {
    setDialougeopenOpen(true);
    GetTransactiondet(item?.id).then((result) => {
      if (result) {
        settrxdata(result?.data);
      }
    });
  };

  const handleClose = () => {
    setDialougeopenOpen(false);
  };

  //download receipt
  const DownloadReceipt = (transactionid: any) => {
    const reqdata = {
      transactionId: transactionid,
    };
    HandleDownloadReceipt(reqdata).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customer-recerpt-${transactionid}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  //download invoice
  const DownloadInvoice = (orderid: any) => {
    const reqdata = {
      orderId: orderid,
    };
    HandleDownloadInvoice(reqdata).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customer-invoice-${orderid}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <Box className={subs.maindisplay}>
            <BreadcrumbsHeading
              First="Home"
              Current="Subscription View"
              Middle="Subscription"
              Text="VIEW"
              Link="user/subscription"
            />
            <Box className={courseStyle.backbtn}>
              <Link
                href="/user/subscription"
                style={{ textDecoration: "none" }}
              >
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  className={courseStyle.backbtncscourse}
                  id={styles.muibuttonBackgroundColor}
                >
                  <ArrowBackOutlinedIcon />
                  &nbsp;Back To List
                </Button>
              </Link>
            </Box>
          </Box>
          {/* main content */}
          <Card>
            {!isLoading ? (
              <CardContent>
                <Box className={profiles.userData}>
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription Name&nbsp;&nbsp;&emsp;&emsp;:
                    </Typography>
                    &emsp;
                    <Typography
                      variant="subtitle2"
                      className={subs.fontCSSsubsc}
                    >
                      {capitalizeFirstLetter(subsData && subsData?.name)}
                    </Typography>
                  </Box>
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription Amount &emsp; :
                    </Typography>
                    &emsp;
                    <Typography
                      variant="subtitle2"
                      className={subs.fontCSSsubsc}
                    >
                      ${subsData && subsData?.price}
                    </Typography>
                  </Box>
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription Status&nbsp;&emsp;&emsp;:
                    </Typography>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {subsData && subsData?.status === "active" ? (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "green",
                          padding: "3px",
                          fontWeight: "bold",
                        }}
                      >
                        {subsData?.status
                          ? capitalizeFirstLetter(subsData?.status)
                          : ""}
                      </Typography>
                    ) : subsData && subsData?.status === "inactive" ? (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          padding: "3px",
                          fontWeight: "bold",
                        }}
                      >
                        {subsData?.status
                          ? capitalizeFirstLetter(subsData?.status)
                          : ""}
                      </Typography>
                    ) : subsData && subsData?.status === "canceled" ? (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          padding: "3px",
                          fontWeight: "bold",
                        }}
                      >
                        {subsData?.status
                          ? capitalizeFirstLetter(subsData?.status)
                          : ""}
                      </Typography>
                    ) : (
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          padding: "3px",
                          fontWeight: "bold",
                        }}
                      >
                        {subsData?.status
                          ? capitalizeFirstLetter(subsData?.status)
                          : ""}
                      </Typography>
                    )}
                  </Box>
                  {subsData?.status === "inactive" ? (
                    <Box className={subs.maindisplay}>
                      <Typography
                        variant="subtitle1"
                        className={subs.useNameFront}
                      >
                        Payment Status &emsp;&emsp;&emsp;&emsp;:
                      </Typography>
                      &emsp;
                      <Typography
                        variant="subtitle2"
                        style={{
                          color: "red",
                          padding: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        Unpaid
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription date &emsp;&emsp;&emsp;:
                    </Typography>
                    &emsp;
                    <Typography
                      variant="subtitle2"
                      className={subs.fontCSSsubsc}
                    >
                      {subsData?.createdAt
                        ? moment(subsData?.createdAt).format("DD, MMM YYYY")
                        : ""}
                    </Typography>
                  </Box>
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription Type &nbsp;&nbsp;&emsp;&emsp; :
                    </Typography>
                    &emsp;
                    <Typography
                      variant="subtitle2"
                      className={subs.fontCSSsubsc}
                    >
                      {subsData?.duration_term
                        ? capitalizeFirstLetter(
                            subsData && subsData?.duration_term
                          )
                        : ""}
                    </Typography>
                  </Box>
                  <Box className={subs.maindisplay}>
                    <Typography
                      variant="subtitle1"
                      className={subs.useNameFront}
                    >
                      Subscription date &emsp;&emsp;&emsp;:
                    </Typography>
                    &emsp;
                    <Typography
                      variant="subtitle2"
                      className={subs.fontCSSsubsc}
                    >
                      {subsData?.createdAt
                        ? moment(subsData?.createdAt).format("DD, MMM YYYY")
                        : ""}
                    </Typography>
                  </Box>
                  {subsData?.start_date ? (
                    <Box className={subs.maindisplay}>
                      <Typography
                        variant="subtitle1"
                        className={subs.useNameFront}
                      >
                        Last Pay date&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;:
                      </Typography>
                      &emsp;
                      <Typography
                        variant="subtitle2"
                        className={subs.fontCSSsubsc}
                      >
                        {subsData?.start_date
                          ? moment(subsData?.start_date).format("DD, MMM YYYY")
                          : ""}
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}
                  {subsData?.start_date ? (
                    <Box className={subs.maindisplay}>
                      <Typography
                        variant="subtitle1"
                        className={subs.useNameFront}
                      >
                        Next pay date&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;:
                      </Typography>
                      &emsp;
                      <Typography
                        variant="subtitle2"
                        className={subs.fontCSSsubsc}
                      >
                        {subsData?.start_date
                          ? moment(
                              GetdateAfterOneMonth(subsData?.start_date)
                            ).format("DD, MMMM YYYY")
                          : ""}
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}
                  <Box sx={{ flexGrow: 1 }} mt={3}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={2} sm={4} md={11.8}>
                        {subsData?.status === "inactive" ? (
                          <Button
                            variant="contained"
                            endIcon={<CreditCardIcon />}
                            onClick={() =>
                              AcceptPaymentByorder(rows[0]?.id, rows[0]?.amount)
                            }
                            className={subs.paynowbbttnn}
                          >
                            Pay Now{" "}
                            {spinner === true ? (
                              <CircularProgress color="inherit" />
                            ) : (
                              ""
                            )}
                          </Button>
                        ) : (
                          ""
                        )}
                        {
                          // Dateformat(new Date()) > Dateformat(GetdateAfterOneMonth(subsData?.start_date)) ?
                          subsData?.status === "expired" ? (
                            <Button
                              variant="contained"
                              endIcon={<CreditCardIcon />}
                              onClick={AcceptPayment}
                            >
                              Renew Subscription{" "}
                              {spinner === true ? (
                                <CircularProgress color="inherit" />
                              ) : (
                                ""
                              )}
                            </Button>
                          ) : (
                            <>
                              {subsData?.status === "canceled" ? (
                                // <Link href="www.google.com">
                                <Fragment>
                                  <Box className={subs.maindisplay1}>
                                    <Typography
                                      variant="subtitle1"
                                      className={subs.useSubsCancell}
                                    >
                                      If you want to activate this subscription
                                    </Typography>
                                    &nbsp; &nbsp;
                                    <Link href="/subscribeplan">
                                      <Typography
                                        variant="subtitle1"
                                        className={subs.useSubsMessage}
                                      >
                                        Click here
                                      </Typography>
                                    </Link>
                                  </Box>
                                </Fragment>
                              ) : subsData.status === "inactive" ? (
                                ""
                              ) : (
                                // </Link>
                                <Box className={subs.btncss1}>
                                  {!isLoadingButton ? (
                                    <Button
                                      variant="contained"
                                      onClick={() =>
                                        cancelSubscription(subsData?.id)
                                      }
                                      id={styles.muibuttonBackgroundColor}
                                    >
                                      Cancel Subscription
                                    </Button>
                                  ) : (
                                    <LoadingButton
                                      loading={isLoadingButton}
                                      size="large"
                                      className={subs.subsbtn}
                                      variant="contained"
                                      disabled
                                    >
                                      <CircularProgressBar />
                                    </LoadingButton>
                                  )}
                                </Box>
                              )}
                            </>
                          )
                        }
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            ) : (
              <Card>
                <CardContent>
                  <SpinnerProgress />
                </CardContent>
              </Card>
            )}
          </Card>
          <br />
          <Card>
            {!isLoading ? (
              <CardContent>
                <Typography variant="h5" className={subs.headingcss}>
                  Orders Details
                </Typography>
                <Box className={profiles.userData}>
                  <Paper>
                    <TableContainer className={courseStyle.tableContainer}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ top: 0, minWidth: column.minWidth }}
                                className={courseStyle.tableHeadingForId}
                                onClick={() => {
                                  column.label === "ID" ? handleSort(rows) : "";
                                }}
                              >
                                {toggle ? (
                                  column.label === "ID" ? (
                                    <Typography
                                      className={courseStyle.tableHeadingForId}
                                    >
                                      ID{" "}
                                      <ArrowDownwardOutlinedIcon fontSize="small" />{" "}
                                    </Typography>
                                  ) : (
                                    column.label
                                  )
                                ) : column.label === "ID" ? (
                                  <Typography
                                    className={courseStyle.tableHeadingForId}
                                  >
                                    ID{" "}
                                    <ArrowUpwardOutlinedIcon fontSize="small" />{" "}
                                  </Typography>
                                ) : (
                                  column.label
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows && rows.length > 0 ? (
                            DATA.currentData() &&
                            DATA.currentData().map((row: any) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id}
                                >
                                  <TableCell>{row?.id}</TableCell>
                                  <TableCell>${subsData?.price}</TableCell>
                                  <TableCell>
                                    {moment(row?.createdAt).format(
                                      "DD MMM YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {monthNames[d.getMonth()]}
                                  </TableCell>
                                  <TableCell>
                                    {row?.transaction_id
                                      ? row?.transaction_id?.substring(0, 15) +
                                        "..."
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {row?.transaction_id
                                      ? capitalizeFirstLetter(
                                          row?.payment_type
                                            ? row?.payment_type
                                            : ""
                                        )
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {row?.status === "paid" ? (
                                      <Typography style={{ color: "green" }}>
                                        {capitalizeFirstLetter(
                                          row?.status ? row?.status : ""
                                        )}
                                      </Typography>
                                    ) : (
                                      <Typography style={{ color: "red" }}>
                                        {capitalizeFirstLetter(
                                          row?.status ? row?.status : ""
                                        )}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {row?.status !== "paid" ? (
                                      <Button
                                        id={courseStyle.viewIcon}
                                        className={courseStyle.editDeleteButton}
                                        variant="outlined"
                                        onClick={() =>
                                          AcceptPaymentByorder(
                                            row?.id,
                                            row?.amount
                                          )
                                        }
                                      >
                                        <b>Pay</b>
                                      </Button>
                                    ) : (
                                      <Button
                                        className={courseStyle.editDeleteButton}
                                        id={courseStyle.viewIcon}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                          handleClickOpenDialouge(row)
                                        }
                                      >
                                        <VisibilityIcon />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                sx={{ fontWeight: 600, textAlign: "center" }}
                              >
                                {" "}
                                Record not Found{" "}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <Stack
                        className={courseStyle.stackStyle}
                        direction="row"
                        alignItems="right"
                        justifyContent="space-between"
                      >
                        <Pagination
                          className="pagination"
                          count={count}
                          page={page}
                          color="primary"
                          onChange={handlePageChange}
                        />
                        <FormControl>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={10}
                            onChange={handlerowchange}
                            size="small"
                            style={{ height: "40px", marginRight: "11px" }}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </TableContainer>
                  </Paper>
                  <AlertSubscriptionDialog
                    open={open}
                    onClose={cancelSubscription}
                    onSubmit={handleSubsUpdate}
                    title={"Cancel Subscription"}
                    whatYouDelete="Cancel Subscription"
                  />
                </Box>
              </CardContent>
            ) : (
              <Card>
                <CardContent>
                  <SpinnerProgress />
                </CardContent>
              </Card>
            )}
          </Card>
        </Box>
        <Dialog
          fullScreen={fullScreen}
          open={dialougeopen}
          onClose={handleClose}
          fullWidth
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Subscription Order / Transaction Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: "repeat(1, 1fr)",
              }}
              mt={2}
            >
              <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Order Id&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  {trxdata?.order_id}
                </Typography>
              </Box>
              {/* <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Order date &nbsp; &nbsp;&emsp;&emsp;&emsp;&emsp; -
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  02 March 2023
                </Typography>
              </Box> */}
              <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Transaction Id&emsp; &emsp;&emsp; -
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  {trxdata?.transaction_id?.substring(0, 40)}
                </Typography>
              </Box>
              <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Trx. / Payment Date &nbsp;&nbsp; -
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  {moment(trxdata?.createdAt).format("DD, MMM YYYY")}
                </Typography>
              </Box>
              <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Transaction Amount &nbsp;&nbsp;-
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  ${trxdata?.trx_amount}
                </Typography>
              </Box>
              <Box className={subs.maindisplay}>
                <Typography variant="subtitle1" className={subs.useNameFront}>
                  Transaction Method &nbsp;&nbsp; -
                </Typography>
                &emsp;
                <Typography variant="subtitle2" className={subs.fontCSS}>
                  {trxdata?.payment_method}
                </Typography>
              </Box>
            </Box>
            <Box textAlign="center" mt={4} mb={2}>
              <Button
                variant="contained"
                startIcon={<CloudDownloadOutlinedIcon />}
                id={styles.muibuttonBackgroundColor}
                onClick={() => DownloadReceipt(trxdata?.id)}
              >
                DownLoad Receipt
              </Button>
              <Button
                variant="contained"
                id={styles.muibuttonBackgroundColor}
                sx={{ marginLeft: "20px" }}
                startIcon={<CloudDownloadOutlinedIcon />}
                onClick={() => DownloadInvoice(trxdata?.order_id)}
              >
                DownLoad Invoice
              </Button>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              autoFocus
              id={styles.muibuttonBackgroundColor}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
}

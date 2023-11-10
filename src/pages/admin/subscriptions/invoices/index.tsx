// React Import
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// MUI Import
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SearchOutlined } from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import { handleSortData } from "@/common/Sorting/sorting";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import Subscription from "../../../../styles/subscription.module.css";
import { ToastContainer } from "react-toastify";
// API Service
import { HandleInvoicesGet } from "@/services/subscription";
import { HandleDownloadInvoice } from "@/services/invoice_receipt";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

interface Column {
  id:
    | "id"
    | "username"
    | "subsname"
    | "price"
    | "status"
    | "paymenttype"
    | "transactionid"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "username", label: "USERNAME", minWidth: 190 },
  { id: "subsname", label: "SUBSCRIPTION NAME", minWidth: 190 },
  { id: "price", label: "PRICE", minWidth: 100 },
  { id: "status", label: "STATUS", minWidth: 100 },
  { id: "paymenttype", label: "PAYMENT METHOD", minWidth: 100 },
  { id: "transactionid", label: "TRANSACTION ID", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const Invoices = () => {
  const [rows, setRows] = useState<any>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [getFilter, setFilter] = useState<any>("all");
  const [loading, setLoading] = useState(false);

  //pagination
  const [row_per_page, set_row_per_page] = useState(10);
  let [page, setPage] = useState<any>(1);
  const startIndex = (page - 1) * row_per_page;
  const endIndex = Math.min(startIndex + row_per_page, rows && rows.length);
  function handlerowchange(e: any) {
    setPage(1);
    DATA.jump(1);
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(rows?.length / PER_PAGE);
  const DATA = usePagination(rows, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  const { handleSubmit, control, reset } = useForm();

  const resetFilterValue = () => {
    setFilter("all");
    reset({ status: "all" });
  };

  const handleSort = (rowsData: any) => {
    const sortData = handleSortData(rowsData);
    setRows(sortData);
    setToggle(!toggle);
  };

  const handleSearch = (e: any, identifier: any) => {
    setPage(1);

    if (page !== 1) {
      DATA.jump(1);
    }
    if (identifier === "reset") {
      getAllInvoiceData();
      setSearch(e);
    } else {
      setSearch(e.target.value);
      getAllInvoiceData(e.target.value);
    }
  };

  const getAllInvoiceData = (search: string = "", payload?: any) => {
    HandleInvoicesGet(search, payload)
      .then((subs: any) => {
        setRows(subs.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getAllInvoiceData();
  }, []);

  const onfiltersSubmit = (e: any) => {
    getAllInvoiceData("", e);
    setFilter("all");
  };

  //download invoice
  const DownloadInvoice = (orderid: any) => {
    console.log(orderid, "orderid");
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
          <BreadcrumbsHeading
            First="Home"
            Current="Subscriptions Invoice"
            Text="INVOICES"
            Link="/admin/subscriptions/allsubscription/"
          />

          {/* main content */}
          <Card>
            <CardContent>
              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                placeholder="Search by 'Username'"
                onChange={(e) => handleSearch(e, "")}
                sx={{ width: "20%" }}
                InputProps={{
                  endAdornment: !search ? (
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  ) : (
                    <IconButton onClick={(e) => handleSearch("", "reset")}>
                      {" "}
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
              />
              <Box className={Subscription.mainFilterBox}>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <Box>
                      <Button
                        className={Subscription.popStateFilterButton}
                        {...bindTrigger(popupState)}
                      >
                        <FilterAltOutlinedIcon />
                        Filter
                      </Button>
                      <Popover
                        {...bindPopover(popupState)}
                        style={{ width: "35% !important" }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <Box>
                          <Container
                            className="filter-box"
                            style={{ padding: "15px", width: "100%" }}
                          >
                            <Grid>
                              <Typography
                                variant="h5"
                                className={Subscription.filterBox}
                              >
                                Filter
                              </Typography>
                              <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit(onfiltersSubmit)}
                                className={Subscription.filterForm}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12} lg={12}>
                                    <InputLabel
                                      className={Subscription.statusInFilter}
                                    >
                                      Status
                                    </InputLabel>
                                    <Controller
                                      name="status"
                                      control={control}
                                      defaultValue={getFilter}
                                      render={({ field }) => (
                                        <FormControl fullWidth>
                                          <Select {...field} displayEmpty>
                                            <MenuItem value={"all"}>
                                              All
                                            </MenuItem>
                                            <MenuItem value={"paid"}>
                                              Paid
                                            </MenuItem>
                                            <MenuItem value={"unpaid"}>
                                              Unpaid
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} lg={12}>
                                    <Box className={Subscription.boxInFilter}>
                                      <Button
                                        id={styles.muibuttonBackgroundColor}
                                        size="medium"
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        onClick={resetFilterValue}
                                      >
                                        Reset
                                      </Button>
                                      <Button
                                        id={styles.muibuttonBackgroundColor}
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={
                                          Subscription.applyButtonInFiltter
                                        }
                                        onClick={popupState.close}
                                      >
                                        Apply
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Container>
                        </Box>
                      </Popover>
                    </Box>
                  )}
                </PopupState>
              </Box>
              {!loading ? (
                <Paper className={Subscription.papperForTable}>
                  <TableContainer className={Subscription.tableContainer}>
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
                              className={Subscription.tableHeadingForId}
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
                        {rows && rows.length > 0 ? (
                          DATA.currentData() &&
                          DATA.currentData().map((row: any) => {
                            const statusColor =
                              row.status === "paid"
                                ? Subscription.activeClassColor
                                : Subscription.inactiveClassColor;
                            return (
                              <TableRow hover key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                  {row?.user?.first_name && row?.user?.last_name
                                    ? `${capitalizeFirstLetter(
                                        row?.user?.first_name
                                      )} ${capitalizeFirstLetter(
                                        row?.user?.last_name
                                      )}`
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  {row?.subscription?.name
                                    ? capitalizeFirstLetter(
                                        row?.subscription?.name
                                      )
                                    : ""}
                                </TableCell>
                                <TableCell>${row?.amount}</TableCell>
                                <TableCell className={statusColor}>
                                  {capitalizeFirstLetter(row.status)}
                                </TableCell>
                                <TableCell>{row?.payment_type}</TableCell>
                                <TableCell>
                                  {row?.transaction_id?.slice(0, 20)}
                                  {row?.transaction_id ? "..." : ""}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className={Subscription.editDeleteButton}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => DownloadInvoice(row?.id)}
                                  >
                                    <FileDownloadOutlinedIcon />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns?.length}
                              className={Subscription.tableLastCell}
                              sx={{ fontWeight: 600 }}
                            >
                              {" "}
                              <Typography>Record not found</Typography>{" "}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Stack
                      className={Subscription.stackStyle}
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
                      <Box>
                        <Typography
                          component={"span"}
                          mr={2}
                          className="paginationShowinig"
                        >
                          Showing {endIndex} of {rows && rows.length} Results
                        </Typography>
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
                      </Box>
                    </Stack>
                  </TableContainer>
                </Paper>
              ) : (
                <SpinnerProgress />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer/>
      <ToastContainer />
    </>
  );
};

export default Invoices;

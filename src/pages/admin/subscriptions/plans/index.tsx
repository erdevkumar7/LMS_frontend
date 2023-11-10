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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
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
import {
  DeleteSubscriptionPlan,
  GetAllSubsctionPlans,
  HandleInvoicesGet,
} from "@/services/subscription";
import { useRouter } from "next/router";
import { AlertDialog } from "@/common/DeleteListRow/deleteRow";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

interface Column {
  id:
    | "id"
    | "title"
    | "price"
    | "durationTerm"
    | "durationValue"
    | "created_by"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "TITLE", minWidth: 140 },
  { id: "price", label: "PRICE", minWidth: 140 },
  { id: "durationTerm", label: "DURATION TERM", minWidth: 160 },
  { id: "durationValue", label: "DURATION VALUE", minWidth: 160 },
  { id: "created_by", label: "CREATED_BY", minWidth: 140 },
  { id: "action", label: "ACTION", minWidth: 90 },
];

const SubscriptionPlans = () => {
  const [rows, setRows] = useState<any>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleClickOpen = (row: any) => {
    setDeleteRow(row);
    setOpen(!open);
  };
  // to delete a row
  const handleDeletesRow = () => {
    DeleteSubscriptionPlan(deleteRow.id, deleteRow.title).then((newRows) => {
      setRows(newRows.data);
      getAllSubscriptionPlanData();
    });
    setOpen(!open);
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
      getAllSubscriptionPlanData();
      setSearch(e);
    } else {
      setSearch(e.target.value);
      getAllSubscriptionPlanData(e.target.value);
    }
  };

  const getAllSubscriptionPlanData = (search: string = "") => {
    GetAllSubsctionPlans(search)
      .then((subs: any) => {
        setLoading(false);
        setRows(subs);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getAllSubscriptionPlanData();
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
            Current="Subscriptions Plans"
            Text="SUBSCRIPTION PLANS"
          />

          {/* main content */}
          <Card>
            <CardContent>
              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                placeholder="Search by 'Title'"
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
                &nbsp;
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push(
                      "/admin/subscriptions/plans/addsubscriptionplan"
                    )
                  }
                  id={styles.muibuttonBackgroundColor}
                >
                  {" "}
                  + Add Subscription Plan
                </Button>
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
                            return (
                              <TableRow hover key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.title)}{" "}
                                </TableCell>
                                <TableCell>${row.amount}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.duration_term)}{" "}
                                </TableCell>
                                <TableCell>{row.duration_value}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.user?.first_name)}{" "}
                                  {capitalizeFirstLetter(row?.user?.last_name)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/subscriptions/plans/updatesubscriptionplan/${row.id}`
                                      )
                                    }
                                    variant="outlined"
                                    color="success"
                                    className={Subscription.editDeleteButton}
                                  >
                                    <ModeEditOutlineIcon />
                                  </Button>
                                  <Button
                                    className={Subscription.editDeleteButton}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleClickOpen(row)}
                                  >
                                    <DeleteOutlineIcon />
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
              <AlertDialog
                open={open}
                onClose={handleClickOpen}
                onSubmit={handleDeletesRow}
                title={deleteRow.title}
                whatYouDelete="Subscription Plan"
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer/>
      <ToastContainer />
    </>
  );
};

export default SubscriptionPlans;

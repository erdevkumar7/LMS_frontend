import * as React from "react";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// CSS Import
import styles from "../../../styles/sidebar.module.css";
import courseStyle from "../../../styles/course.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import {
  HandleSubscriptionGetByUserID,
  HandleSearchSubsGet,
} from "@/services/subscription";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
import { handleSortData } from "@/common/Sorting/sorting";
import { SearchOutlined } from "@mui/icons-material";
import moment from "moment";
import { GetdateAfterOneMonth } from "@/common/commonfunctions/connonfun";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface Column {
  id:
    | "id"
    | "name"
    | "amount"
    | "subsc_date"
    | "next_pay_date"
    | "status"
    | "action"
    | "type"
    | "last_pay_date";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
const columns: Column[] = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "name", label: "NAME", minWidth: 50 },
  { id: "type", label: "TYPE", minWidth: 50 },
  { id: "amount", label: "AMOUNT", minWidth: 100 },
  { id: "subsc_date", label: " SUBS. DATE", minWidth: 100 },
  { id: "last_pay_date", label: "LAST PAY DATE", minWidth: 100 },
  { id: "next_pay_date", label: "NEXT PAY DATE", minWidth: 100 },
  { id: "status", label: "STATUS", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const Subscription = () => {
  const [rows, setRows] = React.useState<any>([]);
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState("");
  const [userId, setUserId] = React.useState<any>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  //pagination
  const [row_per_page, set_row_per_page] = React.useState(10);
  let [page, setPage] = React.useState<any>(1);
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

  const handleClickOpen = (id: any) => {
    router.push(`/user/subscription/view/${id}`);
  };

  React.useEffect(() => {
    let localData: any;
    let getId: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      getId = JSON.parse(localData);
    }
    setIsLoading(true);
    setUserId(getId);
    getAllCourseData(getId);
  }, []);

  //handle sort table
  const handleSort = (rowsData: any) => {
    const sortData = handleSortData(rowsData);
    setRows(sortData);
    setToggle(!toggle);
  };

  //handle serch
  const handleSearch = (e: any, identifier: any) => {
    setPage(1);
    if (page !== 1) {
      DATA.jump(1);
    }
    if (identifier === "reset") {
      HandleSubscriptionGetByUserID(userId?.id).then((subs) => {
        setRows(subs.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      if (search === "") {
        setSearch("");
        HandleSubscriptionGetByUserID(userId?.id).then((subs) => {
          setRows(subs.data);
        });
      } else {
        setSearch(e.target.value);
        HandleSearchSubsGet(search, userId?.id).then((itemSeached) => {
          setRows(itemSeached.data);
        });
      }
    }
  };

  //get subscription det
  const getAllCourseData = (data: any) => {
    HandleSubscriptionGetByUserID(data?.id).then((subs) => {
      setRows(subs?.data?.reverse());
      setIsLoading(false);
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
            Current="Subscription"
            Text="SUBSCRIPTION"
            Link="/user/subscription"
          />

          {/* main content */}
          {!isLoading ? (
            <Card>
              <CardContent>
                <TextField
                  id="standard-search"
                  value={search}
                  variant="outlined"
                  placeholder="Search by 'Name'"
                  size="small"
                  onChange={(e: any) => handleSearch(e, "")}
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
                              onClick={() => {
                                column.label === "ID" ? handleSort(rows) : "";
                              }}
                              className={courseStyle.tableHeadingForId}
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
                                <TableCell>
                                  {capitalizeFirstLetter(row?.name)}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.duration_term)}
                                </TableCell>
                                <TableCell>${row?.price}</TableCell>
                                <TableCell>
                                  {moment(row?.createdAt).format(
                                    "DD, MMMM YYYY"
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {row?.start_date
                                    ? moment(row?.start_date).format(
                                        "DD, MMMM YYYY"
                                      )
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  {row?.start_date
                                    ? moment(
                                        GetdateAfterOneMonth(row?.start_date)
                                      ).format("DD, MMMM YYYY")
                                    : ""}
                                </TableCell>
                                {row?.status === "active" ? (
                                  <TableCell>
                                    <Typography style={{ color: "green" }}>
                                      {capitalizeFirstLetter(row?.status)}
                                    </Typography>
                                  </TableCell>
                                ) : row?.status === "inactive" ? (
                                  <TableCell style={{ color: "red" }}>
                                    {capitalizeFirstLetter(row?.status)}
                                  </TableCell>
                                ) : row?.status === "canceled" ? (
                                  <TableCell style={{ color: "red" }}>
                                    {capitalizeFirstLetter(row?.status)}
                                  </TableCell>
                                ) : (
                                  <TableCell style={{ color: "red" }}>
                                    {capitalizeFirstLetter(row?.status)}
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Button
                                    className={courseStyle.editDeleteButton}
                                    id={courseStyle.viewIcon}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleClickOpen(row?.id)}
                                  >
                                    <VisibilityIcon />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={12}
                              sx={{ fontWeight: 600, textAlign: "center" }}
                            >
                              {" "}
                              Record not found{" "}
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <SpinnerProgress />
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Subscription;

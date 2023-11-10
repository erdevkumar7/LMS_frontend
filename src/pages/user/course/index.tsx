import React, { useEffect, useState } from "react";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
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
// CSS Import
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../../styles/sidebar.module.css";
import courseStyle from "../../../styles/course.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";

import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";
import { SearchOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { HandleCourseGetByUserId } from "@/services/course_enroll";

import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
import { Controller, useForm } from "react-hook-form";
import { handleSortData } from "@/common/Sorting/sorting";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface Column {
  id:
    | "id"
    | "title"
    | "module"
    | "session"
    | "is_chargeable"
    | "percent"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "NAME", minWidth: 170 },
  { id: "module", label: "NO. OF MODULE", minWidth: 100 },
  { id: "session", label: "NO. OF SESSION", minWidth: 100 },
  { id: "is_chargeable", label: "TYPE", minWidth: 100 },
  { id: "percent", label: "COMPLETE (%)", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const AllCourses = () => {
  const [rows, setRows] = useState<any>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [getFilter, setFilter] = useState<number>(0);
  const [filterObject, setFilterObject] = useState<any>("");
  const [userId, getUserId] = useState<any>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getAllCourseData();
  }, [router]);

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
    router.push(`/user/course/detail/${row}`);
    setOpen(!open);
  };

  const handleSort = (rowsData: any) => {
    const sortData = handleSortData(rowsData);
    setRows(sortData);
    setToggle(!toggle);
  };

  const handleSearch = (e: any, identifier: any) => {
    const search = e?.target?.value;
    setPage(1);

    if (page !== 1) {
      DATA.jump(1);
    }
    if (identifier === "reset") {
      getAllCourseData();
      setSearch(e);
    } else if (search !== null) {
      setSearch(e.target.value);
      HandleCourseGetByUserId(userId, search).then((courses) => {
        setRows(courses.data);
      });
    } else {
      HandleCourseGetByUserId(userId).then((courses) => {
        setRows(courses.data);
      });
    }
  };

  const getAllCourseData = () => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }

    if (localData) {
      const userIds = JSON.parse(localData);
      HandleCourseGetByUserId(userIds?.id).then((courses) => {
        setRows(courses.data);
      });
      getUserId(userIds?.id);
    }
    setIsLoading(false);
  };
  // console.log(rows, 'rrrrrrrrrrrrrrrrrr')
  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Courses"
            Text="COURSES"
            Link="/user/course"
          />

          {/* main content */}
          <Card>
            {!isLoading ? (
              <CardContent>
                <TextField
                  id="standard-search"
                  value={search}
                  variant="outlined"
                  placeholder="Search by 'Name'"
                  onChange={(e) => handleSearch(e, "")}
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
                              style={{
                                top: 0,
                                minWidth: column.minWidth,
                                fontWeight: "600",
                              }}
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
                            const statusColor =
                              row?.course?.course?.status === "active"
                                ? courseStyle.activeClassColor
                                : row?.course?.course?.status === "inactive"
                                ? courseStyle.inactiveClassColor
                                : courseStyle.draftClassColor;

                            const obj = row?.courseIdCounts;
                            const key = row?.course?.course?.id;
                            const value = obj[key];
                            const sessionValue =
                              row?.sessionCount[0]?.sessionCount;
                            let calculate = (value / sessionValue) * 100;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row?.course?.course?.id}
                              >
                                <TableCell>{row?.course?.course?.id}</TableCell>
                                <TableCell>
                               {/* { row?.course?.course?.id} */}
                                  {capitalizeFirstLetter(
                                    row?.course?.course?.title
                                  )}
                                </TableCell>
                                <TableCell>
                                  {row?.moduleCount?.length !== 0
                                    ? row?.moduleCount[0]?.moduleCount
                                    : 0}
                                </TableCell>
                                <TableCell>
                                  {row?.sessionCount?.length !== 0
                                    ? row?.sessionCount[0]?.sessionCount
                                    : 0}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(
                                    row?.course?.course_type
                                  )}
                                </TableCell>
                                <TableCell
                                //  className={statusColor}
                                >
                                  {`${
                                    calculate && calculate
                                      ? calculate?.toFixed(0)
                                      : 0
                                  }%`}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className={courseStyle.editDeleteButton}
                                    id={courseStyle.viewIcon}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() =>
                                      handleClickOpen(row?.course?.course?.id)
                                    }
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
                              colSpan={7}
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
            ) : (
              <Card>
                <CardContent>
                  <SpinnerProgress />
                </CardContent>
              </Card>
            )}
          </Card>
        </Box>
      </Box>
      <Footer/>
    </>
  );
};

export default AllCourses;

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
  OutlinedInput,
  Pagination,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// CSS Import
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../../../styles/sidebar.module.css";
import courseStyle from "../../../../styles/course.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SearchOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { HandleCourseDelete, HandleCourseGetadmin } from "@/services/course";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
import { AlertDialog } from "@/common/DeleteListRow/deleteRow";
import { Controller, useForm } from "react-hook-form";
import { handleSortData } from "@/common/Sorting/sorting";
import { ToastContainer } from "react-toastify";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

interface Column {
  id:
    | "id"
    | "title"
    | "module"
    | "session"
    | "is_chargeable"
    | "status"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "COURSE NAME", minWidth: 170 },
  { id: "module", label: "NO. OF MODULE", minWidth: 100 },
  { id: "session", label: "NO. OF SESSION", minWidth: 100 },
  { id: "is_chargeable", label: "TYPE", minWidth: 100 },
  { id: "status", label: "STATUS", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const AllCourses = () => {
  const [rows, setRows] = React.useState<any>([]);
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState("");
  const [deleteRow, setDeleteRow] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [getFilter, setFilter] = React.useState<number>(0);
  const [filterObject, setFilterObject] = React.useState<any>("");
  const router = useRouter();
  //pagination
  const [row_per_page, set_row_per_page] = React.useState(10);
  let [page, setPage] = React.useState<any>(1);
  function handlerowchange(e: any) {
    setPage(1);
    DATA.jump(1);
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(rows?.length / PER_PAGE);
  const startIndex = (page - 1) * row_per_page;
  const endIndex = Math.min(startIndex + row_per_page, rows && rows.length);
  const DATA = usePagination(rows, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  const { handleSubmit, control, reset } = useForm();

  React.useEffect(() => {
    setLoading(true);
    getAllCourseData("", filterObject);
  }, []);

  const onSubmit = (event: any) => {
    HandleCourseGetadmin("", event).then((itemFiltered) => {
      setRows(itemFiltered.data);
      setFilterObject(event);
    });
  };

  const handleClickOpen = (row: any) => {
    setDeleteRow(row);
    setOpen(!open);
  };
  // to delete a row
  const handleDeletesRow = () => {
    HandleCourseDelete(deleteRow?.id, deleteRow?.title).then((deletedRow) => {
      HandleCourseGetadmin("", filterObject).then((newRows) => {
        setRows(newRows.data);
      });
    });
    setOpen(!open);
  };

  const resetFilterValue = () => {
    setFilter(0);
    reset({ is_chargeable: 0, status: 0 });
    getAllCourseData("", { is_chargeable: 0, status: 0 });
  };
  const handleSort = (rowsData: any) => {
    const sortData = handleSortData(rowsData);
    setRows(sortData);
    setToggle(!toggle);
  };

  // console.log(page,"page",count)
  const handleSearch = (e: any, identifier: any) => {
    setPage(1);
    if (page !== 1) {
      DATA.jump(1);
    }
    if (identifier === "reset") {
      getAllCourseData("", { is_chargeable: 0, status: 0 });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      getAllCourseData(search, filterObject);
    }
  };

  const getAllCourseData = (search: any, filterObject: any) => {
    HandleCourseGetadmin(search, filterObject)
      .then((courses) => {
        setLoading(false);
        setRows(courses.data);
      })
      .catch((err) => {
        setLoading(false);
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
            Current="Courses"
            Text="COURSES"
            Link="/admin/courses/allcourses"
          />

          {/* main content */}
          <Card>
            <CardContent>
              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                placeholder="Search by 'Course Name'"
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
              <Box className={courseStyle.upperFilterBox}>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <Box>
                      <Button
                        className={courseStyle.filterAltOutlinedIcon}
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
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Box>
                          <Container
                            className="filter-box"
                            style={{ padding: "15px" }}
                          >
                            <Grid>
                              <Typography
                                variant="h5"
                                className={courseStyle.filterTypography}
                              >
                                Filter
                              </Typography>
                              <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                              >
                                <Stack
                                  style={{ marginTop: "10px" }}
                                  className="form-filter"
                                >
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} lg={6}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="enddate"
                                          className={courseStyle.typeFreePaid}
                                        >
                                          Type
                                        </InputLabel>
                                        <Controller
                                          name="is_chargeable"
                                          control={control}
                                          defaultValue={getFilter}
                                          render={({ field }) => (
                                            <FormControl fullWidth>
                                              <Select {...field} displayEmpty>
                                                <MenuItem value={0}>
                                                  All
                                                </MenuItem>
                                                <MenuItem value={"free"}>
                                                  Free
                                                </MenuItem>
                                                <MenuItem value={"paid"}>
                                                  Paid
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          )}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="enddate"
                                          className={courseStyle.statusBold}
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
                                                <MenuItem value={0}>
                                                  All
                                                </MenuItem>
                                                <MenuItem value={"active"}>
                                                  Active
                                                </MenuItem>
                                                <MenuItem value={"inactive"}>
                                                  Inactive
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          )}
                                        />
                                      </Stack>
                                    </Grid>

                                    <Grid item xs={12} lg={12}>
                                      <Box className={courseStyle.boxInFilter}>
                                        <Button
                                          id={styles.muibuttonBackgroundColor}
                                          size="medium"
                                          variant="contained"
                                          color="primary"
                                          type="button"
                                          onClick={() => {
                                            resetFilterValue();
                                            popupState.close();
                                          }}
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
                                            courseStyle.applyButtonInFiltter
                                          }
                                          onClick={popupState.close}
                                        >
                                          Apply
                                        </Button>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Stack>
                              </Box>
                            </Grid>
                          </Container>
                        </Box>
                      </Popover>
                    </Box>
                  )}
                </PopupState>
                &nbsp;
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push("/admin/courses/allcourses/addcourse")
                  }
                  id={styles.muibuttonBackgroundColor}
                >
                  {" "}
                  + Add Course
                </Button>
              </Box>
              <Paper>
                <TableContainer className={courseStyle.tableContainer}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns?.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ top: 0, minWidth: column.minWidth }}
                            onClick={() => {
                              column.label === "ID" ? handleSort(rows) : "";
                            }}
                            className={courseStyle.tableHeadingForId}
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
                      {!loading ? (
                        rows && rows.length > 0 ? (
                          DATA.currentData() &&
                          DATA.currentData().map((row: any) => {
                            const statusColor =
                              row.course.status === "active"
                                ? courseStyle.activeClassColor
                                : row.course.status === "inactive"
                                ? courseStyle.inactiveClassColor
                                : courseStyle.draftClassColor;
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell>{row.course.id}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.course?.title)}
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
                                    row?.course?.is_chargeable.toString()
                                  )}
                                </TableCell>
                                <TableCell className={statusColor}>
                                  {capitalizeFirstLetter(row?.course?.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/courses/allcourses/updatecourse/${row.course.id}`
                                      )
                                    }
                                    variant="outlined"
                                    color="success"
                                    className={courseStyle.editDeleteButton}
                                  >
                                    <ModeEditOutlineIcon />
                                  </Button>
                                  <Button
                                    className={courseStyle.editDeleteButton}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleClickOpen(row?.course)}
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
                              colSpan={7}
                              className={courseStyle.tableLastCell}
                              sx={{ fontWeight: 600 }}
                            >
                              {" "}
                              Record not found{" "}
                            </TableCell>
                          </TableRow>
                        )
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className={courseStyle.tableLastCell}
                          >
                            <SpinnerProgress />{" "}
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
              <AlertDialog
                open={open}
                onClose={handleClickOpen}
                onSubmit={handleDeletesRow}
                title={deleteRow.title}
                whatYouDelete="Course"
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

export default AllCourses;

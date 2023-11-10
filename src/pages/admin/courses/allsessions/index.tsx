// React Import
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
// MUI Import
import {
  Autocomplete,
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import CloseIcon from "@mui/icons-material/Close";
// External Components
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import { handleSortData } from "@/common/Sorting/sorting";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { usePagination } from "@/common/Pagination/paginations";
//Type Import
import { sessionType } from "@/types/sessionType";
import { courseType } from "@/types/courseType";
import { moduleType } from "@/types/moduleType";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import Sessions from "../../../../styles/session.module.css";
import { ToastContainer } from "react-toastify";
// API Service
import { HandleSessionDelete, HandleSessionGet } from "@/services/session";
import { HandleCourseGet } from "@/services/course";
import { HandleModuleGet } from "@/services/module";
import { AlertDialog } from "@/common/DeleteListRow/deleteRow";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

interface Column {
  id: "id" | "title" | "course_id" | "module_id" | "is_deleted" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "SESSION NAME", minWidth: 170 },
  { id: "course_id", label: "COURSE NAME", minWidth: 100 },
  { id: "module_id", label: "MODULE NAME", minWidth: 100 },
  { id: "is_deleted", label: "STATUS", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const AllSession = () => {
  const [getCourse, setCourse] = React.useState<courseType | any>([]);
  const [getModule, setModule] = React.useState<moduleType | any>([]);
  const [rows, setRows] = React.useState<sessionType | any>([]);
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [getFilter, setFilter] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [deleteRow, setDeleteRow] = React.useState<sessionType | any>([]);
  const [value, setNewValue] = React.useState<any>({
    id: 0,
    title: "All",
  });
  const [inputValue, setInputValue] = React.useState<any>([]);
  const [mdvalue, setmdvalue] = React.useState<any>({
    id: 0,
    title: "All",
  });
  const [mdinputValue, setmdInputValue] = React.useState<any>([]);
  const router = useRouter();
  const { register, handleSubmit, control, reset } = useForm();

  //pagination
  const [row_per_page, set_row_per_page] = React.useState(10);
  let [page, setPage] = React.useState<any>(1);
  function handlerowchange(e: any) {
    setPage(1);
    DATA.jump(1);
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(rows.length / PER_PAGE);
  const startIndex = (page - 1) * row_per_page;
  const endIndex = Math.min(startIndex + row_per_page, rows && rows.length);
  const DATA = usePagination(rows, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };
  //useEffect
  React.useEffect(() => {
    setLoading(true);
    getSessionData();
    getModuleData();
    getCourseData();
  }, []);

  const getSessionData = () => {
    HandleSessionGet("", "").then((sessions) => {
      setLoading(false);
      setRows(sessions.data);
    });
  };

  const getModuleData = () => {
    HandleModuleGet("", "").then((moduleSearched) => {
      setLoading(false);
      setModule(moduleSearched.data);
    });
  };

  const getCourseData = () => {
    HandleCourseGet("", "").then((courseSearched) => {
      setLoading(false);
      setCourse(courseSearched.data);
    });
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
      HandleSessionGet("", "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      HandleSessionGet(search, "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
    }
  };

  const handleClickOpen = (row: any) => {
    setDeleteRow(row);
    setOpen(!open);
  };
  // to delete a row
  const handleDeletesRow = () => {
    HandleSessionDelete(deleteRow.id, deleteRow.title).then((deletedRow) => {
      HandleSessionGet("", "").then((newRows) => {
        setRows(newRows.data);
      });
    });
    setOpen(!open);
  };
  // submit for filter
  const onSubmit = (event: any) => {
    const filterData: any = {
      module_id: mdvalue?.id,
      course_id: value.id,
      status: event.status,
    };
    HandleSessionGet("", filterData).then((itemFiltered) => {
      setRows(itemFiltered.data);
    });
  };

  const resetFilterValue = () => {
    setFilter(0);
    setNewValue({
      id: 0,
      title: "All",
    });
    setmdvalue({
      id: 0,
      title: "All",
    });
    reset({ course: 0, module: 0, status: 0 });
    getSessionData();
  };

  const option: { id: number; title: string }[] = [{ id: 0, title: "All" }];
  getCourse &&
    getCourse.map((data: any, key: any) => {
      return option.push({
        id: data?.course?.id,
        title: data?.course?.title,
      });
    });

  const mdoption: { id: number; title: string }[] = [{ id: 0, title: "All" }];
  getModule &&
    getModule.map((data: any, key: any) => {
      return mdoption.push({
        id: data?.module?.id,
        title: data?.module?.title,
      });
    });
  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Session"
            Text="SESSION"
            Link="/admin/courses/allsessions"
          />

          {/* main content */}
          <Card>
            <CardContent>
              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                placeholder="Search by 'Session Name'"
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
              <Box className={Sessions.mainFilterBox}>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <Box>
                      <Button
                        className={Sessions.popStateFilterButton}
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
                            style={{ padding: "15px", width: "100%" }}
                          >
                            <Grid>
                              <Typography
                                variant="h5"
                                className={Sessions.filterBox}
                              >
                                Filter
                              </Typography>
                              <Box
                                component="form"
                                // noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                className={Sessions.filterForm}
                              >
                                <Stack
                                  style={{ marginTop: "10px" }}
                                  className="form-filter"
                                >
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4} lg={4}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="name"
                                          className={Sessions.courseInFilter}
                                        >
                                          Course
                                        </InputLabel>
                                        <Autocomplete
                                          value={value}
                                          inputValue={inputValue}
                                          onChange={(event, newValue) => {
                                            setNewValue(newValue);
                                          }}
                                          onInputChange={(
                                            event,
                                            newInputValue
                                          ) => {
                                            setInputValue(newInputValue);
                                          }}
                                          options={option}
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...register("course_id")}
                                              {...params}
                                              variant="outlined"
                                              placeholder="Search Course"
                                            />
                                          )}
                                        />
                                      </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={4} lg={4}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="name"
                                          className={Sessions.moduleInFilter}
                                        >
                                          Module
                                        </InputLabel>
                                        <Autocomplete
                                          id="combo-box-demo"
                                          value={mdvalue}
                                          inputValue={mdinputValue}
                                          options={mdoption}
                                          getOptionLabel={(mdoption: any) =>
                                            mdoption?.title
                                          }
                                          onChange={(event, newValue) => {
                                            setmdvalue(newValue);
                                          }}
                                          onInputChange={(
                                            event,
                                            newInputValue
                                          ) => {
                                            setmdInputValue(newInputValue);
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...register("module_id")}
                                              {...params}
                                              placeholder="Search for module"
                                            />
                                          )}
                                        />
                                      </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={4} lg={4}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="enddate"
                                          className={Sessions.statusInFilter}
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
                                      <Box className={Sessions.boxInFilter}>
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
                                            Sessions.applyButtonInFiltter
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
                    router.push("/admin/courses/allsessions/addsession")
                  }
                  id={styles.muibuttonBackgroundColor}
                >
                  {" "}
                  + Add Session
                </Button>
              </Box>
              <Paper className={Sessions.papperForTable}>
                <TableContainer className={Sessions.tableContainer}>
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
                            className={Sessions.tableHeadingForId}
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
                              row.status === "active"
                                ? Sessions.activeClassColor
                                : row.status === "inactive"
                                ? Sessions.inactiveClassColor
                                : Sessions.draftClassColor;
                            return (
                              <TableRow
                                hover
                                // role="checkbox"
                                // tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row.title)}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(
                                    row.course && row.course.title
                                  )}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(
                                    row.module && row.module.title
                                  )}
                                </TableCell>
                                <TableCell className={statusColor}>
                                  {capitalizeFirstLetter(row.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/courses/allsessions/updatesession/${row.id}`
                                      )
                                    }
                                    variant="outlined"
                                    color="success"
                                    className={Sessions.editDeleteButton}
                                  >
                                    <ModeEditOutlineIcon />
                                  </Button>
                                  <Button
                                    className={Sessions.editDeleteButton}
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
                              colSpan={7}
                              className={Sessions.tableLastCell}
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
                            colSpan={6}
                            className={Sessions.tableLastCell}
                          >
                            {" "}
                            <SpinnerProgress />{" "}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Stack
                    className={Sessions.stackStyle}
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
                whatYouDelete="Session"
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AllSession;
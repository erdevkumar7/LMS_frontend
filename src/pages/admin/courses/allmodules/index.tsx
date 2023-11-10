// React Import
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
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
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
// CSS Import
import styles from "../../../../styles/sidebar.module.css";
import ModulCss from "../../../../styles/modules.module.css";
import { ToastContainer } from "react-toastify";
// External Components
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { handleSortData } from "@/common/Sorting/sorting";
import { usePagination } from "@/common/Pagination/paginations";
import { AlertDialog } from "@/common/DeleteListRow/deleteRow";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Autocomplete from "@mui/material/Autocomplete";
// API Service
import { HandleCourseGet } from "@/services/course";
import { HandleModuleDelete, HandleModuleGet } from "@/services/module";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface Column {
  id: "id" | "title" | "course_id" | "module_id" | "is_deleted" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "MODULE NAME", minWidth: 170 },
  { id: "course_id", label: "COURSE NAME", minWidth: 100 },
  { id: "module_id", label: "NO.OF SESSION", minWidth: 100 },
  { id: "is_deleted", label: "STATUS", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const AllModules = () => {
  const [rows, setRows] = React.useState<any>([]);
  const [search, setSearch] = React.useState("");
  const [getCourse, setCourse] = React.useState<any>([]);
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [deleteRow, setDeleteRow] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [getFilter, setFilter] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [value, setNewValue] = React.useState<any>({
    id: 0,
    title: "All",
  });
  const [inputValue, setInputValue] = React.useState<any>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

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
  //useEffect
  React.useEffect(() => {
    setLoading(true);
    getModuleData();
    getCourseData();
  }, []);
  // get all modules
  const getModuleData = () => {
    HandleModuleGet("", "").then((modules) => {
      setLoading(false);
      setRows(modules.data);
    });
  };
  //get all courses
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
  //search modules
  const handleSearch = (e: any, identifier: any) => {
    setPage(1);

    if (page !== 1) {
      DATA.jump(1);
    }
    if (identifier === "reset") {
      HandleModuleGet("", "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      HandleModuleGet(search, "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
    }
  };

  const handleClickOpen = (row: any) => {
    setDeleteRow(row);
    setOpen(!open);
  };

  const handleDeletesRow = () => {
    HandleModuleDelete(deleteRow.id, deleteRow.title).then((deletedRow) => {
      HandleModuleGet("", "").then((newRows) => {
        setRows(newRows.data);
      });
    });
    setOpen(!open);
  };
  //submit form for filtering
  const onSubmit = (event: any) => {
    const filterData: any = {
      course_id: value?.id,
      status: event.status,
    };
    HandleModuleGet("", filterData).then((itemFiltered) => {
      setRows(itemFiltered.data);
    });
  };

  const resetFilterValue = () => {
    setFilter(0);
    setNewValue({
      id: 0,
      title: "All",
    });
    reset({ course: 0, status: 0 });
    getModuleData();
  };

  const option: { id: number; title: string }[] = [{ id: 0, title: "All" }];
  getCourse &&
    getCourse.map((data: any, key: any) => {
      return option.push({
        id: data?.course?.id,
        title: data?.course?.title,
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
            Current="Module"
            Text="MODULE"
            Link="/admin/courses/allmodules"
          />
          {/* main content */}
          <Card>
            <CardContent>
              <TextField
                id="standard-search"
                value={search}
                variant="outlined"
                placeholder="Search by 'Module Name'"
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
              <Box className={ModulCss.upperFilterBox}>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <Box>
                      <Button
                        className={ModulCss.filterAltOutlinedIcon}
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
                                className={ModulCss.filterTypography}
                              >
                                Filter
                              </Typography>
                              <Box
                                component="form"
                                method="POST"
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit(onSubmit)}
                                onReset={reset}
                              >
                                <Stack
                                  style={{ marginTop: "10px" }}
                                  className="form-filter"
                                >
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} lg={6}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="name"
                                          className={ModulCss.courseInFilter}
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
                                    <Grid item xs={12} md={6} lg={6}>
                                      <Stack spacing={2}>
                                        <InputLabel
                                          htmlFor="enddate"
                                          className={ModulCss.statusBold}
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
                                      <Box className={ModulCss.boxInFilter}>
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
                                            ModulCss.applyButtonInFiltter
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
                    router.push("/admin/courses/allmodules/addmodule")
                  }
                  id={styles.muibuttonBackgroundColor}
                >
                  {" "}
                  + Add Module{" "}
                </Button>
              </Box>
              <Paper>
                <TableContainer>
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
                            className={ModulCss.tableHeadingForId}
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
                              row.module.status === "active"
                                ? ModulCss.activeClassColor
                                : row.module.status === "inactive"
                                ? ModulCss.inactiveClassColor
                                : ModulCss.draftClassColor;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell>{row.module.id}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row.module.title)}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(
                                    row.module.course && row.module.course.title
                                  )}
                                </TableCell>
                                <TableCell>
                                  {row.sessionCount.sessionCount}
                                </TableCell>
                                <TableCell className={statusColor}>
                                  {capitalizeFirstLetter(row.module.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/courses/allmodules/updatemodule/${row.module.id}`
                                      )
                                    }
                                    variant="outlined"
                                    color="success"
                                    className={ModulCss.editDeleteButton}
                                  >
                                    <ModeEditOutlineIcon />
                                  </Button>
                                  <Button
                                    className={ModulCss.editDeleteButton}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleClickOpen(row.module)}
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
                              className={ModulCss.tableLastCell}
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
                            className={ModulCss.tableLastCell}
                          >
                            {" "}
                            <SpinnerProgress />{" "}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Stack
                    className={ModulCss.stackStyle}
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
                whatYouDelete="Module"
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

export default AllModules;

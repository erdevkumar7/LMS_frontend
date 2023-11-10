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
  TablePagination,
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
import styles from "../../../styles/sidebar.module.css";
import UserCss from "../../../styles/user.module.css";
import { ToastContainer } from "react-toastify";
// External Components
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { handleSortData } from "@/common/Sorting/sorting";
import { usePagination } from "@/common/Pagination/paginations";
import { AlertDialog } from "@/common/DeleteListRow/deleteRow";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
// API Service
import { HandleUserDelete, HandleUserGet } from "@/services/user";
import { HandleModuleDelete, HandleModuleGet } from "@/services/module";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";
import Footer from "@/common/LayoutNavigations/footer";

interface Column {
  id:
    | "id"
    | "first_name"
    | "last_name"
    | "email"
    | "role_id"
    | "status"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "first_name", label: "FIRST NAME", minWidth: 170 },
  { id: "last_name", label: "LAST NAME", minWidth: 100 },
  { id: "email", label: "EMAIL", minWidth: 100 },
  { id: "role_id", label: "USER ROLE", minWidth: 100 },
  { id: "status", label: "STATUS", minWidth: 100 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const AllUsers = () => {
  const [rows, setRows] = React.useState<any>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState("");
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [deleteRow, setDeleteRow] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [getFilter, setFilter] = React.useState<number>(0);
  const router = useRouter();
  const { handleSubmit, control, reset } = useForm();

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
  React.useEffect(() => {
    setLoading(true);
    getUsereData();
  }, []);

  const getUsereData = () => {
    HandleUserGet("", "").then((users) => {
      setRows(users.data);
      setLoading(false);
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
      HandleUserGet("", "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      HandleUserGet(search, "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
    }
  };

  const handleClickOpen = (row: any) => {
    setDeleteRow(row);
    setOpen(!open);
  };

  const handleDeletesRow = () => {
    HandleUserDelete(deleteRow.id).then((deletedRow) => {
      HandleUserGet("", "").then((newRows) => {
        setRows(newRows.data);
      });
    });
    setOpen(!open);
  };

  const onSubmit = (event: any) => {
    HandleUserGet("", event).then((itemFiltered) => {
      setRows(itemFiltered.data);
    });
  };

  const resetFilterValue = () => {
    setFilter(0);
    reset({ role_id: 0, status: 0 });
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
            Current="User"
            Text="USER"
            Link="/admin/users"
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
              <Box className={UserCss.upperFilterBox}>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <Box>
                      <Button
                        className={UserCss.filterAltOutlinedIcon}
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
                                className={UserCss.filterTypography}
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
                                          htmlFor="name"
                                          className={UserCss.courseInFilter}
                                        >
                                          Role
                                        </InputLabel>
                                        <Controller
                                          name="role_id"
                                          control={control}
                                          defaultValue={getFilter}
                                          render={({ field }) => (
                                            <FormControl fullWidth>
                                              <Select {...field} displayEmpty>
                                                <MenuItem value={0}>
                                                  All
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                  Admin
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                  Learner
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
                                          className={UserCss.statusBold}
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
                                      <Box className={UserCss.boxInFilter}>
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
                                            UserCss.applyButtonInFiltter
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
                  onClick={() => router.push("/admin/users/adduser")}
                  id={styles.muibuttonBackgroundColor}
                >
                  {" "}
                  + Add User{" "}
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
                            className={UserCss.tableHeadingForId}
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
                      {!isLoading ? (
                        rows && rows.length > 0 ? (
                          DATA.currentData() &&
                          DATA.currentData().map((row: any) => {
                            const statusColor =
                              row.status === "active"
                                ? UserCss.activeClassColor
                                : row.status === "inactive"
                                ? UserCss.inactiveClassColor
                                : UserCss.draftClassColor;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.first_name)}
                                </TableCell>
                                <TableCell>
                                  {capitalizeFirstLetter(row?.last_name)}
                                </TableCell>
                                <TableCell>{row?.email}</TableCell>
                                <TableCell>
                                  {row?.role_id == 1 ? "Admin" : "Learner"}
                                </TableCell>
                                <TableCell className={statusColor}>
                                  {capitalizeFirstLetter(row?.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/users/updateuser/${row.id}`
                                      )
                                    }
                                    variant="outlined"
                                    color="success"
                                    className={UserCss.editDeleteButton}
                                  >
                                    <ModeEditOutlineIcon />
                                  </Button>
                                  {/* {row?.role_id === 1 ? (
                                    <Button
                                      className={UserCss.editDeleteButton}
                                      variant="outlined"
                                      color="error"
                                      onClick={() => handleClickOpen(row)}
                                      disabled
                                    >
                                      <DeleteOutlineIcon />
                                    </Button>
                                  ) : ( */}
                                    <Button
                                      className={UserCss.editDeleteButton}
                                      variant="outlined"
                                      color="error"
                                      onClick={() => handleClickOpen(row)}
                                    >
                                      <DeleteOutlineIcon />
                                    </Button>
                                  {/* )} */}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className={UserCss.tableLastCell}
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
                            className={UserCss.tableLastCell}
                          >
                            {" "}
                            <SpinnerProgress />{" "}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Stack
                    className={UserCss.stackStyle}
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
                title={deleteRow.first_name}
                whatYouDelete="User"
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

export default AllUsers;

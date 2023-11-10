import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import SidebarStyles from "../../../../styles/sidebar.module.css";
import styles from "../../../../styles/course.module.css";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogTitleProps,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
// CSS Import
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import RichEditor from "@/common/RichTextEditor/textEditor";
import { Controller, useForm } from "react-hook-form";
import { courseType } from "@/types/courseType";
import { yupResolver } from "@hookform/resolvers/yup";
import { courseValidations } from "@/validation_schema/courseValidation";
import { HandleCourseCreate } from "@/services/course";
import { HandleAIText, HandleAILongText, aiBtnCss } from "@/services/text_AI";
import { useRouter } from "next/router";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Footer from "@/common/LayoutNavigations/footer";
import { HandleSiteGetByID } from "@/services/site";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other }: any = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const AddCourse = () => {
  const [shortDespcriptionContent, setShortDespcriptionContent] = useState("");
  const [despcriptionContent, setdespcriptionContent] = useState<any>("");
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const router: any = useRouter();
  const [imagefile, setImageFile] = useState<string | any>("");
  const [videofile, setVideoFile] = useState<string | any>("");
  const [openCourseTopicBox, setopenCourseTopicBox] = useState(false);
  const [openStudyMaterialBox, setopenStudyMaterialBox] = useState(false);
  const [rowsForCourseTopic, setrowsForCourseTopic] = useState<any>([{}]);
  const [rowsForCourseMaterial, setrowsForCourseMaterial] = useState<any>([{}]);
  const [title, setTitle] = useState("");
  const [aiLoader, setAiLoader] = useState<any>(false);
  const [aiLoader1, setAiLoader1] = useState<any>(false);
  const [siteKey, setSiteKey] = useState(false);
  const [secretKey, setSecretKey] = useState<any>("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    setError,
  } = useForm<courseType | any>({
    resolver: yupResolver(courseValidations),
  });

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    const user_id = JSON.parse(localData);
    HandleSiteGetData(user_id?.id);
  }, []);

  const handleContentChange = (value: string, identifier: string) => {
    if (identifier === "long_description") {
      if (value === "<p><br></p>") {
        setError(identifier, {
          message: "Long description is a required field",
        });
      } else {
        setError(identifier, { message: "" });
        setValue(identifier, value);
      }
      setdespcriptionContent(value);
    } else if (identifier === "short_description") {
      if (value === "<p><br></p>") {
        setError(identifier, {
          message: "Short description is a required field",
        });
      } else {
        setError(identifier, { message: "" });
        setValue(identifier, value);
      }
      setShortDespcriptionContent(value);
    }
  };

  function ErrorShowing(errorMessage: any, identifier: string = "") {
    if (identifier === "long_description") {
      return (
        <Typography variant="body2" color={"error"} mt="67px" gutterBottom>
          {errorMessage}{" "}
        </Typography>
      );
    } else {
      return (
        <Typography variant="body2" color={"error"} gutterBottom>
          {errorMessage}{" "}
        </Typography>
      );
    }
  }

  const onSubmit = async (value: any) => {
    if (rowsForCourseTopic?.length > 1) {
      if (rowsForCourseMaterial.length > 1) {
        const reqData: any = {
          title: value?.title,
          is_chargeable: value?.is_chargeable,
          long_description: value?.long_description,
          short_description: value?.short_description,
          status: value?.status,
          duration: value?.courseduration,
          level: value?.courselevel,
          image: value?.imageattachments,
          video: value?.videoattachments,
          course_learning_topics: JSON.stringify(rowsForCourseTopic),
          Course_learning_material: JSON.stringify(rowsForCourseMaterial),
        };

        const formData = new FormData();
        for (var key in reqData) {
          formData.append(key, reqData[key]);
        }
        try {
          await HandleCourseCreate(formData);
          setTimeout(() => {
            router.push("/admin/courses/allcourses/");
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      } else {
        toast.error("Please add course study materials !");
      }
    } else {
      toast.error("Please add course learning topics !");
    }
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    if (e.target.name === "imageattachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageFile(file);
        setValue("imageattachments", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === "videoattachment") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setVideoFile(file);
        setValue("videoattachments", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  //course cover topic boxes
  const handleClickOpenCourseTopicBox = () => {
    setopenCourseTopicBox(true);
  };
  const handleCloseCourseTopicBox = () => {
    setopenCourseTopicBox(false);
  };
  //handle topics row add topic row
  const handleAddTopicRow = () => {
    const item = {};
    setrowsForCourseTopic([...rowsForCourseTopic, item]);
  };
  const ResetTopicRow = () => {
    setrowsForCourseTopic([]);
    function myFunction() {
      setrowsForCourseTopic([{}]);
    }
    setTimeout(myFunction, 100);
  };

  //update course topic
  const updateCourseState = (e: any) => {
    const tempRows = [...rowsForCourseTopic];
    const tempObj = rowsForCourseTopic[e.target.attributes.id.value];
    tempObj[e.target.attributes.id.value] = e.target.value;
    tempRows[e.target.attributes.id.value] = tempObj;
    setrowsForCourseTopic(tempRows);
  };
  //remove data from array
  const handleRemoveSpecificTopicRow = (idx: number) => {
    if (rowsForCourseTopic.length >= 2) {
      const tempRows = [...rowsForCourseTopic];
      tempRows.splice(idx, 1);
      setrowsForCourseTopic(tempRows);
    } else {
      //toast.error("Please add course topics !")
    }
  };
  const courseTopic = () => {
    if (
      (rowsForCourseTopic.length <= 1 && rowsForCourseTopic[0][0] === "") ||
      rowsForCourseTopic[0][0] === undefined
    ) {
      return toast.error("Please add course topics!");
    } else if (rowsForCourseTopic.length <= 4) {
      return toast.error("Please add atleast 5 topics!");
    } else {
      // for (var i = 0; i <= rowsForCourseTopic.length - 1; i++) {
      //   if (rowsForCourseTopic[i][i] === '' || rowsForCourseTopic[0][0] === undefined) {
      //     return toast.error("Input feild can't be blank!")
      //   }
      // }
      handleCloseCourseTopicBox();
    }
  };
  //study material boxes
  const handleClickOpenStudyMaterialBox = () => {
    setopenStudyMaterialBox(true);
  };
  const handleCloseStudyMaterialBox = () => {
    setopenStudyMaterialBox(false);
  };
  const handleAddCourseMaterialRow = () => {
    const item = {};
    setrowsForCourseMaterial([...rowsForCourseMaterial, item]);
  };
  const ResetMaterialRow = () => {
    setrowsForCourseMaterial([]);
    function myFunction() {
      setrowsForCourseMaterial([{}]);
    }
    setTimeout(myFunction, 100);
  };

  const updateMaterialState = (e: any) => {
    const tempRows = [...rowsForCourseMaterial];
    const tempObj = rowsForCourseMaterial[e.target.attributes.id.value];
    tempObj[e.target.attributes.id.value] = e.target.value;
    tempRows[e.target.attributes.id.value] = tempObj;
    setrowsForCourseMaterial(tempRows);
  };
  const handleRemoveSpecificMaterialRow = (idx: number) => {
    if (rowsForCourseMaterial.length >= 2) {
      const tempRows = [...rowsForCourseMaterial];
      tempRows.splice(idx, 1);
      setrowsForCourseMaterial(tempRows);
    } else {
      toast.error("Please add course material!");
    }
  };
  const courseMaterial = () => {
    if (
      (rowsForCourseMaterial.length <= 1 &&
        rowsForCourseMaterial[0][0] === "") ||
      rowsForCourseMaterial[0][0] === undefined
    ) {
      return toast.error("Please add course material !");
    } else if (rowsForCourseMaterial.length <= 4) {
      return toast.error("Please add atleast 5 materials!");
    } else {
      handleCloseStudyMaterialBox();
    }
  };

  //AI text
  const generateShortDescription = async () => {
    try {
      setAiLoader(true);
      await HandleAIText(title, secretKey).then((data) => {
        let shortDesc = data?.substring(0, 400);
        setShortDespcriptionContent(data);
        setAiLoader(false);
      });
    } catch (e) {
      setAiLoader(false);
      console.log(e);
    }
  };
  const generateLongDescription = async () => {
    try {
      setAiLoader1(true);
      await HandleAILongText(title, secretKey).then((data) => {
        let longDesc = data?.substring(0, 600);
        setdespcriptionContent(data);
        setAiLoader1(false);
      });
    } catch (e) {
      setAiLoader1(false);
      console.log(e);
    }
  };

  const HandleSiteGetData = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        const getSiteData = res.data.filter(
          (item: any) => item.key === "content_sk" && item.is_deleted === true
        );
        if (getSiteData?.length === 0) {
          setSiteKey(false);
        } else {
          setSiteKey(true);
          setSecretKey(getSiteData[0]?.value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      <Box className={SidebarStyles.combineContentAndSidebar}>
        <SideBar />
        <Box className={SidebarStyles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Courses"
            Current="Add Course"
            Text="COURSES"
            Link="admin/courses/allcourses"
          />
          {/* main content */}
          <Card>
            <CardContent>
              <Box
                component="form"
                method="POST"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                onReset={reset}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12} mt={1} mb={2}>
                    <Typography className={SidebarStyles.headingTitle}>
                      ADD COURSE
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Stack direction="row" spacing={2} mb={2} mt={1}>
                      <Button
                        variant="outlined"
                        id={styles.viewIcon}
                        size="small"
                        onClick={() => handleClickOpenCourseTopicBox()}
                        startIcon={<LocalLibraryIcon />}
                      >
                        Add Learning Topic
                      </Button>
                      <Button
                        variant="outlined"
                        id={styles.viewIcon}
                        size="small"
                        onClick={() => handleClickOpenStudyMaterialBox()}
                        startIcon={<PlaylistAddIcon />}
                      >
                        Add Study Material
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Course Name
                    </InputLabel>
                    <TextField
                      placeholder="Course Name"
                      {...register("title")}
                      fullWidth
                      onChange={(e: any) => setTitle(e.target.value)}
                    />
                    {errors && errors.title
                      ? ErrorShowing(errors?.title?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Type
                    </InputLabel>
                    <Controller
                      name="is_chargeable"
                      control={control}
                      defaultValue={"free"}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <Select {...field} displayEmpty>
                            <MenuItem value={"free"}>Free</MenuItem>
                            <MenuItem value={"paid"}>Paid</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors && errors.is_chargeable
                      ? ErrorShowing(errors?.is_chargeable?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Status
                    </InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue={"active"}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <Select {...field} displayEmpty>
                            <MenuItem value={"active"}>Active</MenuItem>
                            <MenuItem value={"inactive"}>In-active</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors && errors.status
                      ? ErrorShowing(errors?.status?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Course Duration
                    </InputLabel>
                    <Controller
                      name="courseduration"
                      control={control}
                      defaultValue={"three_months"}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <Select {...field} displayEmpty>
                            <MenuItem value={"three_months"}>3 Months</MenuItem>
                            <MenuItem value={"six_months"}>6 Months</MenuItem>
                            <MenuItem value={"twelve_months"}>
                              12 Months
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors && errors.status
                      ? ErrorShowing(errors?.status?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <InputLabel className={styles.InputLabelFont}>
                      Course Level
                    </InputLabel>
                    <Controller
                      name="courselevel"
                      control={control}
                      defaultValue={"basic"}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <Select {...field} displayEmpty>
                            <MenuItem value={"basic"}>Basic level</MenuItem>
                            <MenuItem value={"intermediate"}>
                              Intermediate level
                            </MenuItem>
                            <MenuItem value={"advanced"}>
                              Advance level
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors && errors.status
                      ? ErrorShowing(errors?.status?.message)
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Image
                    </InputLabel>
                    <Box className={styles.courseAttachmentBox}>
                      <InputLabel className={styles.subbox}>
                        <input
                          type="file"
                          {...register("imageattachment")}
                          onChange={handleChange}
                          hidden
                        />
                        <Typography className={styles.courseAttachments}>
                          {!imagefile.name ? "Upload" : imagefile.name}
                        </Typography>
                      </InputLabel>
                    </Box>
                    {imagefile
                      ? ""
                      : errors && errors.imageattachments
                      ? ErrorShowing(errors?.imageattachments?.message)
                      : ""}
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel className={styles.InputLabelFont}>
                      Introduction Video
                    </InputLabel>
                    <Box className={styles.courseAttachmentBox}>
                      <InputLabel className={styles.subbox}>
                        <input
                          type="file"
                          {...register("videoattachment")}
                          onChange={handleChange}
                          hidden
                        />
                        <Typography className={styles.courseAttachments}>
                          {!videofile.name ? "Upload" : videofile.name}
                        </Typography>
                      </InputLabel>
                    </Box>
                    {videofile
                      ? ""
                      : errors && errors.videoattachments
                      ? ErrorShowing(errors?.videoattachments?.message)
                      : ""}
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className={SidebarStyles.aiCss}>
                      <InputLabel className={styles.InputLabelFont}>
                        Short Description
                      </InputLabel>
                      {title && title !== null && siteKey === true ? (
                        <Button
                          variant="text"
                          className={SidebarStyles.aiButton}
                          onClick={generateShortDescription}
                        >
                          {aiLoader ? (
                            <AutorenewIcon sx={aiBtnCss} />
                          ) : (
                            <AutorenewIcon />
                          )}{" "}
                          &nbsp;Auto Generate
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box
                    // className={courseStyle.quillDescription1}
                    >
                      <RichEditor
                        {...register("short_description")}
                        value={shortDespcriptionContent}
                        onChange={(value) =>
                          handleContentChange(value, "short_description")
                        }
                      />
                    </Box>
                    {errors && errors.short_description
                      ? ErrorShowing(errors?.short_description?.message)
                      : ""}
                    {/* {getShortDespcriptionContent ? '' : errors && errors.description ? ErrorShowing(errors?.description?.message) : ""} */}
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className={SidebarStyles.aiCss}>
                      <InputLabel className={styles.InputLabelFont}>
                        Long Description
                      </InputLabel>
                      {title && title !== null && siteKey === true ? (
                        <Button
                          variant="text"
                          className={SidebarStyles.aiButton}
                          onClick={generateLongDescription}
                        >
                          {aiLoader1 ? (
                            <AutorenewIcon sx={aiBtnCss} />
                          ) : (
                            <AutorenewIcon />
                          )}{" "}
                          &nbsp;Auto Generate
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                    <RichEditor
                      {...register("long_description")}
                      value={despcriptionContent}
                      onChange={(value) =>
                        handleContentChange(value, "long_description")
                      }
                    />
                    {errors && errors.long_description
                      ? ErrorShowing(errors?.long_description?.message)
                      : ""}
                  </Grid>
                  {/* <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    textAlign={"right"}
                    className={
                      !errors?.long_description?.message
                        ? styles.addNewCourseButton
                        : styles.SubmitButton
                    }
                  >
                    <Button
                      className={styles.cancelButton}
                      variant="contained"
                      size="large"
                      onClick={() => router.push("/admin/courses/allcourses")}
                      id={SidebarStyles.muibuttonBackgroundColor}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      id={SidebarStyles.muibuttonBackgroundColor}
                    >
                      Submit
                    </Button>
                  </Grid> */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    textAlign={"right"}
                  >
                    <Button
                      className={styles.cancelButton}
                      variant="contained"
                      size="large"
                      onClick={() => router.push("/admin/courses/allcourses")}
                      id={SidebarStyles.muibuttonBackgroundColor}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      id={SidebarStyles.muibuttonBackgroundColor}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <ToastContainer />
      {/* dialouge box for add course covered topics */}
      <BootstrapDialog
        onClose={handleCloseCourseTopicBox}
        aria-labelledby="customized-dialog-title"
        open={openCourseTopicBox}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          //onClose={handleCloseCourseTopicBox}
          variant="h6"
          sx={{ fontWeight: "bold" }}
        >
          Add course topics what you&apos;ll covered in this course
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid item mb={2}>
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "end" }}
              spacing={2}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={ResetTopicRow}
                startIcon={<RestartAltOutlinedIcon />}
                className="btnglobal"
              >
                Reset
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddTopicRow}
                startIcon={<AddIcon />}
                className="btnglobal"
              >
                Add New
              </Button>
            </Stack>
            <Table sx={{ minHeight: "100px" }}>
              <TableHead>
                <TableRow>
                  <Stack direction="row">
                    <InputLabel
                      className={styles.InputLabelFont}
                      sx={{ marginBottom: "5px" }}
                    >
                      Topic Name
                    </InputLabel>
                  </Stack>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {rowsForCourseTopic &&
                    rowsForCourseTopic?.map((item: any, idx: any) => (
                      <Stack
                        key={idx}
                        direction="row"
                        spacing={2}
                        mb={1}
                        mt={1}
                      >
                        <TextField
                          id={idx}
                          value={item[idx]}
                          placeholder="Topic Name ...."
                          fullWidth
                          size="small"
                          onChange={(e) => updateCourseState(e)}
                        />
                        <Button
                          className="btnglobal1"
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveSpecificTopicRow(idx)}
                        >
                          <DeleteOutlineIcon />
                        </Button>
                      </Stack>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} mb={2} mt={1}>
            <Button
              type="button"
              size="large"
              variant="contained"
              onClick={handleCloseCourseTopicBox}
              id={styles.muibuttonBackgroundColor}
              className="btnglobal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="large"
              variant="contained"
              id={styles.muibuttonBackgroundColor}
              onClick={courseTopic}
              className="btnglobal"
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
      {/* dialouge box for add study material */}
      <BootstrapDialog
        onClose={handleCloseStudyMaterialBox}
        aria-labelledby="customized-dialog-title"
        open={openStudyMaterialBox}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          //onClose={handleCloseCourseTopicBox}
          variant="h6"
          sx={{ fontWeight: "bold" }}
        >
          Add study material what you&apos;ll provide in this course
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid item mb={2}>
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "end" }}
              spacing={2}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={ResetMaterialRow}
                startIcon={<RestartAltOutlinedIcon />}
                className="btnglobal"
              >
                Reset
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCourseMaterialRow}
                startIcon={<AddIcon />}
                className="btnglobal"
              >
                Add New{" "}
              </Button>
            </Stack>
            <Table sx={{ minHeight: "100px" }}>
              <TableHead>
                <TableRow>
                  <Stack direction="row">
                    <InputLabel
                      className={styles.InputLabelFont}
                      sx={{ marginBottom: "5px" }}
                    >
                      Material Name
                    </InputLabel>
                  </Stack>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {rowsForCourseMaterial.map((item: any, idx: any) => (
                    <Stack key={idx} direction="row" spacing={2} mb={1} mt={1}>
                      <TextField
                        id={idx}
                        value={item[idx]}
                        placeholder="Material Name ...."
                        fullWidth
                        size="small"
                        onChange={(e) => updateMaterialState(e)}
                      />
                    
                      <Button
                        className="btnglobal1"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveSpecificMaterialRow(idx)}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </Stack>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} mb={2} mt={1}>
            <Button
              type="button"
              size="large"
              variant="contained"
              onClick={handleCloseStudyMaterialBox}
              id={styles.muibuttonBackgroundColor}
              className="btnglobal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="large"
              variant="contained"
              id={styles.muibuttonBackgroundColor}
              onClick={courseMaterial}
              className="btnglobal"
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
      <Footer />
    </>
  );
};

export default AddCourse;

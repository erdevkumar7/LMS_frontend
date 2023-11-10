import * as Yup from "yup";

export const courseValidations = Yup.object().shape({
  title: Yup.string()
    .required("Course name is a required field")
    .min(3, "Course name must be at least 3 characters")
    .matches(/^[a-zA-Z].*/, "Course Name must be start with a letter"),
  status: Yup.string().required("Status is a required field"),
  is_chargeable: Yup.string().required("Type is a required field"),
  short_description: Yup.string()
    .required("Short description is a required field")
    .min(257, "Short description must be between 250 to 500 characters")
    .max(507, "Short description must be between 250 to 500 characters"),
  long_description: Yup.string()
    .required("Long description is a required field")
    .min(507, "Long description must be between 500 to 1000 characters")
    .max(1007, "Long description must be between 500 to 1000 characters"),
  imageattachments: Yup.mixed().required("Image attachment is a required field"),
  videoattachments: Yup.mixed().required("Video attachment is a required field"),
});

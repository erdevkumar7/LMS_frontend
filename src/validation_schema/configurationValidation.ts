import * as Yup from "yup";

const emailRules = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const siteConfigValidations = Yup.object().shape({
  org_title: Yup.string()
    .required("Organisation title is a required field")
    .matches(
      /^[A-Za-z- ]*$/,
      'Please enter valid organisation title Ex-"Mango-IT","XYZ"'
    ),
  org_logoo: Yup.mixed().required("Organisation logo is a required field"),
  org_favicoon: Yup.mixed().required(
    "Organisation favicon is a required field"
  ),
  content_sk: Yup.string()
    .required("Secret key is required field")
    .matches(/^sk-[0-9a-zA-Z]{24,}$/, "Invalid Secret API Key"),
});

export const stripeConfigValidations = Yup.object().shape({
  org_pk: Yup.string()
    .required("Publishable key is required field")
    .matches(/^pk_test_[0-9a-zA-Z]{24,}$/, "Invalid Publishable Key"),
  org_sk: Yup.string()
    .required("Secret key is required field")
    .matches(/^sk_test_[0-9a-zA-Z]{24,}$/, "Invalid Secret API Key"),
});

export const stripeZoomConfigValidations = Yup.object().shape({
  zoom_client_id: Yup.string()
    .required("Zoom Client Id is required field"),
    zoom_client_secret: Yup.string()
    .required("Zoom Secret key is required field")
});

export const genratorConfigValidations = Yup.object().shape({
  content_sk: Yup.string()
    .required("Secret key is required field")
    .matches(/^sk-[0-9a-zA-Z]{24,}$/, "Invalid Secret API Key"),
});
export const emailmanagementConfigValidations = Yup.object().shape({
  emailfrom: Yup.string()
    .required("From email is required field")
    .matches(emailRules, "Email must be a valid")
    .email("Email must be a valid"),
  emailtype: Yup.string().required("Email Type is required field"),
  emailsubject: Yup.string().required("Email Subject is required field"),
  // emailContent:
  // Yup.string().required('Email Content is required field')
});

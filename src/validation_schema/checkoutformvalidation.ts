import * as Yup from "yup";
const emailRules = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const numberrules = /^(0|[1-9]\d*)$/;
export const CheckoutformvalidationStep = Yup.object().shape({
  firstname: Yup.string()
    .required("First name field is required **")
    .min(3, "First name must be at least 3 characters **")
    .matches(/^[A-Za-z ]*$/, "Please enter valid name **"),
  lastname: Yup.string()
    .required("Last name field is required **")
    .min(3, "Last name must be at least 3 characters **")
    .matches(/^[A-Za-z ]*$/, "Please enter valid name **"),
  email: Yup.string()
    .required("Email is a required field **")
    .matches(emailRules, "Please Enter a valid email **")
    .email("Please Enter a valid email **"),
  number: Yup.string()
    .required("Number field is required **")
    .matches(numberrules, "Please Enter a valid number **")
    .min(10, "Number must be 10 digit **")
    .max(10, "Number must be 10 digit **"),
  // address1: Yup.string()
  //   .required("Address1 field is required **")
  //   .matches(/^[A-Za-z ]*$/, "Please enter valid address **"),
  city: Yup.string()
    .required("City field is required **")
    .matches(/^[A-Za-z ]*$/, "Please enter valid city **"),
  state: Yup.string()
    .required("State field is required **")
    .matches(/^[A-Za-z ]*$/, "Please enter valid state **"),
  country: Yup.string()
    .required("Country field is required **")
    .matches(/^[A-Za-z ]*$/, "Please enter valid Country **"),
  postalcode: Yup.string()
    .required("Postal Code field is required **")
    .matches(numberrules, "Please Enter a valid number **"),
});

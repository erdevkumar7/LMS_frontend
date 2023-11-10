import * as Yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[ -\/:-@\[-\`{-~]).{8,}$/;
const emailRules = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userRegisterValidations = Yup.object({
    first_name: 
        Yup.string().required('First name is a required field')
        .min(3,"First name must be at least 3 characters")
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    last_name: 
        Yup.string().required('Last name is a required field')
        .min(3,"Last name must be at least 3 characters")
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    email: 
        Yup.string().required('Email is a required field')
        .matches(emailRules,"Email must be a valid email")
        .email("Email must be a valid email"),
    password: 
        Yup.string().required('Password is a required field')
        .min(8,'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character')
        .matches(passwordRules, { message: "Password must have at least one of each: uppercase, lowercase, number and special character" }),
    confirm_password: 
        Yup.string().required('Confirm password is a required field')
        .min(8,'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character')
        .matches(passwordRules, { message: "Password must have at least one of each: uppercase, lowercase, number and special character" })
        .oneOf([Yup.ref("password"), ''], "Passwords must match")
        .required("Required"),
  });

export const userLoginValidations = Yup.object({
    email: 
        Yup.string().required('Email is a required field')
        .matches(emailRules,"Email must be a valid email")
        .email("Email must be a valid email"),
    password: 
        Yup.string().required('Password is a required field')
  });

  export const userForgotPasswordValidations = Yup.object({
    email: 
        Yup.string().required('Email is a required field')
        .matches(emailRules,"Email must be a valid email")
        .email("Email must be a valid email"),
  });

  export const userResetPasswordValidations = Yup.object({
    password: 
        Yup.string().required('New password is a required field')
        .min(8,'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character')
        .matches(passwordRules, { message: "Password must have at least one of each: uppercase, lowercase, number and special character" }),
    confirm_password: 
        Yup.string().required('Confirm password is a required field')
        .min(8,'Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character')
        .matches(passwordRules, { message: "Password must have at least one of each: uppercase, lowercase, number and special character" })
        .oneOf([Yup.ref("password"), ''], "Passwords must match")
        .required("Required"),
  });
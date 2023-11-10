import * as Yup from 'yup';

const emailRules = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userProfileValidations = Yup.object().shape({
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
});
import * as Yup from 'yup';

export const moduleValidations = Yup.object().shape({
    title:
        Yup.string().required('Module name is a required field')
            .min(3, " Module name must be at least 3 characters")
            .matches(/^[a-zA-Z].*/, "Module Name must be start with a letter"),
    course_id:
        Yup.string().required('Course is required field'),
    status:
        Yup.string().required('Status is required field'),
    description:
        Yup.string().required('Description is required field')
        .min(257,"Description must be between 250 to 500 characters")
        .max(507,"Deescription must be between 250 to 500 characters"),

});
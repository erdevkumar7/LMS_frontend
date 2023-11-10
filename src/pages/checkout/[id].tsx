import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WebViewNavbar from '@/common/LayoutNavigations/webviewnavbar';
import WebViewFooter from '@/common/LayoutNavigations/webviewfooter';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkoutformtype } from '@/types/checkoutformtype';
import { CheckoutformvalidationStep } from '@/validation_schema/checkoutformvalidation';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button, CircularProgress, Divider, InputLabel, OutlinedInput, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import styles from '../../styles/webview.module.css'
import { useForm } from 'react-hook-form';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { CreateUserSubsction, GetSubsctionsPlansDet, HandleSubscriptionPayment } from '@/services/subscription';
import { useRouter } from "next/router";
import { HandleLogin, HandleLogout, HandleRegister } from '@/services/auth';
import { GetUserByemail, HandleUpdateFirebaseId } from '@/services/user';
import { CreateOrder } from '@/services/order';
import { CreateFirebase } from '@/firebase/firebaseFunctions';
import axios from 'axios';
import { API } from '@/config/config';
const defaultTheme = createTheme();

export default function Checkout() {
    const router: any = useRouter();
    const { id } = router.query;
    const [subscriptionplandet, setsubscriptionplandet] = React.useState<any>([]);
    const [spinner, setshowspinner] = React.useState(false);

    React.useEffect(() => {
        if (router.isReady) {
            getSubscribtion(id);
            router.push(`/checkout/${id}`);
            let localData: any;
            if (typeof window !== "undefined") {
                localData = window.localStorage.getItem("userData");
            }
            if (localData) {
                const userData = JSON.parse(localData);
                setValue("firstname", userData?.first_name)
                setValue("lastname", userData?.last_name)
                setValue("email", userData?.email)
            }
        }
    }, [router.isReady]);

    //get subscription
    const getSubscribtion = (id: any) => {
        GetSubsctionsPlansDet(id).then((subscdata) => {
            setsubscriptionplandet(subscdata)
        })
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }, setError
    } = useForm<checkoutformtype | any>({
        resolver: yupResolver(CheckoutformvalidationStep),
    });
    const onSubmit = async (formvalue: any) => {
        setshowspinner(true);
        //user registration
        const reqData = {
            first_name: formvalue.firstname,
            last_name: formvalue.lastname,
            email: formvalue.email
        }
        userregister(reqData).then(res => {
            if (res === 201 || res === 400) {
                const reqData = {
                    email: formvalue.email,
                    identifier: "userautologinwithemail"
                };
                HandleLogin(reqData).then((res => {
                    localStorage.setItem("loginToken", res.data.loginToken);
                }))
                //get user det 
                GetUserByemail({ email: formvalue.email }).then((user) => {
                    if (user) {
                        //user auto login
                        localStorage.setItem(
                            "userData",
                            JSON.stringify(user)
                        );
                        //create subscription
                        const reqData = {
                            userId: user?.id,
                            name: subscriptionplandet?.title,
                            description: subscriptionplandet?.title,
                            price: subscriptionplandet?.amount,
                            duration_term: subscriptionplandet?.duration_term,
                            duration_value: subscriptionplandet?.duration_value,
                            status: "inactive"
                        }
                        //create subscription
                        CreateUserSubsction(reqData).then((subscription) => {
                            if (subscription) {
                                //create order 
                                const orderData = {
                                    user_id: user?.id,
                                    subscription_id: subscription?.id,
                                    payment_type: "Stripe",
                                    amount: subscriptionplandet?.amount,
                                    status: "unpaid",
                                    parent_order_id: 0,
                                    order_type: "subscription"
                                }
                                //create order
                                CreateOrder(orderData).then((order) => {
                                    if (order?.data) {
                                        localStorage.setItem("orderId", order?.data?.id)
                                        //create payment
                                        const data = {
                                            productName: subscriptionplandet?.title,
                                            amount: subscriptionplandet?.amount,
                                            quantity: 1
                                        };
                                        HandleSubscriptionPayment(data).then((result) => {
                                            router.push(result);
                                        })
                                    }
                                })
                            }
                        })
                    };
                })
            }

        });
    }

    const userregister = async (formvalue: any) => {
        return await HandleRegister(formvalue).then(async (res: any) => {
            if (res.status === 201) {
                const db_id = res?.data?.id;
                const email = res?.data?.email;
                const getFirebaseUser = await CreateFirebase(res?.data, db_id)
                const firebase_id = getFirebaseUser?.user?.uid
                axios({
                    method: "PUT",
                    url: `${API.userUpdateById}/${db_id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    data: { email: email, firebase_id: firebase_id, identifier: 'AUTOLOGIN' },
                }).catch(err => console.log(err));
                return 201
            } else {
                return 400
            }
        }).catch((err) => {
            console.log(err)
            HandleLogout();
        })
    }

    function ErrorShowing(errorMessage: any) {
        return (
            <Typography variant="body2" color={"error"} sx={{ fontSize: "12px" }} gutterBottom>
                {errorMessage}{" "}
            </Typography>
        );
    }

    return (
        <>
            {/*header*/}
            < WebViewNavbar />
            <ThemeProvider theme={defaultTheme}>
                <Container component="form" maxWidth="md" sx={{ mb: 4 }}
                    method="POST"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                    onReset={reset}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 1, md: 2, } }}>
                        <Typography component="h1" variant="h4" align="center" mb={2}>
                            Checkout
                        </Typography>
                        <Divider light />
                        <Grid container spacing={3} mt={1}>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="fname">
                                        First Name <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="First Name..."
                                        fullWidth
                                        size="small"
                                        {...register("firstname")}
                                    />
                                </Stack>
                                {errors && errors.firstname
                                    ? ErrorShowing(errors?.firstname?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lname">
                                        Last Name <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        id="name"
                                        placeholder="Last Name..."
                                        fullWidth
                                        size="small"
                                        {...register("lastname")}
                                    />
                                </Stack>
                                {errors && errors.lastname
                                    ? ErrorShowing(errors?.lastname?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email">
                                        Email  <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Email..."
                                        fullWidth
                                        size="small"
                                        {...register("email")}
                                    />
                                </Stack>
                                {errors && errors.email
                                    ? ErrorShowing(errors?.email?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="number">
                                        Number <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Number..."
                                        fullWidth
                                        size="small"
                                        {...register("number")}
                                    />
                                </Stack>
                                {errors && errors.number
                                    ? ErrorShowing(errors?.number?.message)
                                    : ""}
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="add1">
                                        Address Line 1 <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Address 1..."
                                        fullWidth
                                        size="small"
                                        {...register("address1")}
                                    />
                                </Stack>
                                {errors && errors.address1
                                    ? ErrorShowing(errors?.address1?.message)
                                    : ""}
                            </Grid> */}
                            {/* <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="add2">
                                        Address Line 2
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Address 2..."
                                        fullWidth
                                        size="small"
                                        {...register("address2")}
                                    />
                                </Stack>
                            </Grid> */}
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="city">
                                        City  <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="City..."
                                        fullWidth
                                        size="small"
                                        {...register("city")}
                                    />
                                </Stack>
                                {errors && errors.city
                                    ? ErrorShowing(errors?.city?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="state">
                                        State/Province/Region <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="State..."
                                        fullWidth
                                        size="small"
                                        {...register("state")}
                                    />
                                </Stack>
                                {errors && errors.state
                                    ? ErrorShowing(errors?.state?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="country">
                                        Country <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Country..."
                                        fullWidth
                                        {...register("country")}
                                        size="small"
                                    />
                                </Stack>
                                {errors && errors.country
                                    ? ErrorShowing(errors?.country?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">
                                        Zip / Postal code <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        id="name"
                                        placeholder="Postal Code..."
                                        fullWidth
                                        size="small"
                                        {...register("postalcode")}
                                    />
                                </Stack>
                                {errors && errors.postalcode
                                    ? ErrorShowing(errors?.postalcode?.message)
                                    : ""}
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                                    label="Use this address for payment details"
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                sx={{ mt: 1, ml: 1, width: "200px" }}
                                type='submit'
                                endIcon={<CreditCardIcon />}
                                id={styles.muibuttonBackgroundColor}
                            >
                                Process To Pay  {spinner === true ? <CircularProgress color="inherit" /> : ""}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </ThemeProvider >
            {/*footer*/}
            < WebViewFooter />
        </>
    );
}
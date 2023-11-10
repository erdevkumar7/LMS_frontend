import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from "../../styles/payment.module.css";
import { useRouter } from "next/router";
import {
  HandlePaymentDetails,
  HandleSubscriptionUpdate,
  HandleSubscriptionGetByID,
} from "@/services/subscription";
import { UpdateOrder } from "@/services/order";
import { CreateTransaction } from "@/services/transaction";
import Link from "next/link";
import moment from "moment";
import {
  GetdateAfterOneMonth,
  GetdateAfterOneYear,
} from "@/common/commonfunctions/connonfun";
import Loader from "../../common/CircularProcess/processing";

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loader, setLoadar] = React.useState(false);

  useEffect(() => {
    if (router.isReady) {
      getPaymentDetails();
    }
  }, [router.isReady]);

  const reqdata = {
    cs_test_key: session_id,
  };
  //get payment details
  const getPaymentDetails = () => {
    // setLoadar(true);
    const orderid = localStorage.getItem("orderId");
    HandlePaymentDetails(reqdata)
      .then((paymentdet) => {
        const peymentdet = paymentdet?.orderdetails?.data[0];
        if (paymentdet) {
          const orderdet = {
            status: "paid",
            transaction_id: session_id,
          };
          UpdateOrder(orderdet, orderid)
            .then((order) => {
              if (order?.data) {
                const orderdatas = order?.data;
                //create transaction
                const tnxdata = {
                  user_id: orderdatas?.user_id,
                  order_id: orderdatas?.id,
                  payment_method: "Stripe",
                  transaction_id: session_id,
                  trx_amount: peymentdet?.amount_total / 100,
                  createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                };
                CreateTransaction(tnxdata)
                  .then((tnxdet) => {
                    if (tnxdet?.data) {
                      HandleSubscriptionGetByID(
                        orderdatas?.subscription_id
                      ).then((subsdet) => {
                        if (subsdet?.data) {
                          let expirtdt;
                          if (
                            subsdet?.data?.duration_term === "month" ||
                            subsdet?.data?.duration_value == 30
                          ) {
                            expirtdt = GetdateAfterOneMonth(new Date());
                          } else {
                            expirtdt = GetdateAfterOneYear(new Date());
                          }
                          const reqdata = {
                            status: "active",
                            start_date: moment(new Date()).format(
                              "YYYY-MM-DD HH:mm:ss"
                            ),
                            expiry_date: moment(expirtdt).format(
                              "YYYY-MM-DD HH:mm:ss"
                            ),
                          };
                          HandleSubscriptionUpdate(
                            orderdatas?.subscription_id,
                            reqdata
                          )
                            .then((subcdet) => {
                              if (subcdet?.data) {
                                setLoadar(false);
                                setTimeout(function () {
                                  router.replace("/user/subscription");
                                }, 10000);
                              }
                            })
                            .catch((err) => {
                              console.log("HandleSubscriptionUpdate", err);
                            });
                        }
                      });
                    }
                  })
                  .catch((err) => {
                    console.log("CreateTransaction", err);
                  });
              }
            })
            .catch((err) => {
              console.log("UpdateOrder", err);
            });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Box className={styles.content}>
          <Box className={styles.wrapper1}>
            <Box className={styles.wrapper2}>
              <Typography variant="h3" className={styles.h1}>
                Thank you !
              </Typography>
              <Typography className={styles.p}>Thanks for Payment. </Typography>
              <Typography className={styles.p}>
                you should receive a confirmation email soon{" "}
              </Typography>
              <Link href={"/user/subscription"}>
                <Button className={styles.gohome}>go to orders</Button>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

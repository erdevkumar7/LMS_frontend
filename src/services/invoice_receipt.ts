import { authHeader } from "@/common/Tokens/authToken";
import axios from "axios";
import { API } from "../config/config";
export const HandleDownloadReceipt = async (reqdata: any) => {
  let receiptdownloaddata;
  await axios({
    method: "post",
    url: `${API.downloadpaymentreceipt}`,
    data: reqdata,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/pdf",
    },
  })
    .then((response: any) => {
      if (response) {
        receiptdownloaddata = response;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
  return receiptdownloaddata;
};

export const HandleDownloadInvoice = async (reqdata: any) => {
  let invoicedownloaddata;
  await axios({
    method: "post",
    url: `${API.downloadorderinvoice}`,
    data: reqdata,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/pdf",
    },
  })
    .then((response: any) => {
      if (response) {
        invoicedownloaddata = response;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
  return invoicedownloaddata;
};

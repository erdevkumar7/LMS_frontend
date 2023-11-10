import { LoginHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { HandleLogout } from "./auth";

export const CreateTransaction = async (reqdata: any) => {
  return await axios({
    method: "POST",
    url: `${API.createtransaction}`,
    headers: LoginHeader(),
    data: reqdata,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      }
      return error;
    });
};

// get transaction by oreder id
export const GetTransactiondet = async (orderId: any) => {
  return await axios({
    method: "get",
    url: `${API.getTransaction}/${orderId}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      }
      return error;
    });
};

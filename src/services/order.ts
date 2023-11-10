import { LoginHeader, authHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";

export const HandleOrderGetByUserID = async (subscription_id: any) => {
  return await axios({
    method: "GET",
    url: `${API.getOrder}/${subscription_id}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("subscription failed");
      }
      return error;
    });
};

export const CreateOrder = async (reqdata: any) => {
  return await axios({
    method: "POST",
    url: `${API.createsubscriptionorder}`,
    headers: authHeader(),
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

export const UpdateOrder = async (reqdata: any, orderId: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updateorder}/${orderId}`,
    headers: authHeader(),
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

export const CreateOrderForSubscription = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.createorderforsubscription}`,
    headers: authHeader(),
    data: reqData,
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

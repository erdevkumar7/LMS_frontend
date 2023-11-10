import { LoginHeader, authHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";

export const HandleSiteConfigCreate = async (
  reqData: any,
  toasterCondition: string
) => {
  return await axios({
    method: "POST",
    url: `${API.createSite}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((request) => {
      if (toasterCondition === "site saved") {
        toast.success("Site configuration submitted, will be updated soon");
      } else if (toasterCondition === "content saved") {
        toast.success(
          "Site content generator key submitted, will be updated soon"
        );
      } else {
        toast.success("Stripe configuration submitted");
      }
      return request;
    })
    .catch((error) => {
      console.log("errr", error);
      if (error?.response === 401) {
        HandleLogout();
      } else {
        toast.error("Failed to submitted configuration");
      }
      return error;
    });
};

export const HandleSiteGetByID = async (userId: any) => {
  return await axios({
    method: "GET",
    url: `${API.getSite}/${userId}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};

export const HandleGetAllSiteGet = async () => {
  return await axios({
    method: "GET",
    url: `${API.getAllSiteConfiguration}`,
    headers: authHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        HandleLogout();
      }
      return error;
    });
};

export const HandleSiteConfigUpdate = async (
  updateData: any,
  toasterCondition: string
) => {
  return await axios({
    method: "PUT",
    url: `${API.updateSite}`,
    headers: LoginHeader(),
    data: updateData,
  })
    .then((request) => {
      if (toasterCondition === "site update") {
        toast.success("Site configuration, will be updated soon");
      } else if (toasterCondition === "content saved") {
        toast.success(
          "Site content generator key submitted, will be updated soon"
        );
      } else {
        toast.success("Stripe configuration updated");
      }
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Failed to update configuration");
      }
      return error;
    });
};

export const HandleSecretKeyUpdate = async (idd: any, updateData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updateContentSecret}/${idd}`,
    headers: LoginHeader(),
    data: updateData,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Content Update failed");
      }
      return error;
    });
};

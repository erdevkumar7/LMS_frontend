import { LoginHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";

export const HandleSessionCreate = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.createSession}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((request) => {
      toast.success("Session Created Successfully");
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Session added failed");
      }
      return error;
    });
};

export const HandleSessionGet = async (searchData: any, filterData: any) => {
  // console.log("sercDaTa",searchData)
  const API_URL = searchData
    ? `${API.getSessions}/${searchData}`
    : `${API.getSessions}`;
  return await axios({
    method: "POST",
    url: API_URL,
    headers: LoginHeader(),
    data: filterData,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};

export const HandleLiveSessionGet = async (searchData: any, filterData: any) => {
  // console.log("sercDaTa",searchData)
  const API_URL = searchData
    ? `${API.getLiveSessions}/${searchData}`
    : `${API.getLiveSessions}`;
  return await axios({
    method: "POST",
    url: API_URL,
    headers: LoginHeader(),
    data: filterData,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};



export const HandleSessionGetByID = async (sessionId: any) => {
  return await axios({
    method: "GET",
    url: `${API.getSessions}/${sessionId}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Session added failed");
      }
      return error;
    });
};

export const HandleSessionUpdate = async (sessionId: any, updateData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updateSession}/${sessionId}`,
    headers: LoginHeader(),
    data: updateData,
  })
    .then((request) => {
      toast.success("Session Updated Successfully");
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Session added failed");
      }
      return error;
    });
};

export const HandleSessionDelete = async (rowID: any, title?:any) => {
  return await axios({
    method: "DELETE",
    url: `${API.deleteSession}/${rowID}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      toast.success(capitalizeFirstLetter(`${title} deleted Successfully`));
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};


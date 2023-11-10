import { LoginHeader, authHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";

export const HandleCourseGetByUserId = async (userID: any, search?: any) => {
  if (search) {
    return await axios({
      method: "GET",
      url: `${API.getCoursesByUserId}/${userID}/${search}`,
      headers: LoginHeader(),
    })
      .then((request) => {
        return request;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          HandleLogout();
        } else {
          toast.error("Course added failed");
        }
        return error;
      });
  } else {
    return await axios({
      method: "GET",
      url: `${API.getCoursesByUserId}/${userID}`,
      headers: LoginHeader(),
    })
      .then((request) => {
        return request;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          HandleLogout();
        } else {
          toast.error("Course added failed");
        }
        return error;
      });
  }
};

export const UserEnrolledCourses = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.createenrollcourse}`,
    headers: LoginHeader(),
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

export const CheckEnrolledCourses = async (reqData: any) => {
  return await axios({
    method: "post",
    url: `${API.checenrollcourses}`,
    headers: LoginHeader(),
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

export const TopEnrolledCourses = async () => {
  return await axios({
    method: "get",
    url: `${API.topenrolledcourses}`,
    headers: authHeader(),
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

export const MarkAsComplete = async (reqData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.markascomplete}`,
    headers: authHeader(),
    data: reqData,
  })
    .then((response) => {
      toast.success(response?.data);
      return response;
    })
    .catch((error) => {
      if (error.response.status === 400) {
        HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};

export const UpdateMarkAsComplete = async (reqData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updatemarkascomplete}`,
    headers: authHeader(),
    data: reqData,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response.status === 400) {
        // HandleLogout();
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};

export const GetEnrolledCoursesByUserId = async (userId: any) => {
  return await axios({
    method: "GET",
    url: `${API.getEnrollCoursesByUserId}/${userId}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Course added failed");
      }
      return error;
    });
};

export const HandleCourseGetByUserIdForNotification = async (userID: any) => {
    return await axios({
      method: "GET",
      url: `${API.getCoursesByUserIdForNotification}/${userID}`,
      headers: LoginHeader(),
    })
      .then((request) => {
        return request;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          HandleLogout();
        } else {
          toast.error("Course added failed");
        }
        return error;
      });
};

import { LoginHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { HandleLogout } from "./auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const HandleAdminDashboardContent = async () => {
    return await axios({
      method: "GET",
      url: `${API.dashboarddata}`,
      headers: LoginHeader(),
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
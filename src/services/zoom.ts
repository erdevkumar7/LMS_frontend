import { LoginHeader } from "@/common/Tokens/authToken"
import { API } from "@/config/config"
import axios from "axios"
import { toast } from "react-toastify";

export const HandleZoomMeetingCreate = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.createzoommeeting}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      return error;
    });
}

export const HandleZoomMeetingById = async (reqData:any) => {
  return await axios({
    method: "GET",
    url: `${API.getzoommeetingbyid}/${reqData.id}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      return error;
    });
}
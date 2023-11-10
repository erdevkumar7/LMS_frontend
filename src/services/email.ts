import { LoginHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";


export const HandleEmailContentGetByID = async (Id?: any) => {
    const emailContentUrl = Id ? `${API.getEmailContent}/${Id}` : `${API.getEmailContent}`;
    return await axios({
        method: "GET",
        url: emailContentUrl,
        headers: LoginHeader(),
    })
        .then((request) => {
            return request;
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                HandleLogout()
            } else if (error.response?.status === 400) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong");
            }
            return error;
        });
};

export const HandleEmailTypeGetByID = async (Id?: any) => {
    const emailTypeUrl = Id ? `${API.getEmailType}/${Id}` : `${API.getEmailType}`;
    return await axios({
        method: "GET",
        url: emailTypeUrl,
        headers: LoginHeader(),
    })
        .then((request) => {
            return request;
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                HandleLogout()
            } else if (error.response?.status === 400) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong");
            }
            return error;
        });
};

export const HandleEmailContentCreate = async (reqData: any) => {
    return await axios({
        method: "POST",
        url: `${API.createEmailContent}`,
        headers: LoginHeader(),
        data: reqData,
    }).then((request) => {
        toast.success("Email content submitted")
        return request;
    }).catch((error) => {
        if (error?.response?.status === 401) {
            HandleLogout()
        } else if (error.response?.status === 400) {
            toast.error(error?.response?.data?.message)
        } else {
            toast.error("Failed to submitted configuration")
        }
        return error;
    })
};

export const HandleEmailContentUpdate = async (updateData: any, id: any) => {
    return await axios({
        method: "PUT",
        url: `${API.updateEmailContent}/${id}`,
        headers: LoginHeader(),
        data: updateData,
    }).then((request) => {
        toast.success("Email content updated")
        return request;
    }).catch((error) => {
        if (error?.response?.status === 401) {
            HandleLogout()
        } else if (error.response?.status === 400) {
            toast.error(error?.response?.data?.message)
        } else {
            toast.error("Failed to update email content")
        }
        return error;
    })
};


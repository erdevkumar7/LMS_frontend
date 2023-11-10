import { LoginHeader, authHeader } from "@/common/Tokens/authToken";
import { API } from "@/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";

export const HandleSubscriptionGet = async (search: string, reqData?: any) => {
  const API_URL = search
    ? `${API.getAllSubscription}/${search}`
    : `${API.getAllSubscription}`;
  return await axios({
    method: "POST",
    url: API_URL,
    headers: LoginHeader(),
    data: reqData,
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

export const HandleSubscriptionPost = async (reqData: any) => {
  const API_URL = `${API.createsubscription}`;
  return await axios({
    method: "POST",
    url: API_URL,
    data: reqData,
    headers: LoginHeader(),
  })
    .then((request) => {
      if (request.status === 201) {
        toast.success("Subscription added successfully");
      }
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

export const HandleSubscriptionUpdate = async (id: any, reqData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updateSubscription}/${id}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((request) => {
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else {
        toast.error("Something went wrong!");
      }
      return error;
    });
};

export const HandleSubscriptionDelete = async (id: string) => {
  const API_URL = `${API.deleteSubscription}/${id}`;
  return await axios({
    method: "DELETE",
    url: API_URL,
    headers: LoginHeader(),
  })
    .then((request) => {
      if (request.status === 201) {
        toast.success("Deleted successfully.");
      }
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

export const HandleSubscriptionGetByID = async (subId: any) => {
  return await axios({
    method: "GET",
    url: `${API.getSubsById}/${subId}`,
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

export const HandleSubscriptionGetByUserID = async (subId: any) => {
  return await axios({
    method: "GET",
    url: `${API.getSubscription}/${subId}`,
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

export const HandleSubscriptionPayment = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.acceptpayment}`,
    headers: authHeader(),
    data: reqData,
  })
    .then((responce) => {
      return responce?.data?.returnurl;
    })
    .catch((error) => {
      if (error.response.status === 401) HandleLogout();
      else return error;
    });
};

export const HandleSearchSubsGet = async (searchData: any, data: any) => {
  const dd = {
    id: data,
  };
  const API_URL = searchData
    ? `${API.getSubscription}/${searchData}`
    : `${API.getSubscription}`;
  return await axios({
    method: "POST",
    url: API_URL,
    headers: LoginHeader(),
    data: dd,
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

export const HandlePaymentDetails = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.getpaymentdetails}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((responce) => {
      return responce?.data;
    })
    .catch((error) => {
      if (error.response.status === 401) HandleLogout();
      else return error;
    });
};

export const CreateUserSubsction = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.createsubscription}`,
    headers: authHeader(),
    data: reqData,
  })
    .then((responce) => {
      return responce?.data;
    })
    .catch((error) => {
      if (error.response.status === 401) HandleLogout();
      else return error;
    });
};

export const HandleInvoicesGet = async (search: string, reqData?: any) => {
  const API_URL = search
    ? `${API.getInvoices}/${search}`
    : `${API.getInvoices}`;
  return await axios({
    method: "POST",
    url: API_URL,
    headers: LoginHeader(),
    data: reqData,
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

// Subscription plans
export const GetAllSubsctionPlans = async (search?: string, reqData?: any) => {
  const API_URL = search
    ? `${API.allsubscriptions}/${search}`
    : `${API.allsubscriptions}`;

  return await axios({
    method: "GET",
    url: API_URL,
    headers: authHeader(),
    data: reqData,
  })
    .then((responce) => {
      return responce?.data;
    })
    .catch((error) => {
      if (error?.response?.status === 401) HandleLogout();
      else return error;
    });
};

export const GetSubsctionsPlansDet = async (id: any) => {
  return await axios({
    method: "GET",
    url: `${API.getsubscriptionplandet}/${id}`,
    headers: authHeader(),
  })
    .then((responce) => {
      return responce?.data;
    })
    .catch((error) => {
      if (error.response.status === 401) HandleLogout();
      else return error;
    });
};

export const CreateSubscriptionPlan = async (reqData: any) => {
  return await axios({
    method: "POST",
    url: `${API.addSubscriptionPlans}`,
    data: reqData,
    headers: LoginHeader(),
  })
    .then((request) => {
      if (request.status === 201) {
        toast.success("Subscription plan added successfully");
      }
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else if (error.response.status === 400) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
      return error;
    });
};

export const UpdateSubscriptionPlan = async (id: any, reqData: any) => {
  return await axios({
    method: "PUT",
    url: `${API.updateSubscriptionPlans}/${id}`,
    headers: LoginHeader(),
    data: reqData,
  })
    .then((request) => {
      if (request.status === 201) {
        toast.success("Subscription plan updated successfully");
      }
      return request;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        HandleLogout();
      } else if (error.response.status === 400) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong!");
      }
      return error;
    });
};

export const DeleteSubscriptionPlan = async (id: string,deletedName:string) => {
  return await axios({
    method: "DELETE",
    url: `${API.deleteSubscriptionPlans}/${id}`,
    headers: LoginHeader(),
  })
    .then((request) => {
      if (request.status === 201) {
        toast.success(`'${capitalizeFirstLetter(deletedName)}' deleted successfully.`);
      } else if (request.status === 400) {
        toast.error(request.data.message);
      }
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

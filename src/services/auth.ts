import { authHeader } from "@/common/Tokens/authToken"
import { API } from "@/config/config"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { googleLogout } from "@react-oauth/google";

export const GenerateToken = async() =>{
  return await axios({
        method: "GET",
        url: `${API.authToken}`,
      }).then((request) => {
        localStorage.setItem("authToken", request.data.authToken)
      }).catch((error) => {
        return error;
      })
}

export const HandleRegister = async(reqData:any) =>{
  return await axios({
    method: "POST",
    url: `${API.register}`,
    data: reqData,
    headers: authHeader(),
  }).then((request) => {
    // toast.success("User added")
    // console.log(request,"3333333333333")
    if(request.data?.loggedin_by === ''){
      toast.success("Registration Successfully")
    }
      return request;
    }).catch((error) => {
      if(error.response.status === 400){
        toast.error("Email already exists")
      }else if(error.response.status === 401){
        HandleLogout()
      }else{
        toast.error("User added failed")
      }
      return error;
    })
}

export const HandleLogin = async(reqData:any) =>{
  console.log('event',reqData)
  return await axios({
    method: "POST",
    url: `${API.login}`,
    data: reqData,
    headers: authHeader(),
  }).then((request) => {
      return request;
    }).catch((error) => {
      if(error.response.status === 400){
        toast.error(error.response.data)
      }else if(error.response.status === 404){
        toast.error(error.response.data)
      }else if(error.response.status === 401){
        HandleLogout()
      }else{
        toast.error("User added failed")
      }
      return error;
    })
}

export const HandleLoginByGoogle = async(reqData:any) =>{
  return await axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_GOOGLE_RESPONSE_API_URL}${reqData.access_token}`,
    data: reqData,
    headers: {
      Authorization: `Bearer ${reqData.access_token}`,
      Accept: 'application/json'
  },
  }).then((request) => {
      return request;
    }).catch((error) => {
      if(error.response.status === 400){
        toast.error(error.response.data)
      }else if(error.response.status === 404){
        toast.error(error.response.data)
      }else{
        toast.error("Google login failed")
      }
      return error;
    })
}

export const HandleForgotPassword = async(reqData:any) =>{ 
  return await axios({
    method: "POST",
    url: `${API.forgotPassword}`,
    data: reqData,
    headers: authHeader(),
  }).then((request) => {
    if(request.status === 200){
      toast.success("Check your mail");
      console.log(typeof request.data,"2343243 data")
      localStorage.setItem('forgotPasswordToken',request.data)
    }
      return request;
    }).catch((error) => {
      console.log(error,"23232")
      if(error.response.status === 400){
        toast.error(error.response.data)
      }else if(error.response.status === 404){
        toast.error(error.response.data)
      }else if(error.response.status === 401){
        HandleLogout()
      }else{
        toast.error("Failed to send mail")
      }
      return error;
    })
}

export const HandleResetPassword = async(reqData:any) =>{
  return await axios({
    method: "POST",
    url: `${API.resetPassword}`,
    data: reqData,
    headers: authHeader(),
  }).then((request) => {
      toast.success("Password changed");
      return request;
    }).catch((error) => {
      if(error.response.status === 401){
        HandleLogout()
      }else{
        toast.error("Failed to reset password")
      }
      return error;
    })
}

export const HandleLogout = () => {

  googleLogout()
  localStorage.clear()
  window.location.replace("/login");
  GenerateToken()

};
 


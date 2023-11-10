import { API } from "@/config/config";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export const HandlePDF = async (reqData: any) => {
  let imageName = reqData && reqData?.imagename?.slice(8);
  let identify =
    reqData && reqData?.identifier === "pdf"
      ? "application/pdf"
      : reqData?.identifier === "image"
      ? "image/*"
      : reqData?.identifier === "txt"
      ? "text/*"
      : reqData?.identifier === "mp4"
      ? "video/*"
      : "";
  let receiptdownloaddata: any;
  await axios({
    method: "post",
    url: `${API.downloadPDF}`,
    data: reqData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: identify,
      // Accept: "application/pdf",
    },
  })
    .then((response: any) => {
      if (response) {
        receiptdownloaddata = response;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
  const url = window.URL.createObjectURL(new Blob([receiptdownloaddata?.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${imageName}`);
  document.body.appendChild(link);
  link.click();
  return false;
};

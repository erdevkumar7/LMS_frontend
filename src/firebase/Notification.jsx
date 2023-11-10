import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener } from "./firebase";
import Link from "next/link";
import { FRONTEND_BASE_URL } from "@/config/config";
import { requestPermission } from "./firebase";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <Link href={"/user/chat/"}>
        <div>
          <p>
            <b>{notification?.title}</b>
          </p>
          <p>{notification?.body}</p>
        </div>
      </Link>
    );
  }
  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  requestPermission();

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;

const pushNotification = (allchats) => {
  if (localStorage.getItem("clientToken") !== "" && allchats.length > 0) {
    var axios = require("axios");
    var data = JSON.stringify({
      to: `${localStorage.getItem("clientToken")}`,
      notification: {
        title: "Message From mangoit solutions",
        body: `${allchats[0]?.lastMessage?.text}`,
        click_action: `${FRONTEND_BASE_URL}/user/chat`,
      },
    });
    var config = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=AAAASPDf2Uw:APA91bFBWNqtNDCKvv-vrSf3xz05frkvGZWSLNMJ8zHJRoNczYWR4qXedVTJlRFgketthgWZBzL_n5uWS6hI0jLRxdAxv7Ip8JsQer2LJGWOMopo9ZCTtejgjQ7i6Hqnx81Jqo2mU0Ce`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // console.log(error);
      });
  }
};

const livepushNotification = (notificationData) => {
  if (localStorage.getItem("clientToken") !== "" && notificationData) {
    var axios = require("axios");
    var data = JSON.stringify({
      to: `${localStorage.getItem("clientToken")}`,
      notification: {
        title: "Message From mangoit solutions",
        body: `${notificationData}`,
        click_action: `${FRONTEND_BASE_URL}/user/course`,
      },
    });
    var config = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=AAAASPDf2Uw:APA91bFBWNqtNDCKvv-vrSf3xz05frkvGZWSLNMJ8zHJRoNczYWR4qXedVTJlRFgketthgWZBzL_n5uWS6hI0jLRxdAxv7Ip8JsQer2LJGWOMopo9ZCTtejgjQ7i6Hqnx81Jqo2mU0Ce`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // console.log(error);
      });
  }
};

export { pushNotification, livepushNotification };

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ProSidebarProvider } from "react-pro-sidebar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { BASE_URL } from "@/config/config";
import { AppContext } from "next/app";
import { NextPageContext } from "next";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { GenerateToken } from "@/services/auth";
import { HandleGetAllSiteGet } from "@/services/site";
import { HandleLogin } from "@/services/auth";
import { MyChatContext } from "@/GlobalStore/MyContext";
import Notification, { livepushNotification } from "@/firebase/Notification";
import { HandleCourseGetByUserIdForNotification } from "@/services/course_enroll";
import moment from "moment";

interface MyAppProps {
  siteConfigData: any; // Replace with the actual type of your site config data
}
var localData: any;
export default function App({
  Component,
  pageProps,
  siteConfigData,
}: AppProps | any) {
  const router = useRouter();

  const [textuid, setTextuid] = useState<any>("");
  const [orgFavicon, setorgFavicon] = useState<any>("");
  const [orgTitle, setorgTitle] = useState<any>("");

  const handleGetSiteOptionsDataById = async () => {
    await HandleGetAllSiteGet()
      .then((res) => {
        const objWithTitle =
          res && res?.data?.find((obj: any) => obj?.key === "title");
        const objWithFavicon =
          res && res?.data?.find((obj: any) => obj?.key === "org_favicon");

        setorgFavicon(objWithFavicon?.value);
        setorgTitle(objWithTitle?.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //----------------- code for push_notifications--------------------------

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localData = window.localStorage.getItem("userData");
  //   }

  //   if (localData) {
  //     const userIds = JSON.parse(localData);

  //     // const intervalId = setInterval (() => {
  //     //   HandleCourseGetByUserIdForNotification(userIds?.id).then((courses) => {
  //     //         const liveSessions: any = [];
  //     //         courses.data.forEach((item: { sessions: any[]; }) => {
  //     //           item.sessions.forEach(session => {
  //     //             if (session.live_date) {
  //     //               liveSessions.push(session);
  //     //             }
  //     //           });
  //     //         });

  //     //         // Sort the objects by "live_date" in ascending order
  //     //         liveSessions.sort((a: any, b: any) => (new Date(a.live_date) as any) - (new Date(b.live_date) as any));
  //     //         // The object with the smallest "live_date" is now at index 0
  //     //         const smallestLiveDateObject = liveSessions[0];
  //     //         // console.log(smallestLiveDateObject,'oooooooooooooo')
  //     //         const currentDate: any = new Date()
  //     //         const getLiveDate: any = new Date(smallestLiveDateObject?.live_date)
  //     //         const timeRemaining = getLiveDate - currentDate

  //     //         if(timeRemaining >= ( 15 * 60* 1000)){
  //     //           console.log( 'aaaaaaaaaaaaaaaa')
  //     //         }else{
  //     //           console.log('bbbbbbbbbbbbbb')
  //     //         }
  //     //   });

  //     // },500000)

  //     // return () => clearInterval(intervalId);


  //     // // Set up an interval to call the API function every 5 minutes (300,000 milliseconds)

      
  //     const intervalId = setInterval(() => {
  //       HandleCourseGetByUserIdForNotification(userIds?.id).then((rows) => {
  //         console.log(rows?.data[0]?.smallestSession)
  //         if (rows?.data[0]?.smallestSession !== undefined) {
  //           livepushNotification(`${rows?.data[0]?.smallestSession?.title} Session will started ${moment(rows?.data[0]?.smallestSession?.live_date).format('LT')}`)
  //         } else {
  //           console.log('No session have remaining time less than 15 minutes');
  //         }
  //       });
  //     }, 300000);
  //     // Clean up the interval when the component unmounts
  //     return () => clearInterval(intervalId);
  //   }

  // }, []);

  // -----------------------------------------------------------------

  useEffect(() => {
    //generate authorizationtoken and set localstorage
    GenerateToken();
    handleGetSiteOptionsDataById();
    if (typeof window !== "undefined") {
      router.push(router.asPath);
    }
  }, []);



  const lastSegment = router.pathname.substring(
    router.pathname.lastIndexOf("/") + 1
  );

  // Remove the trailing slash if present
  const trimmedUrl = router && router.pathname.replace(/\/$/, "");

  // Extract the last segment of the URL
  const segments = trimmedUrl.split("/");
  const updateuser = segments[segments.length - 2];
  let siteTitle =
    (lastSegment && lastSegment === "[id]") || lastSegment === "[session_id]"
      ? updateuser
      : lastSegment;


  return (
    <>
      <Head>
        <link
          rel="icon"
          href={
            siteConfigData
              ? BASE_URL + "/" + siteConfigData?.org_favicon
              : orgFavicon
                ? BASE_URL + "/" + orgFavicon
                : "/favicon.svg"
          }
        />
        <title>
          {siteConfigData
            ? ` ${lastSegment
              ? capitalizeFirstLetter(lastSegment) +
              " " +
              "-" +
              " " +
              siteConfigData?.title
              : ""
            }`
            : orgTitle
              ? `${siteTitle
                ? capitalizeFirstLetter(siteTitle) + " " + "-" + " "
                : ""
              } ${orgTitle} `
              : `LMS`}
        </title>
      </Head>
      <MyChatContext.Provider value={{ textuid, setTextuid }}>
        <GoogleOAuthProvider
          clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
        >
          <ProSidebarProvider>
            <Component {...pageProps} siteConfigData={siteConfigData} />
            <Notification />
          </ProSidebarProvider>
        </GoogleOAuthProvider>
      </MyChatContext.Provider>

    </>
  );
}

App.getInitialProps = async (appContext: AppContext): Promise<MyAppProps> => {
  const { Component, ctx } = appContext;
  // Check if the page component has its own getInitialProps method
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx as NextPageContext)
    : {};
  // Retrieve the siteConfigData from the SiteConfigPage props
  const { siteConfigData: pageSiteConfigData } = pageProps as any;
  return { ...pageProps, siteConfigData: pageSiteConfigData };
};

const KJUR = require("jsrsasign");
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  HandleZoomMeetingById,
  HandleZoomMeetingCreate,
} from "@/services/zoom";
import { HandleSessionGetByID } from "@/services/session";
import { ToastContainer, toast } from "react-toastify";
import { Start } from "@mui/icons-material";

export default function Meeting() {
  const [getclient, setclient] = useState<any>('');
  const router = useRouter();
  const { id } = router?.query;


  // if (getclient && getclient !== '') {
  //   getclient.leaveMeeting().then((e: any) => {
  //     console.log("levaeeee then", e);
  //   })
  //     .catch((e: any) => {
  //       console.log('levaeeee catch', e);
  //     });
  // }

  useEffect(() => {
    if (id) {
      async function zoomMeeting() {
        const sessionDetails = await HandleSessionGetByID(id);
        const getmeetingId = sessionDetails?.data?.room_id;
        if (getmeetingId.length < 11) {
          toast.error("No meeting found");
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          const zoomData = await HandleZoomMeetingById({ id: getmeetingId });
          const zoomAPIData = zoomData.data;
          const iat = Math.round(new Date().getTime() / 1000) - 30;
          const exp = iat + 60 * 60 * 2;
          const oHeader = { alg: "HS256", typ: "JWT" };
          const oPayload = {
            sdkKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
            mn: zoomAPIData.id,
            role: 1,
            iat: iat,
            exp: exp,
            appKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
            tokenExp: iat + 60 * 60 * 2,
          };

          const sHeader = JSON.stringify(oHeader);
          const sPayload = JSON.stringify(oPayload);
          const signature = KJUR.jws.JWS.sign(
            "HS256",
            sHeader,
            sPayload,
            process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET
          );

          //------------------------component view----------------------------------------
          const StartMeetingOptions = await import("@zoomus/websdk/embedded");
          const zoomEmbed = StartMeetingOptions.default

          let meetingSDKElement: any = document.getElementById("meetingSDKElement");
          const client = zoomEmbed.createClient();
          client.init({
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            customize: {
              // toolbar: {             
              //   buttons: [
              //     {
              //       text: 'Custom Button',
              //       className: 'CustomButton',
              //       onClick: () => {
              //         console.log('custom button');
              //       },
              //     },
              //   ],
              // },
              video: {
                isResizable: true,
                viewSizes: {
                  default: {
                    width: 1200,
                    height: 300
                  },
                }
              },
            }
          })

          client.join({
            signature: signature,
            sdkKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
            meetingNumber: zoomAPIData.id,
            password: zoomAPIData.password,
            userName: "Admin",
          });

          // client.leaveMeeting().then((e) => {
          //   console.log("levaeeee then", e);
          // })
          //   .catch((e) => {
          //     console.log('leaveee err catch', e);
          //   });


          // client.endMeeting().then((e) => {
          //   console.log("end meeting", e);
          // })
          //   .catch((e) => {
          //     console.log('end err catch', e);
          //   });

          // //----------------- client view -------------------------------
          // const { ZoomMtg } = await import('@zoomus/websdk')
          // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.17.0/lib', '/av');

          // ZoomMtg.preLoadWasm();
          // ZoomMtg.prepareWebSDK();
          // ZoomMtg.i18n.load('en-US');
          // ZoomMtg.i18n.reload('en-US');

          // // document.getElementById('zmmtg-root').style.display = 'block'
          // // let meetingSDKElement: any = document.getElementById("meetingSDKElement")

          // ZoomMtg.init({
          //   leaveUrl: 'https://mangoit-lms.mangoitsol.com/',
          //   success: (success: any) => {
          //     console.log(success)
          //     ZoomMtg.join({
          //       signature: signature,
          //       sdkKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
          //       meetingNumber: zoomAPIData.id,
          //       passWord: zoomAPIData.password,
          //       userName: 'Admin',
          //       success: (success: any) => {
          //         console.log(success)
          //       },
          //       error: (error: any) => {
          //         console.log(error)
          //       }
          //     })

          //   },
          //   error: (error: any) => {
          //     console.log(error)
          //   }
          // })

          //----------------------------------------------------------------
        }
      }
      zoomMeeting()
    }
  }, []);

  const habdleZoomMeeting = () => {
    router.push('/admin/courses/livesessions')
  }

  return (
    <>
      {/* <Box id='zmmtg-root' ></Box> */}
      <Box
        className="zoomMeetings"
        sx={{
          width: "100%",
          height: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box id="meetingSDKElement"></Box>
        {/* <Button variant="contained" onClick={habdleZoomMeeting} >Go Back</Button> */}

      </Box>
      <ToastContainer />
    </>
  );
}

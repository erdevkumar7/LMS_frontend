const KJUR = require('jsrsasign');
import { HandleSessionGetByID } from '@/services/session';
import { HandleZoomMeetingById } from '@/services/zoom';
import { Box } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';

// Client Id: 'vtHGuMMOSiuh0fp1G7i9qg'
// Client Secrete: 'lRDmYm7sCNq6Dmip3OqDed47n6gAfV5l'

export default function Meeting() {
  const router = useRouter();
  const { id } = router?.query
  useEffect(() => {
    if (id) {
      return () => {
        async function zoomUserMeeting() {
          const sessionDetails = await HandleSessionGetByID(id)
          const getmeetingId = sessionDetails?.data?.room_id
          if (getmeetingId.length < 11) {
            toast.error('No meeting found')
            setTimeout(() => {
              window.close()
            }, 2000)
          } else {
            const zoomData = await HandleZoomMeetingById({ id: getmeetingId });
            const zoomAPIData = zoomData.data
            console.log(zoomAPIData.id, 'fffffffffff', zoomAPIData.password)

            const iat = Math.round(new Date().getTime() / 1000) - 30;
            const exp = iat + 60 * 60 * 2
            const oHeader = { alg: 'HS256', typ: 'JWT' }

            const oPayload = {
              sdkKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
              mn: zoomAPIData.id,
              role: 0,
              iat: iat,
              exp: exp,
              appKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
              tokenExp: iat + 60 * 60 * 2
            }

            const sHeader = JSON.stringify(oHeader)
            const sPayload = JSON.stringify(oPayload)
            const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET)
            return new Promise(async (resolve, reject) => {
              const zoomEmbed = (await import('@zoomus/websdk/embedded')).default

              resolve(zoomEmbed.createClient())
            }).then(async (client: any) => {
              let meetingSDKElement = document.getElementById('meetingSDKElement')
              client.init({
                zoomAppRoot: meetingSDKElement,
                language: 'en-US',
                customize: {
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
              });


              client.join({
                signature: signature,
                sdkKey: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
                meetingNumber: zoomAPIData.id,
                password: zoomAPIData.password,
                userName: 'User',
              })


            }).catch((err) => console.log(err))
          }
        }
        zoomUserMeeting();
      }
    }
  }, [])

  return (
    <>
      <Box className='zoomMeetings' id='meetingSDKElement' sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }} ></Box>
      <ToastContainer />
    </>
  )
}

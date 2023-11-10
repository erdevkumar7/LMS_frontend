import { Button } from '@mui/material';
import axios from 'axios'
import { get } from 'http';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'


export default function Meeting({ zoomData }: any) {
  const router = useRouter();
  console.log(zoomData, 'wwwwwwwwwwww')

  const handleJoin = ()=>{
    router.push(`http://localhost:3000/admin/courses/livesessions/meeting/`)
  }

  return (
    <div>
      {zoomData ? (
        <div>
          <h2>Meeting Details</h2>
          <p>Topic: {zoomData?.topic}</p>
          <p>Start Time: {zoomData?.start_time}</p>
          <p>Meeting ID: {zoomData?.id}</p>
          <p>Start URL:  <a href={zoomData?.start_url}>Start Zoom Meeting</a></p>
          <Button onClick={handleJoin}> join </Button>
          {/* <p>Join URL:  <a href={zoomData?.join_url}>Join Zoom Meeting</a></p> */}
        </div>
      ) : (
        <div>Loading meeting details...</div>
      )}
    </div>
  );
}


export const getServerSideProps = async ({ req, res }: any) => {
  const thisUrl = new URL(req.url, `http://localhost:3000/admin/courses/livesessions/meeting/`)

  if (thisUrl.searchParams.get('code')) {
    const urlParam: any = thisUrl.searchParams.get('code')

    const data = process.env.ZOOM_CLIENT_ID + ':' +
      process.env.ZOOM_CLIENT_SECRETE
    const newData = Buffer.from(data, 'utf8')
    const b64string = newData.toString('base64')

    const zoomUrl = new URL('https://zoom.us/oauth/token')
    zoomUrl.searchParams.set('grant_type', 'authorization_code')
    zoomUrl.searchParams.set('code', urlParam)
    zoomUrl.searchParams.set('redirect_uri', `http://localhost:3000/admin/courses/livesessions/meeting/`)
    // Get access token --------------------------------------------------
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + b64string
        }
      }
      const response = await fetch(zoomUrl.href, options)
      const getAcessToken = await response.json()

      // Get User credentials ------------------------------------------------
      // const newOptions = {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': 'Bearer' + getAcessToken.access_token
      //   }
      // }
      // const preUser = await fetch('https://api.zoom.us/v2/users/me', newOptions)
      // const zoomData = await preUser.json()

      //Create meeting -----------------------------------------
      // const meetingdata = await axios({
      //   method: 'post',
      //   url: 'https://api.zoom.us/v2/users/me/meetings/',
      //   headers: {
      //     'Authorization': `Bearer` + getAcessToken.access_token,
      //   },
      //   data: {"topic":"live new meeting"}
      // });
      // const zoomUser = await meetingdata.data
      // return {
      //   props: { zoomData }
      // }

      //  Get meeting byID --------------------------------

      if (getAcessToken) {
        const meetingdata = await axios({
          method: 'get',
          url: 'https://api.zoom.us/v2/meetings/87083135645',
          headers: {
            'Authorization': `Bearer` + 'eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjAyZDMyZGFjLTkzZjYtNGRlNS1iMDdhLTczYjYyMmU5ODNiMSJ9.eyJ2ZXIiOjksImF1aWQiOiJmMTkxMTliZThiYTk0ODQ4Njk4MDQwM2M5ZDU3ODY5MCIsImNvZGUiOiJQRGl2cmxmQmxCamVRVHlHbGdyU1U2YVNWR1pPeFY4bFEiLCJpc3MiOiJ6bTpjaWQ6dnRIR3VNTU9TaXVoMGZwMUc3aTlxZyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ2OWlGRDJDYlNxR2xmNmpRbkJoNmRBIiwibmJmIjoxNjk4MzA1OTk2LCJleHAiOjE2OTgzMDk1OTYsImlhdCI6MTY5ODMwNTk5NiwiYWlkIjoiUVhmMHZGa0dSQ1NlYmNKZWJGZk9rZyJ9.YrOIZ9IT71aeb0GhBmvYkCpeZ4z6LUMhHu8Py7gTujCSgh6VZbYmtqNhTnEGg16bvDcTCEYrq4bP23xhcWX1Tg',
          },
        });

        const zoomData = await meetingdata.data
        return {
          props: { zoomData }
        }
      }

      // if (getAcessToken.access_token) {
      // }
    }
    catch (e) {
      console.log(e)
    }

  }
}


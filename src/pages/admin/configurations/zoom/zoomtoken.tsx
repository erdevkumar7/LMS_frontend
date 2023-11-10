import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
import { FRONTEND_BASE_URL } from '@/config/config';
import { HandleSiteConfigUpdate, HandleSiteGetByID } from '@/services/site';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'


export default function Meeting({ zoomData }: any) {
    const [isLoading, setLoading] = useState<boolean>(true);
    const router = useRouter()
    const zoomToken = zoomData.access_token

    useEffect(() => {
        console.log(zoomToken, 'wwwwwwwwwwww')
        let localData: any;
        if (typeof window !== "undefined") {
            localData = window.localStorage.getItem("userData");
        }
        const user_id = JSON.parse(localData);
        if (zoomToken !== undefined) {
            onUpdate(zoomToken)
        }
    }, []);

    const onUpdate = async (event: any) => {
        const reqData: any = {
            zoom_access_token: event,
        };

        const formData: any = new FormData();
        for (var key in reqData) {
            formData.append(key, reqData[key]);
        }

        try {
            const res = await HandleSiteConfigUpdate(formData, "stripe update")
            if (res) {
                setLoading(false);
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleToken = () => {
        router.push(`${FRONTEND_BASE_URL}/admin/configurations/zoom/`)
    }

    return (
        <div>
            {isLoading ? <Box className='identify' sx={{ marginTop: '150px' }}> <SpinnerProgress /> </Box>
                : <Box>
                    <Typography>Token generated</Typography>
                    {/* <Button variant='contained' size='large' onClick={handleToken}> Go Back </Button> */}
                </Box>}
        </div>
    );
}


export const getServerSideProps = async ({ req, res }: any) => {

    const thisUrl = new URL(req.url, `${FRONTEND_BASE_URL}/admin/configurations/zoom/zoomtoken/`)

    if (thisUrl.searchParams.get('code')) {
        const urlParam: any = thisUrl.searchParams.get('code')
        const data = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID + ':' +
            process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET
        const newData = Buffer.from(data, 'utf8')
        const b64string = newData.toString('base64')

        const zoomUrl = new URL('https://zoom.us/oauth/token')
        zoomUrl.searchParams.set('grant_type', 'authorization_code')
        zoomUrl.searchParams.set('code', urlParam)
        zoomUrl.searchParams.set('redirect_uri', `${FRONTEND_BASE_URL}/admin/configurations/zoom/zoomtoken/`)

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
            const zoomData = await response.json()
            return {
                props: { zoomData }
            }
        }
        catch (e) {
            console.log(e)
        }

    }
}
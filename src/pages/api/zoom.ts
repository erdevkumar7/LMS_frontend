import axios from "axios";

export async function createZoomMeeting(req: any, res: any) {

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://cors-anywhere.herokuapp.com/https://api.zoom.us/v2/users/me/meetings',
            headers: {
                'Authorization': `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImY2ZDFjOGI0LTQzMDMtNDc5ZC1hNGZhLTU2MzIxNjIwNWUzNyJ9.eyJ2ZXIiOjksImF1aWQiOiJmMTkxMTliZThiYTk0ODQ4Njk4MDQwM2M5ZDU3ODY5MCIsImNvZGUiOiJGUDNqbGhhYmIwNVY5ZEF3RGQ0UjJtM1QySTEtbTBJSVEiLCJpc3MiOiJ6bTpjaWQ6dnRIR3VNTU9TaXVoMGZwMUc3aTlxZyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ2OWlGRDJDYlNxR2xmNmpRbkJoNmRBIiwibmJmIjoxNjk4MzgwMDk5LCJleHAiOjE2OTgzODM2OTksImlhdCI6MTY5ODM4MDA5OSwiYWlkIjoiUVhmMHZGa0dSQ1NlYmNKZWJGZk9rZyJ9.BTRjMUR6SLv4xA4R9PtFrItC-63FGnQxv5H94C3Gio77wH3V1DGqDr9pu2tqzntJpZ3pSIN6AmQvHF7V3gx8aQ`,
                'Content-Type': 'application/json',
            },
            data: {
                topic: 'resolve err',
            }
        });
        // const zoomData = await meetingdata.data
        // console.log(zoomData)
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }

}

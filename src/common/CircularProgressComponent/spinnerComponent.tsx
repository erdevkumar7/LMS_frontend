import { Box, CircularProgress } from "@mui/material";

const SpinnerProgress = () => {
    return (<Box textAlign={'center'}><CircularProgress size={'1.6rem'} sx={{ color: "#E8661B" }} /></Box>);
}

export default SpinnerProgress;
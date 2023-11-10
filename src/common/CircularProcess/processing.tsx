import { Box } from "@mui/material";
import React from "react";
import ReactLoading from "react-loading";
const Loader = () => (
    <Box style={{ position: 'absolute',
        right: '50%' }}>
        <ReactLoading
            type={"spin"}
            color={"#ff4500"}
            height={80}
            width={80}
            className="loadingcss"
        />
    </Box>
);
export default Loader;
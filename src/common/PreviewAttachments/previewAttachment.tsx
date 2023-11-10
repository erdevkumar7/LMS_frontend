import { Box, Typography } from "@mui/material";
import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Document, Page, pdfjs } from "react-pdf";
import Sessions from "../../styles/session.module.css";
import ReactPlayer from "react-player";
import { BASE_URL } from "../../config/config";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { string } from "yup";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface previewAttach {
  name: any;
  identifier?: string;
}
const Preview = ({ name, identifier }: previewAttach) => {
  let extension;
  if (name && typeof name === "string") {
    extension = name?.split(".").pop();
  } else {
    extension = name?.name?.split(".").pop();
  }
  if (
    extension === "jpg" ||
    extension === "gif" ||
    extension === "png" ||
    extension === "jpeg"
  ) {
    return identifier ? (
      <ImageOutlinedIcon />
    ) : (
      <Box className={Sessions.updateSessionAttachments}>
        {/* <img src={`${BASE_URL}/${name}`} width='80px' height='80px'/> */}
        <a href={`${BASE_URL}/${name}`} download={name} target="_blank">
          <ImageIcon /> <Typography>Preview</Typography>
        </a>
      </Box>
    );
  } else if (
    extension === "mp4" ||
    extension === "3gp" ||
    extension === "webm"
  ) {
    return identifier ? (
      <OndemandVideoIcon />
    ) : (
      <Box className={Sessions.updateSessionAttachments}>
        {/* <ReactPlayer url={`${BASE_URL}/${name}`} controls={true} width='80px' height='80px' /> */}
        <a href={`${BASE_URL}/${name}`} download={name} target="_blank">
          <VideoLibraryIcon />
          <Typography>Preview</Typography>
        </a>
      </Box>
    );
  } else if (extension === "txt") {
    return identifier ? (
      <ArticleOutlinedIcon />
    ) : (
      <Box className={Sessions.updateSessionAttachments}>
        <a href={`${BASE_URL}/${name}`} download={name} target="_blank">
          <DescriptionIcon />
          <Typography>Preview</Typography>
        </a>
      </Box>
    );
  } else if (extension === "pdf") {
    return identifier ? (
      <PictureAsPdfOutlinedIcon />
    ) : (
      <Box className={Sessions.updateSessionAttachments}>
        <a href={`${BASE_URL}/${name}`} download={name} target="_blank">
          <PictureAsPdfIcon />
          <Typography>Preview</Typography>
        </a>
      </Box>
    );
  } else {
    return <Box>Cannot preview this file type</Box>;
  }
};

export default Preview;

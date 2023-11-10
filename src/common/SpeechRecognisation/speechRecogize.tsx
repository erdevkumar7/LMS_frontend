import React, { useState, createContext, useContext, useEffect } from 'react'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// MUI Import
import { Autocomplete, Box, Button, } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SpeechRecognition, { ListeningOptions, useSpeechRecognition } from 'react-speech-recognition';
import { speechContext } from '@/pages/admin/courses/allsessions/addsession';



export default function SpeechRecogize() {
    const { setTranscript }: any = useContext(speechContext)
// console.log(spechData)
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        setTranscript(transcript)
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    const startSpeechRecognzer = () => {
        SpeechRecognition.startListening()
        // setTranscript(transcript)
    };

    const stopSpeechRecognzer = () => {
        SpeechRecognition.stopListening()
        // onTranscriptUpdate(transcript);
    };


    return (
        <>
            {/* {transcript} */}
            <Box>
                {!listening ? <Button onClick={startSpeechRecognzer}><MicIcon /></Button> : <Button onClick={stopSpeechRecognzer}><StopCircleIcon /></Button>}
            </Box>
        </>
    )
}



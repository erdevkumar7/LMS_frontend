import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { capitalizeFirstLetter } from '../CapitalFirstLetter/capitalizeFirstLetter';

interface alertDialogInterface{ 
    open : boolean,
    onClose : any ,
    onSubmit :any , 
    title : string,
    whatYouDelete: string}

export const AlertDialog = ({ open, onClose, onSubmit, title,whatYouDelete }: alertDialogInterface) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Delete {whatYouDelete}
            </DialogTitle>
            <DialogContent >
                <DialogContentText id="alert-dialog-description" >
                    Are you sure you want delete <Typography component={'span'} sx={{ fontWeight: 'bold' }}>&apos;{capitalizeFirstLetter(title)}&apos;</Typography>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">No</Button>
                <Button onClick={onSubmit} autoFocus color="success">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>

    );
}
import { colors, IconButton } from '@material-ui/core';
import { SnackbarProvider as NotiSnackbarProvider, SnackbarProviderProps } from 'notistack';
import * as  React from 'react';
import  CloseIcone from '@material-ui/icons/Close'

export const SnackbarProvider: React.FC<SnackbarProviderProps> = (props) => {
    let snackbarProviderRef;
    const componentProps: any = {
        autoHideDuration: 3000,
        maxSnack: 3,
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
        },
        ref: (el) => snackbarProviderRef = el,
        action: (key) => (
            <IconButton 
                color={"inherit"} 
                style={{fontSize: 20}} 
                onClick={() => snackbarProviderRef.closeSnackbar(key)}>
                <CloseIcone/>
            </IconButton>
        ),
        ...props
    };
    return (
        <NotiSnackbarProvider {...componentProps}>
            {props.children}
        </NotiSnackbarProvider>
    );
};

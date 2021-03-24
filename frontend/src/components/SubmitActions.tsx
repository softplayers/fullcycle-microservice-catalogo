// @flow 
import { Box, Button, ButtonProps, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

type SubmitActionsProps = {
    disabledButtons?: boolean,
    handleSave: () => void
};

const SubmitActions = (props: SubmitActionsProps) => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained",
        disabled: !!props.disabledButtons,
    }

    return (
        <Box dir={'rtl'}>
            <Button {...buttonProps} type="button" onClick={props.handleSave} color="primary">Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
        </Box>
    );
};

export default SubmitActions;
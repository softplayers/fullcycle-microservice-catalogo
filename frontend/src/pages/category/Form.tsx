// @flow 
import * as React from 'react';
import {Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            maring: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
    }

    return (
        <form>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
            />
            <Checkbox
                name="is_active"
            />
            Ativo?
            <Box dir={'rtl'}>
                <Button {...buttonProps}>Salvar e continuar editando</Button>
                <Button {...buttonProps}>Salvar</Button>
            </Box>
        </form>
    )
}

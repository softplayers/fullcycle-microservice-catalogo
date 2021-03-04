// @flow 
import * as React from 'react';
import { useForm } from "react-hook-form";

import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
    }

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                ref={register}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                ref={register}
            />
            <Checkbox
                name="is_active"
                ref={register}
            />
            Ativo?
            <Box dir={'rtl'}>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
                <Button {...buttonProps} type="button">Salvar</Button>
            </Box>
        </form>
    )
}

// @flow 
import * as React from 'react';
import { useForm } from "react-hook-form";

import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import categoryHttp from '../../util/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

interface IFormInputs {
    name: string
    description: string
    is_active: boolean
  }

export const Form = () => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained",
    }

    const { register, handleSubmit, getValues, errors } = useForm<IFormInputs>({
        defaultValues: {
            is_active: true,
        }        
    });
    const onSubmit = (data, event) => {
        console.log(data, event);
        categoryHttp
            .create(data)
            .then(response => console.log(response));
    }

    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register({ required: 'Campo requerido', maxLength: { value: 2, message: 'Máximo de caracteres é 2' } })}
            />
            {
                errors.name && errors.name.type === 'required' && 
                (<p>{errors.name?.message}</p>)
            }
            
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                inputRef={register}
            />
            <Checkbox
                name="is_active"
                inputRef={register}
                defaultChecked
            />
            Ativo?
            <Box dir={'rtl'}>
                <Button {...buttonProps} type="button" onClick={() => onSubmit(getValues(), null)} color="primary">Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}

// @flow 
import * as React from 'react';
import { useForm } from "react-hook-form";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import castMemberHttp from '../../util/http/cast-member-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {
    const classes = useStyles();

    const [value, setValue] = React.useState('1');

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
    }

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            is_active: true,
        }
    });

    const onSubmit = (data, event) => {
        console.log(data, event);
        castMemberHttp
            .create({...data, type: value})
            .then(response => console.log(response));
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
            />

            <FormControl component="fieldset">
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup aria-label="type" name="type" value={value} onChange={handleChange}>
                    <FormControlLabel value="1" control={<Radio />} label="Diretor" />
                    <FormControlLabel value="2" control={<Radio />} label="Ator" />
                </RadioGroup>
            </FormControl>

            <Box dir={'rtl'}>
                <Button {...buttonProps} type="button" onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}

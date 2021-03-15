// @flow 
import * as React from 'react';
import { useForm } from "react-hook-form";

import { Box, Button, ButtonProps, Checkbox, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});


const validationSchema = yup.object().shape({
    name: yup
        .string()
        .label('Nome')
        .required(),
})


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

    const { register, handleSubmit, getValues, setValue, errors, reset, watch } = useForm<IFormInputs>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true,
        }        
    });

    const {id} = useParams<any>();
    const [category, setCategory] = React.useState<{id: string} | null>(null);

    React.useEffect(() => {
        if (!id) return;

        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            });
    }, []);

    React.useEffect(() => {
        register({name: 'is_active'});
    }, [register]);

    const onSubmit = (data, event) => {
        console.log(data, event);
        const http = category 
            ? categoryHttp.update(category.id, data) 
            : categoryHttp.create(data);

        http.then(response => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}> 
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{shrink: true}}
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
                InputLabelProps={{shrink: true}}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        name="is_active"
                        color="primary"
                        onChange={() => setValue('is_active', !getValues()['is_active'])}
                        checked={watch('is_active')}
                    />
                }
                label="Ativo?"
                labelPlacement="end"
            />

            <Box dir={'rtl'}>
                <Button {...buttonProps} type="button" onClick={() => onSubmit(getValues(), null)} color="primary">Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}

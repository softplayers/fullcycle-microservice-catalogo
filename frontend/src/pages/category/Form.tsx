// @flow 
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router';
import { DefaultForm } from '../../components/DefaultForm';
import SubmitActions from '../../components/SubmitActions';
import categoryHttp from '../../util/http/category-http';
import { Category } from '../../util/models';
import * as yup from '../../util/vendor/yup';


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
    const history = useHistory();
    const snackbar = useSnackbar();

    const { register, handleSubmit, getValues, setValue, errors, reset, watch, trigger } = useForm<IFormInputs>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true,
        }
    });

    const { id } = useParams<any>();
    const [category, setCategory] = React.useState<Category | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!id) return;
        setLoading(true);

        categoryHttp
            .get(id)
            .then(({ data }) => {
                setCategory(data.data);
                reset(data.data);
            })
            .finally(() => setLoading(false));
    }, [id, reset]);

    React.useEffect(() => {
        register({ name: 'is_active' });
    }, [register]);

    const onSubmit = (data, event) => {
        console.log(data, event);
        setLoading(true);

        const http = category
            ? categoryHttp.update(category.id, data)
            : categoryHttp.create(data);

        http
            .then(({ data }) => {
                const hasEvent = !!event;
                snackbar.enqueueSnackbar('Categoria salva com sucesso!', { variant: 'success' });

                if (!hasEvent) {
                    history.push(`/categories`);
                    return;
                }

                if (id) {
                    history.replace(`/categories/${data.data.id}/edit`)
                    return;
                }

                history.push(`/categories/${data.data.id}/edit`);
            })
            .catch(error => {
                console.error(error);
                snackbar.enqueueSnackbar('Erro ao salvar!', { variant: 'error' });
            })
            .finally(() => setLoading(false));
    }

    return (
        <DefaultForm GridItemProps={{xs: 12, md: 6}} onSubmit={handleSubmit(onSubmit)}>

            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                disabled={loading}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{ shrink: true }}
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
                disabled={loading}
                inputRef={register}
                InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
                disabled={loading}
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

            <SubmitActions disabledButtons={loading} handleSave={() =>
                trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null)
                })
            }></SubmitActions>

        </DefaultForm>
    )
}

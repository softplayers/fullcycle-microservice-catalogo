// @flow 
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router';
import SubmitActions from '../../components/SubmitActions';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember } from '../../util/models';
import * as yup from '../../util/vendor/yup';

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .label('Nome')
        .required()
})

interface IFormInputs {
    name: string
    type: number
}

export const Form = () => {
    const history = useHistory();
    const snackbar = useSnackbar();

    const { register, handleSubmit, getValues, setValue, errors, reset, watch, trigger } = useForm<IFormInputs>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            type: 1
        }
    });

    const { id } = useParams<any>();
    const [castMember, setCastMember] = React.useState<CastMember | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!id) return;
        setLoading(true);

        castMemberHttp
            .get(id)
            .then(({ data }) => {
                setCastMember(data.data);
                reset(data.data);
            })
            .finally(() => setLoading(false));
    }, [id, reset]);

    React.useEffect(() => {
        register({ name: 'type' });
    }, [register]);

    const handleRadio = (event) => {
        console.log(event);
        setValue('type', parseInt(event.target.value));
    };
    const onSubmit = (data, event) => {
        console.log(data, event);
        setLoading(true);

        const http = castMember
            ? castMemberHttp.update(castMember.id, data)
            : castMemberHttp.create(data);

        http
            .then(({ data }) => {
                const hasEvent = !!event;
                snackbar.enqueueSnackbar('Membro de elenco salvo com sucesso!', { variant: 'success' });

                if (!hasEvent) {
                    history.push(`/cast_members`);
                    return;
                }

                if (id) {
                    history.replace(`/cast_members/${data.data.id}/edit`)
                    return;
                }

                history.push(`/cast_members/${data.data.id}/edit`);
            })
            .catch(error => {
                console.error(error);
                snackbar.enqueueSnackbar('Erro ao salvar!', { variant: 'error' });
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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

            <FormControlLabel
                disabled={loading}
                control={
                    <RadioGroup
                        name="type"
                        value={watch('type')}
                        onChange={handleRadio}>
                        <FormControlLabel value={1} control={<Radio />} label="Diretor" disabled={loading} />
                        <FormControlLabel value={2} control={<Radio />} label="Ator" disabled={loading} />
                    </RadioGroup>
                }
                label="Tipo"
                labelPlacement="top"
            />

            <SubmitActions disabledButtons={loading} handleSave={() =>
                trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null)
                })
            }></SubmitActions>
        </form>
    )
}

// @flow
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  Box, Button, ButtonProps,
  Checkbox, makeStyles, TextField,
  Theme, Select, MenuItem,
  FormControlLabel
} from "@material-ui/core";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";
import * as yup from '../../util/vendor/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
    },
  };
});

interface Category {
  id: string;
  name: string;
}

interface Genre {
  name: string,
  is_active: boolean,
  categories: Category[],
}

const validationSchema = yup.object().shape({
  name: yup
      .string()
      .label('Nome')
      .required(),
})

export const Form = () => {
  const classes = useStyles();
  const history = useHistory();
  const snackbar = useSnackbar();

  const { register, handleSubmit, getValues, setValue, errors, reset, watch } = useForm<Genre>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
        is_active: true,
    }
  });


  const { id } = useParams<any>();
  const [genre, setGenre] = React.useState<{ id: string } | null>(null);
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([] as Category[]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: "contained",
    disabled: loading,
  };

  React.useEffect(() => {
    console.log('[Genre] useEffect start');
    setLoading(true);

    categoryHttp
        .list<{data: Category[]}>()
        .then(response => setAllCategories(response.data.data));

    if (!id) {
      console.log('[Genre] useEffect start .. no id');
      setLoading(false);
      return;
    };

    console.log('[Genre] useEffect start .. id:', id);

    genreHttp
      .get(id)
      .then(({ data }) => {
        console.log('[Genre] useEffect start .. id .. data:', data);
        setGenre(data.data);
        const categories_id = data.data.categories.map(c => c.id);
        setSelectedCategories(categories_id);
        reset(data.data);
      })
      .finally(() => setLoading(false));

  }, []);  

  React.useEffect(() => {
    register({ name: 'is_active' });
  }, [register]);

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  const onSubmit = (data, event) => {
    console.log('[Genre] onSubmit');
    const data_categories = {...data, categories_id: selectedCategories}
    console.log(data_categories, event);
    setLoading(true);

    const http = genre
        ? genreHttp.update(genre.id, data_categories)
        : genreHttp.create(data_categories);

    http
        .then(({ data }) => {
          console.log('[Genre] onSubmit .. data:', data);
            snackbar.enqueueSnackbar('Gënero salvo com sucesso!', { variant: 'success' });

            setTimeout(() => {
              if (!event) {
                history.push(`/genres`);
                return;
              }

              if (id) {
                history.replace(`/genres/${data.data.id}/edit`)
                return;
              }
              
              history.push(`/genres`);
            })
        })
        .catch(error => {
            console.error(error);
            snackbar.enqueueSnackbar('Erro ao salvar!', { variant: 'error' });
        })
        .finally(() => setLoading(false));
  };

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
        errors.name?.message &&
        (<p>{errors.name?.message}</p>)
      }

      <Select
        name="category_id"
        label="Categorias"
        variant={"outlined"}
        value={selectedCategories}
        onChange={handleCategoryChange}
        disabled={loading}
        fullWidth
        multiple>
          <MenuItem value="" disabled>
            Selecione as categorias
          </MenuItem>
          {allCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
          ))}
      </Select>

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

      <Box dir={"rtl"}>
        <Button
          {...buttonProps}
          type="button"
          color="primary"
          onClick={() => onSubmit(getValues(), null)}
        >
          Salvar
        </Button>
        <Button {...buttonProps} type="submit">
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};

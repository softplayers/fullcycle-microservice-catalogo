// @flow
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  Box, Button, ButtonProps,
  Checkbox, makeStyles, TextField,
  Theme, Select, MenuItem
} from "@material-ui/core";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";

interface Category {
  id: string;
  name: string;
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const classes = useStyles();

  let categories: Category[] = [
    {id:'0', name:'Teste'}
  ];
  categoryHttp.list<{data: Category[]}>().then(response => {
    categories = response.data.data;
  });

  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: "outlined",
  };

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      is_active: true,
    },
  });

  const onSubmit = (data, event) => {
    console.log(data, event);
    genreHttp.create(data).then((response) => console.log(response));
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
      <Select
        name="category_id"
        label="Categorias"
        fullWidth
        multiple
        inputRef={register}>
          {categories.map(category => (
              <MenuItem key={category.id}>
                {category.name}
              </MenuItem>
          ))}
      </Select>
      <Checkbox name="is_active" inputRef={register} defaultChecked />
      Ativo?
      <Box dir={"rtl"}>
        <Button
          {...buttonProps}
          type="button"
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

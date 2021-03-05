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
    formControl: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const classes = useStyles();

  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
      categoryHttp
        .list<{data: Category[]}>()
        .then(response => setAllCategories(response.data.data));
  }, []);  

  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: "outlined",
  };

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      is_active: true,
    },
  });

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  const onSubmit = (data, event) => {
    genreHttp
      .create({...data, categories_id: selectedCategories})
      .then((response) => console.log(response));
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
        variant={"outlined"}
        value={selectedCategories}
        onChange={handleCategoryChange}
        fullWidth
        multiple>
          {allCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
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

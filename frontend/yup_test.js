// import * as yup from 'yup';
const yup = require('yup')

/* const schema = yup.object().shape({
  name: yup.string().required(),
  num: yup.number(),
})

let obj = {name: 'aaaaaa', num: 'aaa'}
 */
// console.log('cast:', schema.cast(obj));
/* 
schema
  .isValid()
  .then(isValid => console.log(isValid))


  schema.validate(obj)
    .then(values => console.log(values))
    .catch(errors => console.warn(errors)) */;
const columns = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false
    }
  },
  {
    name: "name",
    label: "Nome",
    width: "40%",
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: "5%"
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%"
  },
  {
    name: "actions",
    label: "Ações",
    width: "15%",
  },
]

const schema = yup.object().shape({
  search: yup
    .string()
    .transform(value => !value ? undefined : value)
    .default(''),

  pagination: yup.object().shape({
    page: yup
      .number()
      .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
      .default(1),

    per_page: yup
      .number()
      .oneOf([10, 15, 100])
      .transform(value => isNaN(value) ? undefined : value)
      .default(15),
  }),

  order: yup.object().shape({
    sort: yup
      .string()
      .nullable()
      .transform(value => {
        const colNames = columns
          .filter(col => !col.options || col.options.sort !== false)
          .map(col => col.name);
        return colNames.includes(value) ? value : undefined;
      })
      .default(null),
      
    dir: yup
      .string()
      .nullable()
      .transform(value => !value || !['asc', 'desc'].includes(value.toLowerCase()) ? undefined : value)
      .default(null),
  }),
})

console.log(schema.cast({
  pagination: {
    page: {
      page: 0
    }
  }
}))
/*let obj = { name: 'aaaaaa', num: 'aaa' }*/

// import * as yup from 'yup';
const yup = require('yup')

const schema = yup.object().shape({
  name: yup.string().required(),
  num: yup.number(),
})

let obj = {name: 'aaaaaa', num: 'aaa'}

// console.log('cast:', schema.cast(obj));

schema
  .isValid()
  .then(isValid => console.log(isValid))


  schema.validate(obj)
    .then(values => console.log(values))
    .catch(errors => console.warn(errors));

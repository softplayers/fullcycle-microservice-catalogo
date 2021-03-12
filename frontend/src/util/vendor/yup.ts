import { setLocale } from 'yup';

const ptBR = {
  mixed: {
    required: '${path} é obrigatório',
  },
  string: {
    max: '${path} precisa ter no máximo ${max} caracteres',
  },
  number: {
    min: '${path} precisa ter no máximo ${min}',
  },
};

setLocale(ptBR);

export * from 'yup';

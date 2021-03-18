// @flow 
import * as React from 'react';
import { useParams } from 'react-router';
import { Page } from '../../components/Page';
import { Form } from './Form';

type Props = {
    
};

const PageForm = (props: Props) => {
    const {id} = useParams<any>();

    return (
        <Page title={id ? 'Editar gênero' : 'Criar gênero'}>
            <Form/>
        </Page>
    );
};

export default PageForm;

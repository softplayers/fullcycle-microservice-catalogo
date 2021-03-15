// @flow 
import * as React from 'react';
import { useParams } from 'react-router';
import { Page } from '../../components/Page';
import { Form } from './Form';

type Props = {
    
};

const List = (props: Props) => {
    const {id} = useParams<any>();
    return (
        <Page title={id ? 'Editar categoria' : 'Criar categoria'}>
            <Form/>
        </Page>
    );
};

export default List;
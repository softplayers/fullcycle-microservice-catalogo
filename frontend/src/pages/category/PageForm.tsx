// @flow 
import * as React from 'react';
import { Page } from '../../components/Page';
import { Form } from './Form';

type Props = {
    
};

const List = (props: Props) => {
    return (
        <Page title='Criar categoria'>
            <Form/>
        </Page>
    );
};

export default List;
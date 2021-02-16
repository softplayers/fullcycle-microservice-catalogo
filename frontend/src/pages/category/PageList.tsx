// @flow 
import {Box, Fab} from '@material-ui/core';
import * as React from 'react';
import { Page } from '../../components/Page';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';

type Props = {
    
};

const List = (props: Props) => {
    return (
        <Page title='Listagem de Categoria'>
            <Box dir={'rtl'}>
                <Fab 
                    title="Adicionar categoria"
                    size="small"
                    component={Link}
                    to="/categories/create">
                        <AddIcon/>
                </Fab>
            </Box>
        </Page>
    );
};

export default List;
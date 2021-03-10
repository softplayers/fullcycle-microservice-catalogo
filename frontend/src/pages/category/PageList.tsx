// @flow 
import {Box, Fab} from '@material-ui/core';
import * as React from 'react';
import { Page } from '../../components/Page';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';
import Table from './Table';

type Props = {
    
};

const List = (props: Props) => {
    return (
        <Page title='Listagem de Categoria'>
            <Box dir={'rtl'} paddingBottom={2}>
                <Fab 
                    title="Adicionar categoria"
                    size="small"
                    color="secondary"
                    component={Link}
                    to="/categories/create">
                        <AddIcon/>
                </Fab>
            </Box>
            <Box>
                <Table />
            </Box>
        </Page>
    );
};

export default List;
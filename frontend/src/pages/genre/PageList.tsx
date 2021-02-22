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
        <Page title='Listagem de Gêneros'>
            <Table/>
            <Box dir={'rtl'}>
                <Fab 
                    title="Adicionar gênero"
                    size="small"
                    component={Link}
                    to="/genres/create">
                        <AddIcon/>
                </Fab>
            </Box>
        </Page>
    );
};

export default List;
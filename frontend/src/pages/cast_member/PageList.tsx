// @flow 
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';
import Table from './Table';

type Props = {

};

const List = (props: Props) => {
    return (
        <Page title='Listagem de Membros do Elenco'>
            <Table />
            <Box dir={'rtl'}>
                <Fab
                    title="Adicionar Membro de Elenco"
                    size="small"
                    component={Link}
                    to="/cast_members/create">
                    <AddIcon />
                </Fab>
            </Box>
        </Page>
    );
};

export default List;
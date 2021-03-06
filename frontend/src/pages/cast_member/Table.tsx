// @flow 
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables';
import * as React from 'react';
import {httpVideo} from '../../util/http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "type",
        label: "Tipo",
        options: {
            customBodyRender(value) {
                return value == 1 ? "Diretor" : "Ator"
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
]

/* const data = [
    {name: 'teste1', is_active: true, created_at: "2021-02-17"},
    {name: 'teste2', is_active: true, created_at: "2021-02-18"},
    {name: 'teste3', is_active: true, created_at: "2021-02-19"},
    {name: 'teste4', is_active: true, created_at: "2021-02-20"},
    {name: 'teste5', is_active: true, created_at: "2021-02-21"},
    {name: 'teste6', is_active: true, created_at: "2021-02-22"},
]
 */
type Props = {};

const Table = (props: Props) => {

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        httpVideo.get('cast_members').then(
            response => setData(response.data.data)
        );
    }, []);

    return (
        <MUIDataTable 
            title="Listagem de membros do elenco"
            columns={columnsDefinition}
            data={data}>
        </MUIDataTable>
    );
};

export default Table;

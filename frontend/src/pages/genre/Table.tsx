// @flow 
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables';
import * as React from 'react';
import {httpVideo} from '../../util/http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {BadgeYes, BadgeNo} from '../../components/Badge';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "categories",
        label: "Categorias",
        options: {
            customBodyRender(value: any[]) {
                return value.map((v: any) => v.name).join(', ');
            }
        }
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value) {
                return value ? <BadgeYes /> : <BadgeNo />
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

type Props = {};

const Table = (props: Props) => {

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        httpVideo.get('genres').then(
            response => setData(response.data.data)
        );
    }, []);

    return (
        <MUIDataTable 
            title="Listagem de gêneros"
            columns={columnsDefinition}
            data={data}>
        </MUIDataTable>
    );
};

export default Table;

// @flow 
import * as React from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import {BadgeYes, BadgeNo} from '../../components/Badge';
import {Category} from '../../util/models';
import CustomTable, { TableColumn } from '../../components/Table';

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "30%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "40%",
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: "5%",
        options: {
            customBodyRender(value) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        },
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "10%",
        options: {
            customBodyRender(value) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: "actions",
        label: "Ações",
        width: "15%",
    },
]

type Props = {};

const Table = (props: Props) => {

    const [data, setData] = React.useState<Category[]>([]);

    React.useEffect(() => {
        let isSubscribed = true;

        categoryHttp.list<{data: Category[]}>()
            .then(({data}) => isSubscribed && setData(data.data));

        return () => {
            isSubscribed = false
        };
    }, []);

    return (
        <CustomTable 
            title="Listagem de categorias"
            columns={columnsDefinition}
            data={data}>
        </CustomTable>
    );
};

export default Table;

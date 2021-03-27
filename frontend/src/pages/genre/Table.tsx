// @flow 
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import CustomTable, { TableColumn } from '../../components/Table';
import genreHttp from '../../util/http/category-http';
import { Genre } from '../../util/models';

const columnsDefinition: TableColumn[] = [
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "categories",
        label: "Categorias",
        options: {
            customBodyRender(value: any[]) {
                if(!value) {
                    return '';
                }
                
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

    const snackbar = useSnackbar();
    const [data, setData] = React.useState<Genre[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true);

            try {
                const { data } = await genreHttp.list<{ data: Genre[] }>();
                if (isSubscribed) {
                    setData(data.data);
                }
            }
            catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar('Não foi possivel carregar as informações', { variant: 'error' })
            }
            finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false
        };
    }, []);


    return (
        <CustomTable
            title="Listagem de gêneros"
            columns={columnsDefinition}
            data={data}
            loading={loading}>
        </CustomTable>
    );
};

export default Table;

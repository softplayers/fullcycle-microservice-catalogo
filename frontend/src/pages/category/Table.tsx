// @flow 
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import CustomTable, { makeActionStyles, TableColumn } from '../../components/Table';
import categoryHttp from '../../util/http/category-http';
import { Category } from '../../util/models';

interface SearchState {
    search: string;
}

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
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color='secondary'
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon></EditIcon>
                    </IconButton>
                )
            }
        }
    },
]

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = React.useRef(true);
    const [data, setData] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [searchState, setSearchState] = React.useState<SearchState>({ search: 'aaaa' });

    React.useEffect(() => {
        subscribed.current = true;

        (async () => {
            getData();
        })();

        return () => {
            subscribed.current = false;
        };
    }, [snackbar]);

    React.useEffect(() => {
        subscribed.current = true;

        getData();

        return () => {
            subscribed.current = false;
        };
    }, [searchState, snackbar]);

    async function getData() {
        setLoading(true);

        try {
            const { data } = await categoryHttp.list<{ data: Category[] }>({ queryParams: { search: searchState.search} });
            if (subscribed.current) {
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
    }
    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <CustomTable
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{
                    searchText: searchState.search,
                    onSearchChange: (value) => setSearchState({ search: value || '' })
                }}>
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

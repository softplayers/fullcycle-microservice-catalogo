// @flow 
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import CustomTable, { makeActionStyles, TableColumn } from '../../components/Table';
import genreHttp from '../../util/http/genre-http';
import { Genre } from '../../util/models';
import EditIcon from '@material-ui/icons/Edit';

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "25%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "25%",
    },
    {
        name: "categories",
        label: "Categorias",
        width: "25%",
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
        width: "10%",
        options: {
            customBodyRender(value) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        }
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
        width: "5%",
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                console.log(tableMeta);

                return (
                    <IconButton
                        color='secondary'
                        component={Link}
                        to={`/genres/${tableMeta.rowData[0]}/edit`}
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
    }, [snackbar]);


    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
            <CustomTable
                title="Listagem de gêneros"
                columns={columnsDefinition}
                data={data}
                loading={loading}>
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

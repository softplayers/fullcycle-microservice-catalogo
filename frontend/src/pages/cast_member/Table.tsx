// @flow 
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import CustomTable, { makeActionStyles, TableColumn } from '../../components/Table';
import { httpVideo } from '../../util/http';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember } from '../../util/models';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
        width: "35%",
    },
    {
        name: "type",
        label: "Tipo",
        width: "10%",
        options: {
            customBodyRender(value) {
                return value === 1 ? "Diretor" : "Ator"
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
        width: "15%",
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color='secondary'
                        component={Link}
                        to={`/cast_members/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon></EditIcon>
                    </IconButton>
                )
            }
        }
    },

]

type Props = {};

const Table = (props: Props) => {

    const snackbar = useSnackbar();
    const [data, setData] = React.useState<CastMember[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true);

            try {
                const { data } = await castMemberHttp.list<{ data: CastMember[] }>();
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
                title="Listagem de membros do elenco"
                columns={columnsDefinition}
                data={data}
                loading={loading}>
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

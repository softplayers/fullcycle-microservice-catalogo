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
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { Creators } from '../../store/filter';
import categoryHttp from '../../util/http/category-http';
import { Category, ListResponse } from '../../util/models';
import useFilter from '../../hooks/useFilter';

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

const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = React.useRef(true);
    const [data, setData] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords,
    } = useFilter({
        columns: columnsDefinition,
        rowsPerPage: rowsPerPage,
        rowsPerPageOptions: rowsPerPageOptions,
        debounceTime: debounceTime
    });
    // const [searchState, setSearchState] = React.useState<SearchState>(initialState);

    React.useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();

        return () => {
            subscribed.current = false;
        };
    }, [
        debouncedFilterState.search,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
    ]);

    async function getData() {
        setLoading(true);

        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: filterState.search,
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }
        }
        catch (error) {
            console.error(error);

            if (categoryHttp.isCancelledRequest(error)) {
                return;
            }

            snackbar.enqueueSnackbar('Não foi possivel carregar as informações', { variant: 'error' })
        }
        finally {
            setLoading(false);
        }
    }

    const customToolbar = () => (
        <FilterResetButton onClick={() => {
            dispatch(Creators.setReset());
        }} />);

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <CustomTable
                title="Listagem de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debounceSearchTime}
                options={{
                    serverSide: true,
                    searchText: filterState.search,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    count: totalRecords,
                    customToolbar,
                    onSearchChange: filterManager.onSearchChange,
                    onChangePage: filterManager.onChangePage,
                    onChangeRowsPerPage: filterManager.onChangeRowsPerPage,
                    onColumnSortChange: filterManager.onColumnSortChange
                }}>
            </CustomTable>
        </MuiThemeProvider >
    );
};

export default Table;

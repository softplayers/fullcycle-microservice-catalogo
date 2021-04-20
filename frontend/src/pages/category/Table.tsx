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
import { Category, ListResponse } from '../../util/models';
import axios from 'axios';
import { FilterResetButton } from '../../components/Table/FilterResetButton';

interface Pagination {
    page: number;
    total: number;
    per_page: number;
}

interface Order {
    sort: string | null;
    dir: string | null;
}

interface SearchState {
    search: string;
    pagination: Pagination;
    order: Order;
}

const INITIAL_STATE = {
    search: '',
    pagination: {
        page: 1,
        total: 0,
        per_page: 10,
    },
    order: {
        sort: null,
        dir: null,
    }
};


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

function reducer(state, action) {
    switch(action.type) {
        case 'search':
            return {
                ...state,
                search: action.search,
                pagination: {
                    ...state.pagination,
                    page: 1,
                }
            };
        case 'page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.page,
                }
            };
        case 'per_page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    per_page: action.per_page,
                }
            };
        case 'order':
            return {
                ...state,
                order: {
                    sort: action.sort,
                    dir: action.dir,
                }
            };
        case 'reset': //fall-through
        default:
            return INITIAL_STATE;
    }
}

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = React.useRef(true);
    const [data, setData] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [searchState, dispatch] = React.useReducer(reducer, INITIAL_STATE);
    // const [searchState, setSearchState] = React.useState<SearchState>(initialState);

    React.useEffect(() => {
        subscribed.current = true;

        getData();

        return () => {
            subscribed.current = false;
        };
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.per_page,
        searchState.order,
    ]);

    async function getData() {
        setLoading(true);

        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: cleanSearchText(searchState.search),
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.per_page,
                    sort: searchState.order.sort,
                    dir: searchState.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
                /*
                setSearchState(prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        total: data.meta.total
                    }
                }))
                */
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

    function cleanSearchText(text) {
        if (text && text.value !== undefined) {
            return text.value;
        }
        return text;
    }

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <CustomTable
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                debouncedSearchTime={500}
                options={{
                    serverSide: true,
                    searchText: searchState.search,
                    page: searchState.pagination.page - 1,
                    rowsPerPage: searchState.pagination.per_page,
                    count: searchState.pagination.total,
                    customToolbar: () => (
                        <FilterResetButton onClick={() => dispatch({type: 'reset'})} />
                    ),
                    onSearchChange: (search) => dispatch({type: 'search', search}),
                    onChangePage: (page) => dispatch({type: 'page', page: page + 1}),
                    onChangeRowsPerPage: (perPage) => dispatch({type: 'per_page', per_page: perPage}),
                    onColumnSortChange: (changedColumn, dir) => dispatch({type: 'order', sort: changedColumn, dir}),
                }}>
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

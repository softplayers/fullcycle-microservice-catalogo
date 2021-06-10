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
import useFilter from '../../hooks/useFilter';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { Creators } from '../../store/filter';
import * as yup from "../../util/vendor/yup";

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

const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const extraFilter = {
    createValidationSchema: () => {
        return yup.object().shape({
            categories: yup.mixed()
                .nullable()
                .transform(value => {
                    return !value ? undefined : value.split(',');
                })
                .default(null),
        })
    },
    formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter ? {
            ...(
                debouncedState.extraFilter.categories &&
                {categories: debouncedState.extraFilter.categories.join(',')}
            )
        } : undefined
    },
    getStateFromURL: (queryParams) => {
        return {
            categories: queryParams.get('categories')
        }
    }
};

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = React.useRef(true);
    const [data, setData] = React.useState<Genre[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const tableRef = null;

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
        debounceTime,
        rowsPerPage,
        rowsPerPageOptions,
        // tableRef,
        extraFilter,
    });
    // const [searchState, setSearchState] = React.useState<SearchState>(initialState);
    
    React.useEffect(() => {
        subscribed.current = true;

        getData();
        
        return () => {
            subscribed.current = false;
        };
    }, [
        debouncedFilterState.search,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        JSON.stringify(debouncedFilterState.extraFilter)
    ]);

    async function getData() {
        setLoading(true);

        try {
            const { data } = await genreHttp.list<{ data: Genre[] }>({
                queryParams: {
                    search: debouncedFilterState.search,
                    page: debouncedFilterState.pagination.page,
                    per_page: debouncedFilterState.pagination.per_page,
                    sort: debouncedFilterState.order.sort,
                    dir: debouncedFilterState.order.dir,
                    ...(
                        debouncedFilterState.extraFilter &&
                        debouncedFilterState.extraFilter.categories &&
                        {categories: debouncedFilterState.extraFilter.categories.join(',')}
                    )
                }
            });
            if (subscribed.current) {
                setData(data.data);
                // setTotalRecords(data.meta.total);
            }            
        }
        catch (error) {
            console.error(error);
            if (genreHttp.isCancelledRequest(error)) {
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
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
            <CustomTable
                title="Listagem de gêneros"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                debouncedSearchTime={debounceSearchTime}
                options={{
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
                    customToolbar,
                    onSearchChange: filterManager.onSearchChange,
                    onChangePage: filterManager.onChangePage,
                    onChangeRowsPerPage: filterManager.onChangeRowsPerPage,
                    onColumnSortChange: filterManager.onColumnSortChange,
                }}
                >
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

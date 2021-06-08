// @flow 
import { Creators } from '../../store/filter';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Link } from 'react-router-dom';
import CustomTable, { makeActionStyles, TableColumn } from '../../components/Table';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember, CastMemberTypeMap, ListResponse } from '../../util/models';
import useFilter from "../../hooks/useFilter";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import * as yup from "../../util/vendor/yup";
import { invert } from "lodash";
const castMemberNames = Object.values(CastMemberTypeMap);

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

];

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const extraFilter = {
    createValidationSchema: () => {
        return yup.object().shape({
            type: yup
                .string()
                .nullable()
                .transform((value) => {
                    return !value || !castMemberNames.includes(value)
                        ? undefined
                        : value;
                })
                .default(null),
        });
    },
    formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
            ? {
                ...(debouncedState.extraFilter.type && {
                    type: debouncedState.extraFilter.type,
                }),
            }
            : undefined;
    },
    getStateFromURL: (queryParams) => {
        return {
            type: queryParams.get("type"),
        };
    },
}

const Table = () => {

    const { enqueueSnackbar } = useSnackbar();
    const subscribed = React.useRef(true);
    const [data, setData] = React.useState<CastMember[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const tableRef = React.useRef() as React.MutableRefObject<any>;

    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords,
        dispatch
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debounceTime,
        rowsPerPage,
        rowsPerPageOptions,
        extraFilter,
    });


    const getData = React.useCallback(
        async ({ search, page, per_page, sort, dir, type }) => {
            setLoading(true);

            try {
                const { data } = await castMemberHttp.list<ListResponse<CastMember>>({
                    queryParams: {
                        search,
                        page,
                        per_page,
                        sort,
                        dir,
                        ...(type && {
                            type: invert(CastMemberTypeMap)[type],
                        }),
                    },
                });

                if (subscribed.current) {
                    setData(data.data);
                    setTotalRecords(data.meta.total);
                }
            }
            catch (error) {
                console.error(error);

                if (castMemberHttp.isCancelledRequest(error)) {
                    return;
                }

                enqueueSnackbar('Não foi possivel carregar as informações', { variant: 'error' })
            }
            finally {
                setLoading(false);
            }
        },
        [enqueueSnackbar, setTotalRecords]
    );

    React.useEffect(() => {
        subscribed.current = true;

        getData({
            search: debouncedFilterState.search,
            page: debouncedFilterState.pagination.page,
            per_page: debouncedFilterState.pagination.per_page,
            sort: debouncedFilterState.order.sort,
            dir: debouncedFilterState.order.dir,
            ...(debouncedFilterState.extraFilter &&
                debouncedFilterState.extraFilter.type && {
                type: debouncedFilterState.extraFilter.type,
            }),
        });

        return () => {
            subscribed.current = false
        };

    }, [getData,
        debouncedFilterState.search,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        debouncedFilterState.extraFilter,]);


    const customToolbar = () => (
        <FilterResetButton onClick={() => dispatch(Creators.setReset())} />);

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <CustomTable
                title="Listagem de membros do elenco"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                options={{
                    serverSide: true,
                    searchText: filterState.search,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions: rowsPerPageOptions,
                    count: totalRecords,
                    customToolbar,
                    onSearchChange: filterManager.onSearchChange,
                    onChangePage: filterManager.onChangePage,
                    onChangeRowsPerPage: filterManager.onChangeRowsPerPage,
                    onColumnSortChange: filterManager.onColumnSortChange
                }}
            >
            </CustomTable>
        </MuiThemeProvider>
    );
};

export default Table;

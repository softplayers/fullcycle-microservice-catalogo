import { MUIDataTableColumn } from 'mui-datatables';
import React, { Dispatch, Reducer } from 'react';
import reducer, { Creators, INITIAL_STATE } from '../store/filter';
import { Actions as FilterActions, State as FilterState } from '../store/filter/types';
import { useDebounce } from 'use-debounce';
import { useHistory } from 'react-router';
import { History } from 'history';
import * as _ from 'lodash';
import { isEqual } from 'lodash';

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
}

interface UseFilterOptions extends Omit<FilterManagerOptions, 'history'> {

}

export default function useFilter(options: UseFilterOptions) {
  console.log('[hook::useFilter]')

  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });

  // TODO: pegar state da url

  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [filterState, dispatch] = React.useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);

  filterManager.state = filterState;
  filterManager.dispatch = dispatch;

  filterManager.applyOrderInColumns();

  return {
    columns: filterManager.columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  }

}

export class FilterManager {

  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  history: History;

  constructor(options: FilterManagerOptions) {
    const { columns, rowsPerPage, rowsPerPageOptions, history } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
  }

  onSearchChange = (search: any) => this.dispatch(Creators.setSearch({ search }));

  onChangePage = (page) => this.dispatch(Creators.setPage({ page: page + 1 }));

  onChangeRowsPerPage = (per_page) => this.dispatch(Creators.setPerPage({ per_page }));

  onColumnSortChange = (sort, dir) => this.dispatch(Creators.setOrder({ sort, dir }));

  applyOrderInColumns = () => {
    this.columns = this.columns.map(column => {

      if (column.name !== this.state.order.sort) {
        return column;
      }

      return {
        ...column,
        options: {
          ...column.options,
          sortDirection: this.state.order.dir as any
        }
      }

    })
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: '?' + new URLSearchParams(this.formartSearchParams() as any),
      state: { ...this.state },
    }

    const oldState = this.history.location.state;
    const nextState = this.state;

    if (isEqual(oldState, nextState)) {
      return;
    }

    this.history.push(newLocation);
  }

  formartSearchParams() {
    const { search, pagination, order } = this.state;
    const { page, per_page } = pagination;
    const { sort, dir } = order;

    return {
      ...(search && { search }),
      ...(page !== 1 && { page }),
      ...(per_page !== 15 && { per_page }),
      ...(sort && { sort, dir }),
    }
  }
}

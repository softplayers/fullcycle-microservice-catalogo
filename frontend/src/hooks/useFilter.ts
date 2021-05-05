import { MUIDataTableColumn } from 'mui-datatables';
import React, { Dispatch, Reducer } from 'react';
import reducer, { Creators, INITIAL_STATE } from '../store/filter';
import { Actions as FilterActions, State as FilterState } from '../store/filter/types';
import {useDebounce} from 'use-debounce';
import {useHistory} from 'react-router';
import {History} from 'history';

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
  const filterManager = new FilterManager({...options, history});

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
    const {columns, rowsPerPage, rowsPerPageOptions, history} = options;
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
      pathname: '',
      search: '',
      state: '',
    }
    this.history.push(newLocation);
  }
}

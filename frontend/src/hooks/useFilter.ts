import { MUIDataTableColumn } from 'mui-datatables';
import React, { Dispatch, Reducer } from 'react';
import reducer, { Creators, INITIAL_STATE } from '../store/filter';
import { Actions as FilterActions, State as FilterState } from '../store/filter/types';

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
}

export default function useFilter(options: FilterManagerOptions) {
  console.log('[hook::useFilter]')

  const filterManager = new FilterManager(options);

  // TODO: pegar state da url

  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [filterState, dispatch] = React.useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);

  filterManager.state = filterState;
  filterManager.dispatch = dispatch;

  filterManager.applyOrderInColumns();

  return {
    columns: filterManager.columns,
    filterManager,
    filterState,
    dispatch,
    totalRecords,
    setTotalRecords,
    debounceTime: filterManager.debounceTime
  }

}

export class FilterManager {

  state: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;

  constructor(options: FilterManagerOptions) {
    this.columns = options.columns;
    this.rowsPerPage = options.rowsPerPage;
    this.rowsPerPageOptions = options.rowsPerPageOptions;
    this.debounceTime = options.debounceTime;
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
}

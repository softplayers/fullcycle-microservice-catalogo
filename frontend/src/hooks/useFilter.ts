import { MUIDataTableColumn } from 'mui-datatables';
import React, { Dispatch, Reducer } from 'react';
import reducer, { INITIAL_STATE } from '../store/filter';
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

  return {
    filterManager,
    filterState,
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
  debounceTime: number;

  constructor(options: FilterManagerOptions) {
    this.columns = options.columns;
    this.rowsPerPage = options.rowsPerPage;
    this.rowsPerPageOptions = options.rowsPerPageOptions;
    this.debounceTime = options.debounceTime;
  }

}

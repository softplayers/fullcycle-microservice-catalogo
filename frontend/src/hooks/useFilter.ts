import { MUIDataTableColumn } from 'mui-datatables';
import React, { Dispatch, Reducer } from 'react';
import reducer, { Creators, INITIAL_STATE } from '../store/filter';
import { Actions as FilterActions, State as FilterState } from '../store/filter/types';
import { useDebounce } from 'use-debounce';
import { useHistory } from 'react-router';
import { History } from 'history';
import * as _ from 'lodash';
import { isEqual } from 'lodash';
import * as yup from '../util/vendor/yup';

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  // tableRef: 
  extraFilter?: ExtraFilter;
}

interface ExtraFilter {
  getStateFromURL: (queryParams: URLSearchParams) => any,
  formatSearchParams: (debouncedState: FilterState) => any,
  createValidationSchema: () => any,
}

interface UseFilterOptions extends Omit<FilterManagerOptions, 'history'> {

}

export default function useFilter(options: UseFilterOptions) {
  console.log('[hook::useFilter]')

  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });

  // TODO: pegar state da url
  const INITIAL_STATE = filterManager.getStateFromURL();

  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [filterState, dispatch] = React.useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);

  filterManager.state = filterState;
  filterManager.debouncedState = debouncedFilterState;
  filterManager.dispatch = dispatch;

  filterManager.applyOrderInColumns();

  React.useEffect(() => {
    filterManager.replaceHistory();
  }, []);

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

  schema;
  state: FilterState = null as any;
  debouncedState: FilterState = null as any;
  dispatch: Dispatch<FilterActions> = null as any;
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  history: History;
  // tableRef:
  extraFilter?: ExtraFilter;

  constructor(options: FilterManagerOptions) {
    const { columns, rowsPerPage, rowsPerPageOptions, history /*, tableRef*/, extraFilter } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    // this.tableRed 
    this.extraFilter = extraFilter;
    this.createValidationSchema();
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

  replaceHistory() {
    console.log('replace history');
    this.history.replace({
      pathname: this.history.location.pathname,
      search: '?' + new URLSearchParams(this.formartSearchParams() as any),
      state: this.debouncedState,
    });
  }

  pushHistory() {
    console.log('push history');
    const newLocation = {
      pathname: this.history.location.pathname,
      search: '?' + new URLSearchParams(this.formartSearchParams() as any),
      state: { ...this.debouncedState },
    }

    const oldState = this.history.location.state;
    const nextState = this.state;

    if (isEqual(oldState, nextState)) {
      console.log('push history :: is equal');
      return;
    }

    this.history.push(newLocation);
  }

  private formartSearchParams() {
    const { search, pagination, order } = this.debouncedState;
    const { page, per_page } = pagination;
    const { sort, dir } = order;

    return {
      ...(search && { search }),
      ...(page !== 1 && { page }),
      ...(per_page !== 15 && { per_page }),
      ...(sort && { sort, dir }),
      ...(this.extraFilter && this.extraFilter?.formatSearchParams(this.debouncedState)),
    }
  }

  getStateFromURL() {
    const queryParams = new URLSearchParams(this.history.location.search.substr(1));
    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        per_page: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      },
      ...(this.extraFilter && 
        {
          extraFilter: this.extraFilter.getStateFromURL(queryParams)
        }
      )
    })
  }

  private createValidationSchema() {
    this.schema = yup.object().shape({
      search: yup
        .string()
        .transform(value => !value ? undefined : value)
        .default(''),
    
      pagination: yup.object().shape({
        page: yup
          .number()
          .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
          .default(1),
    
        per_page: yup
          .number()
          .oneOf(this.rowsPerPageOptions)
          .transform(value => isNaN(value) ? undefined : value)
          .default(this.rowsPerPage),
      }),
    
      order: yup.object().shape({
        sort: yup
          .string()
          .nullable()
          .transform(value => {
            const colNames = this.columns
              .filter(col => !col.options || col.options.sort !== false)
              .map(col => col.name);
            return colNames.includes(value) ? value : undefined;
          })
          .default(null),
          
        dir: yup
          .string()
          .nullable()
          .transform(value => !value || !['asc', 'desc'].includes(value.toLowerCase()) ? undefined : value)
          .default(null),
      }),

      ...(this.extraFilter && 
        {
          extraFilter: this.extraFilter.createValidationSchema()
        }
      )
    })
  }
}

import React from 'react';
import reducer, { INITIAL_STATE } from '../store/filter';

export default function useFilter() {
  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [filterState, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  return {
    filterState,
    dispatch, 
    totalRecords,
    setTotalRecords,
  }

}

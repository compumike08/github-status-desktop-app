import * as types from './actionTypes';

export function paginationStateLoaded(currentPageNum, totalNumPages) {
  return {type: types.PAGINATION_STATE_LOADED, currentPageNum, totalNumPages};
}

export function loadPaginationState(currentPageNum, totalNumPages){
  return function (dispatch){
    dispatch(paginationStateLoaded(currentPageNum, totalNumPages));
  };
}

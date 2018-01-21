import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function paginationReducer(state = initialState.currentPaginationState, action) {
    switch (action.type) {
        case types.PAGINATION_STATE_LOADED: {
            const currentPageNum = parseInt(action.currentPageNum);
            const totalNumPages = parseInt(action.totalNumPages);

            return {
                currentPageNum: currentPageNum,
                totalNumPages: totalNumPages
            };
        }
        default: {
            return state;
        }
    }
}

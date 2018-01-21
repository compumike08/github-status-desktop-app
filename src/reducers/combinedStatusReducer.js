import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function combinedStatusReducer(state = initialState.combinedStatusData, action) {
    switch (action.type) {
        case types.COMBINED_STATUS_LOADED_FOR_BRANCH: {
            return {
                repoId: action.repoId,
                branchName: action.branchName,
                combinedStatus: action.combinedStatus
            };
        }
        default: {
            return state;
        }
    }
}

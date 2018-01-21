import * as types from '../actions/actionTypes';
import initialState from './initialState';
import {deduplicateArray} from '../utils/utilityMethods';

export default function currentStatusesReducer(state = initialState.currentCommitStatusesData, action) {
    switch (action.type) {
        case types.STATUSES_LOADED_FOR_CURRENT_COMMIT: {
            const rawContexts = action.statuses.map(status => {
                return status.context;
            });

            const newStatuses = action.statuses;

            const filteredStatusesByContexts = deduplicateArray(rawContexts).map(contextName => {
                return {
                    contextName: contextName,
                    statuses: newStatuses.filter(newStatus => contextName == newStatus.context)
                };
            });

            return {
                repoId: action.repoId,
                isFromBranch: action.isFromBranch,
                branchName: action.branchName,
                commitSha: action.commitSha,
                statuses: newStatuses,
                contexts: filteredStatusesByContexts
            };
        }
        case types.STATUS_CREATED_FOR_COMMIT: {
            const newStatus = action.newStatus;
            const updatedStatusesArray = Object.assign([], state.statuses, newStatus);

            const rawContexts = updatedStatusesArray.map(status => {
                return status.context;
            });

            const filteredStatusesByContexts = deduplicateArray(rawContexts).map(contextName => {
                return {
                    contextName: contextName,
                    statuses: updatedStatusesArray.filter(updatedStatus => contextName == updatedStatus.context)
                };
            });

            return {
                repoId: state.repoId,
                isFromBranch: state.isFromBranch,
                branchName: state.branchName,
                commitSha: state.commitSha,
                statuses: updatedStatusesArray,
                contexts: filteredStatusesByContexts
            };
        }
        default: {
            return state;
        }
    }
}

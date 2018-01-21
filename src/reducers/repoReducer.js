import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function repoReducer(state = initialState.repos, action) {
    switch (action.type) {
        case types.REPOS_LOADED: {
            return action.repos.map(repo => {
                return {
                    ...repo,
                    branches: null
                };
            });
        }
        case types.BRANCHES_LOADED_FOR_REPO: {
            let newRepo = state.find(filterRepo => filterRepo.name === action.repo.name);
            newRepo.branches = Array.from(action.branches);

            newRepo.branches = newRepo.branches.map(branch => {
                let newBranchObj = {
                    ...branch,
                    commits: null
                };

                return newBranchObj;
            });

            return [
                ...state.filter(filterRepo => filterRepo.name !== action.repo.name),
                Object.assign({}, newRepo)
            ];
        }
        case types.COMMITS_LOADED_FOR_BRANCH: {
            const newRepo = state.find(filterRepo => filterRepo.name === action.repo.name);
            const findBranchIndex = newRepo.branches.findIndex(findBranch => findBranch.name === action.branch.name);
            const rawCommitsArray = Array.from(action.commits);

            newRepo.branches[findBranchIndex].commits = rawCommitsArray.map(commit => {
                return {
                    ...commit
                };
            });

            return [
                ...state.filter(filterRepo => filterRepo.name !== action.repo.name),
                Object.assign({}, newRepo)
            ];
        }
        default: {
            return state;
        }
    }
}

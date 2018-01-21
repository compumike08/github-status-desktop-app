import * as types from './actionTypes';
import GithubAPI from '../api/githubApi';
import {loadPaginationState} from '../actions/paginationActions';
import * as utilityMethods from '../utils/utilityMethods';
import InvalidPageError from '../errors/InvalidPageError';

export function reposLoaded(repos){
  return {type: types.REPOS_LOADED, repos};
}

export function branchesLoadedForRepo(branches, repo){
  return {type: types.BRANCHES_LOADED_FOR_REPO, branches, repo};
}

export function commitsLoadedForBranch(commits, branch, repo){
  return {type: types.COMMITS_LOADED_FOR_BRANCH, commits, branch, repo};
}

export function loadRepos(){
  return function(dispatch, getState) {
    const currentState = getState();
    const GITHUB_ACCOUNT_NAME = currentState.configs.GITHUB_ACCOUNT_NAME;

    return GithubAPI.getReposByOwner(GITHUB_ACCOUNT_NAME).then(repos => {
      dispatch(reposLoaded(repos));
    }).catch(error => {
      //TODO: Improve error handling instead of re-throwing error
      throw(error);
    });

  };
}

export function loadBranchesForRepo(repoName){
  return function(dispatch, getState) {
    const currentState = getState();

    let repo = findRepoByNameFromState(currentState.repos, repoName);

    return GithubAPI.getBranchesInRepo(repo.owner.login, repo.name).then(branches => {
      dispatch(branchesLoadedForRepo(branches, repo));
    }).catch(error => {
      //TODO: Improve error handling instead of re-throwing error
      throw(error);
    });
  };
}

/**
 * Loads specified page of commits for specified branch
 *
 *    Note: If no page number is specified as a parameter, then it will default to page 1.
 *
 * @param {string} branchName - The name of the branch for which to load commits
 * @param {string} repoName - The name of the repository containing the specified branch
 * @param {Number} [pageNum=1] - The page number of paginated commits to load (defaults to 1 if not specified)
 * @return {Function}
 * @throws {InvalidPageError}
 */
export function loadCommitsForBranch(branchName, repoName, pageNum = 1){
  return function(dispatch, getState) {
    const currentState = getState();
    const totalNumPages = currentState.currentPaginationState.totalNumPages;

    let repo = findRepoByNameFromState(currentState.repos, repoName);
    let branch = findBranchByNameFromRepo(repo, branchName);

    let isValidRequestedPageNum = utilityMethods.validateRequestedPageNum(pageNum, totalNumPages);

    if(!isValidRequestedPageNum) {
      return new Promise(() => {
        throw new InvalidPageError();
      });
    }

    return GithubAPI.getCommitsOnBranch(repo.owner.login, repo.name, branch.name, pageNum).then(commitsPageObj => {
      const commitsPageData = commitsPageObj.pageData;
      dispatch(loadPaginationState(commitsPageObj.pageNum, commitsPageObj.totalNumPages));
      dispatch(commitsLoadedForBranch(commitsPageData, branch, repo));
    }).catch(error => {
      //TODO: Improve error handling instead of re-throwing error
      throw(error);
    });
  };
}

function findRepoByNameFromState(currentStateRepos, repoNameToFind){
  let returnRepo = currentStateRepos.find(repo => repo.name == repoNameToFind);

  if ((returnRepo === undefined) || (returnRepo === null)){
    //TODO: Improve error handling for case when repo not found
    throw new Error("FATAL ERROR: Unable to find specified repo in current state", "repoActions.js");
  }

  return returnRepo;
}

function findBranchByNameFromRepo(repoObj, branchNameToFind){
  let returnBranch = repoObj.branches.find(branch => branch.name == branchNameToFind);

  if ((returnBranch === undefined) || (returnBranch === null)){
    //TODO: Improve error handling for case when branch not found
    throw new Error("FATAL ERROR: Unable to find specified branch in repo object", "repoActions.js");
  }

  return returnBranch;
}

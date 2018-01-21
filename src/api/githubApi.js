import * as Octo from 'octonode';
import * as utilityMethods from '../utils/utilityMethods';
import PaginatedResponse from '../data_structures/PaginatedResponse';

let octoClient = Octo.client();

class GithubApi {

  /**
   * Creates new Octonode client instance initialized with the oauth token passed to this method.
   *
   * https://github.com/pksunkara/octonode#build-a-client-from-an-access-token
   *
   * @param {String} token - The oauth token to store in new Octonode client instance.
   * @returns {Promise} A promise which resolves after Octonode client instance is created.
   * @public
   */
  static addTokenToGhApi(token) {
    return new Promise(resolve => {
      octoClient = Octo.client(token);
      // This is required for CORS requests to pass preflight checks using the Octonode library (due to 'request' library used by Octonode)
      octoClient.requestDefaults['withCredentials'] = false;
      resolve();
    });
  }

  /**
   * Removes currently stored GitHub oauth token from Octonode client instance by
   * overwriting current Octonode client instance with a new, empty Octonode client instance.
   *
   * https://github.com/pksunkara/octonode#build-a-client-which-accesses-any-public-information
   *
   * @returns {Promise} A promise which resolves after Octonode client instance is overwritten.
   * @public
   */
  static removeTokenFromGhApi() {
    return new Promise((resolve) => {
      octoClient = Octo.client();
      resolve();
    });
  }

  /**
   * Gets the user object for the currently logged in user.
   *
   * https://developer.github.com/v3/users/#get-the-authenticated-user
   *
   * @returns {Promise} A promise which resolves to a user object, or rejects with a String error message.
   * @public
   */
  static getAuthenticatedUser() {
    return new Promise((resolve, reject) => {
      let octoMe = octoClient.me();
      let cb = cbFactory(resolve, reject);

      octoMe.info(cb);
    });
  }

  /**
   * Gets a list of repositories owned and/or contributed to by the currently logged in user.
   *
   * https://developer.github.com/v3/repos/#list-your-repositories
   *
   * @returns {Promise} A promise which resolves to a list of repository objects, or rejects with a String error message.
   * @public
   */
  static getCurrentUserAllRepos() {
    return new Promise((resolve, reject) => {
      let octoMe = octoClient.me();
      let cb = cbFactory(resolve, reject);

      octoMe.repos(cb);
    });
  }

  /**
   * Gets a list of repositories owned by specified owner login.
   *
   * https://developer.github.com/v3/repos/#list-user-repositories
   *
   * @param {String} ownerLogin - The GitHub owner login name for which to get owned repos.
   * @returns {Promise} A promise which resolves to a list of repository objects, or rejects with a String error message.
   * @public
   */
  static getReposByOwner(ownerLogin) {
    return new Promise((resolve, reject) => {
      let octoUser = octoClient.user(ownerLogin);
      let cb = cbFactory(resolve, reject);

      octoUser.repos(cb);
    });
  }

  /**
   * Gets a list of branches in the specified repo.
   *
   * https://developer.github.com/v3/repos/branches/#list-branches
   *
   * @param {String} ownerLogin - The GitHub owner login name of the owner of the repo.
   * @param {String} repoName - The name of the repo.
   * @returns {Promise} A promise which resolves to a list of branch objects, or rejects with a String error message.
   * @public
   */
  static getBranchesInRepo(ownerLogin, repoName) {
    return new Promise((resolve, reject) => {
      let repoFullName = ownerLogin + "/" + repoName;
      let octoRepo = octoClient.repo(repoFullName);
      let cb = cbFactory(resolve, reject);

      octoRepo.branches(cb);
    });
  }

  /**
   * Gets a list of commits on the specified branch in the specified repo.
   *
   * https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
   *
   * @param {String} ownerLogin - The GitHub owner login name of the owner of the repo.
   * @param {String} repoName - The name of the repo.
   * @param {String} branchName - The name of the branch.
   * @param {Number} inPageNum - The page number of data to retrieve (required for GitHub pagination support).
   * @returns {Promise} A promise which resolves to a list of commit objects wrapped in a PaginatedResponse object, or rejects with a String error message.
   * @public
   */
  static getCommitsOnBranch(ownerLogin, repoName, branchName, inPageNum) {
    return new Promise((resolve, reject) => {
      let repoFullName = ownerLogin + "/" + repoName;
      let octoRepo = octoClient.repo(repoFullName);
      let cb = cbWithPaginationFactory(resolve, reject, inPageNum);

      let params = {
        sha: branchName,
        page: inPageNum
      };

      octoRepo.commits(params, cb);
    });
  }

  /**
   * Gets a list of statuses for the specified commit reference in reverse chronological order.
   *
   * https://developer.github.com/v3/repos/statuses/#list-statuses-for-a-specific-ref
   *
   * @param {String} ownerLogin - The GitHub owner login name of the owner of the repo.
   * @param {String} repoName - The name of the repo.
   * @param {String} commitRef - A string specifying the commit reference (can be commit SHA ID, branch name, or tag name).
   * @returns {Promise} A promise which resolves to a list of commit status objects, or rejects with a String error message.
   * @public
   */
  static getStatusesForCommit(ownerLogin, repoName, commitRef) {
    return new Promise((resolve, reject) => {
      let repoFullName = ownerLogin + "/" + repoName;
      let octoRepo = octoClient.repo(repoFullName);
      let cb = cbFactory(resolve, reject);

      octoRepo.statuses(commitRef, cb);
    });
  }

  /**
   * Gets the latest status for each context, as well as a
   * single combined 'state', for the specified commit reference.
   *
   * https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
   *
   * @param {String} ownerLogin - The GitHub owner login name of the owner of the repo.
   * @param {String} repoName - The name of the repo.
   * @param {String} ref - A string specifying the commit reference (can be commit SHA ID, branch name, or tag name).
   * @returns {Promise} A promise which resolves to a combined status object, or rejects with a String error message.
   * @public
   */
  static getCombinedStatusForRef(ownerLogin, repoName, ref) {
    return new Promise((resolve, reject) => {
      let isCommitRefParamValid = utilityMethods.validateCommitReference(ref);

      if (isCommitRefParamValid) {
        let repoFullName = ownerLogin + "/" + repoName;
        let octoRepo = octoClient.repo(repoFullName);
        let cb = cbFactory(resolve, reject);

        octoRepo.combinedStatus(ref, cb);
      } else {
        reject("ERROR: Invalid ref parameter passed to GithubApi component.");
      }
    });
  }

  /**
   * Creates a new status on the specified commit.
   *
   * https://developer.github.com/v3/repos/statuses/#create-a-status
   *
   * @param {String} ownerLogin - The GitHub owner login name of the owner of the repo.
   * @param {String} repoName - The name of the repo.
   * @param {String} commitSha - The sha of the commit for which the new status should be created.
   * @param {String} state - The state to set for the new status ("pending", "success", "error", or "failure").
   * @param {String} description - The description to set for the new status.
   * @param {String} targetUrl - A URL related to the new status (e.g. link to output from CI server build
   *                              which triggered status).
   * @param {String} context - The name of the context under which the status should be created.
   * @returns {Promise} A promise which resolves to the newly created status object, or rejects with a String
   *                    error message.
   * @public
   */
  static createStatusForCommit(ownerLogin, repoName, commitSha, state, description, targetUrl, context) {
    return new Promise((resolve, reject) => {
      let isCommitRefParamValid = utilityMethods.validateCommitReference(commitSha);

      if(isCommitRefParamValid) {
        let repoFullName = ownerLogin + "/" + repoName;
        let octoRepo = octoClient.repo(repoFullName);
        let cb = cbFactory(resolve, reject);

        let createParams = {};

        if (utilityMethods.validateGitHubStatusState(state)) {
          createParams.state = state;
        } else {
          throw new Error("Invalid GitHub status state string passed to createStatusForCommit method in GithubApi componenet.");
        }

        if (utilityMethods.isValidString(description)) {
          createParams.description = description;
        }

        if (utilityMethods.isValidString(targetUrl)) {
          createParams.target_url = targetUrl;
        }

        if (utilityMethods.isValidString(context)) {
          createParams.context = context;
        }

        octoRepo.status(commitSha, createParams, cb);
      }else{
        reject("ERROR: Invalid ref parameter passed to GithubApi component.");
      }
    });
  }
}

/**
 * Processes an HTTP response object and wraps it in a pagination object.
 *
 * @param data
 * @param headers
 * @param currentPageNum
 * @return {PaginatedResponse} The response data wrapped in a pagination object
 * @private
 */
function processPagination(data, headers, currentPageNum){
  const REL_SEARCH_START_STRING = "rel=\"";
  const REL_SEARCH_END_STRING = "\"";
  const REL_SEARCH_STRING_LEN = REL_SEARCH_START_STRING.length;
  const LINK_SEARCH_START_STRING = "<";
  const LINK_SEARCH_END_STRING = ">";
  const LINK_SEARCH_START_STRING_LEN = LINK_SEARCH_START_STRING.length;

  let pageLinkString = headers.link;
  let lastPageNum;

  if(pageLinkString){
    let pageLinkArray = pageLinkString.split(", ");
    let parsedPageArray = [];
    let lastPageNumLink;

    pageLinkArray.forEach(pageLink => {
      let relStartIdx = pageLink.indexOf(REL_SEARCH_START_STRING) + REL_SEARCH_STRING_LEN;
      let relStopIdx = pageLink.indexOf(REL_SEARCH_END_STRING, relStartIdx);

      let linkStartIdx = pageLink.indexOf(LINK_SEARCH_START_STRING) + LINK_SEARCH_START_STRING_LEN;
      let linkStopIdx = pageLink.indexOf(LINK_SEARCH_END_STRING, linkStartIdx);

      let relNameString = pageLink.slice(relStartIdx, relStopIdx);
      let linkString = pageLink.slice(linkStartIdx, linkStopIdx);

      let pageNumValue = utilityMethods.extractParamFromURL("page", linkString);

      let newPageLinkObj = {
        rel: relNameString,
        link: linkString,
        pageNum: pageNumValue
      };

      parsedPageArray.push(newPageLinkObj);
    });

    lastPageNumLink = parsedPageArray.find(parsedPage => parsedPage.rel == "last");

    if(lastPageNumLink){
      lastPageNum = lastPageNumLink.pageNum;
    }else{
      lastPageNum = currentPageNum;
    }

  }else{
    lastPageNum = 1;
  }

  return new PaginatedResponse(parseInt(currentPageNum), parseInt(lastPageNum), data);
}

/**
 * Generates a new callback function instance to use with Octonode library requests
 *
 * @param {Function} resolve - a function to be invoked to resolve the promise using this callback
 * @param {Function} reject - a function to be invoked to reject the promise using this callback
 * @return {Function} a function to be used as the callback when making a request using the Octonode library
 * @private
 */
function cbFactory (resolve, reject) {
  return function(error, data){
    if (error) {
      console.log(processResponseErrorMsg(error));
      reject("ERROR: GitHub responded with an error.");
    } else {
      resolve(data);
    }
  };
}

/**
 * Generates a new callback function instance to use with Octonode library requests when response requires pagination
 *
 * @param {Function} resolve - a function to be invoked to resolve the promise using this callback
 * @param {Function} reject - a function to be invoked to reject the promise using this callback
 * @param {Number} pageNum - the page number of the current page of data being requested
 * @return {Function} a function to be used as the callback when making a request using the Octonode library
 * @private
 */
function cbWithPaginationFactory (resolve, reject, pageNum) {
  return function(error, data, headers){
    if (error) {
      console.log(processResponseErrorMsg(error));
      reject("ERROR: GitHub responded with an error.");
    } else {
      let paginatedResponseObj = processPagination(data, headers, pageNum);
      resolve(paginatedResponseObj);
    }
  };
}

/**
 * Logs and processes error messages returned from Octonode library.
 *
 * @param {Error} error - The error returned from Octonode library.
 * @returns {string} A string giving a general description of the type of error.
 * @private
 */
function processResponseErrorMsg(error) {
  let errMsg = "";

  if(error instanceof Error){
    if(error.constructor.name === "HttpError") {

      console.log("An HttpError occurred in response to GitHub HTTP request.");
      console.log("   HTTP Response Status Code: " + error.statusCode);
      console.log("   HTTP Response Message: " + error.message);

      console.log("ERROR DETAILS:");
      console.log(error);

      errMsg = "An HttpError occured in response to GitHub HTTP request.";
    }else{
      console.log(error);

      errMsg = "An unknown error occured in response to GitHub HTTP request.";
    }
  }else{
    console.log(error);

    errMsg = "An invalid error object was passed to processResponseErrorMsg function.";
  }

  return errMsg;
}

export default GithubApi;

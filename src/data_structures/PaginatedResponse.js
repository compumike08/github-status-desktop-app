import * as Axis from 'axis.js';
import PaginatedState from './PaginatedState';

class PaginatedResponse extends PaginatedState {
  /**
   * Construct PaginatedResponse object from parameters.
   *
   * @param {number} pageNum - The current page number
   * @param {number} totalNumPages - The total number of pages of data available
   * @param {object} pageData - An object containing the current page of data
   */
  constructor(pageNum, totalNumPages, pageData){
    super(pageNum, totalNumPages);

    if(!Axis.isArray(pageData)){
      // TODO: Implement better logging
      console.log("Value of 'pageData' parameter passed to PaginatedResponse constructor: " + pageData);
      console.log("Value of 'pageData' parameter passed to PaginatedResponse constructor is not an object");
      throw new TypeError("Value of 'pageData' parameter passed to PaginatedResponse constructor is not an object");
    }

    this._pageData = pageData;
  }

  /**
   * @return {object} An object containing the current page of data
   */
  get pageData() {
    return this._pageData;
  }
}

export default PaginatedResponse;

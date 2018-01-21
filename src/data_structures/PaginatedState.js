import * as Axis from '../../node_modules/axis.js';

class PaginatedState {
  /**
   * Construct PaginatedState object from parameters.
   *
   * @param {number} pageNum - The current page number
   * @param {number} totalNumPages - The total number of pages of data available
   */
  constructor(pageNum, totalNumPages){
    if(!Axis.isNumber(pageNum)){
      // TODO: Implement better logging
      console.log("Value of 'pageNum' parameter passed to PaginatedState constructor: " + pageNum);
      console.log("Value of 'pageNum' parameter passed to PaginatedState constructor is not a number");
      throw new TypeError("Value of 'pageNum' parameter passed to PaginatedState constructor is not a number");
    }

    if(!Axis.isNumber(totalNumPages)){
      // TODO: Implement better logging
      console.log("Value of 'totalNumPages' parameter passed to PaginatedState constructor: " + totalNumPages);
      console.log("Value of 'totalNumPages' parameter passed to PaginatedState constructor is not a number");
      throw new TypeError("Value of 'totalNumPages' parameter passed to PaginatedState constructor is not a number");
    }

    this._pageNum = pageNum;
    this._totalNumPages = totalNumPages;
  }

  /**
   * @return {number} The current page number
   */
  get pageNum() {
    return this._pageNum;
  }

  /**
   * @return {number} The total number of pages of data available
   */
  get totalNumPages() {
    return this._totalNumPages;
  }
}

export default PaginatedState;

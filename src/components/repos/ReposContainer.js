import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NotificationActions, NotificationContainer } from 'material-ui-notifications';

import {NOTIFICATION_DURATION} from "../../constants/constants";
import * as repoActions from '../../actions/repoActions';
import ReposList from './ReposList';

class ReposContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleGetRepos = this.handleGetRepos.bind(this);
    this.handleRepoSelect = this.handleRepoSelect.bind(this);
    this.redirectToBranchesListPage = this.redirectToBranchesListPage.bind(this);
  }

  handleGetRepos(){
    this.props.actions.loadRepos().then(() => {
      NotificationActions.addNotification({
          autoHide: NOTIFICATION_DURATION,
          headerLabel: "Repos Fetched",
          text: "Repo list fetched successfully!"
      });
    }).catch(error => {
      console.log(error);
      NotificationActions.addNotification({
          autoHide: NOTIFICATION_DURATION,
          primaryColor: "red",
          headerLabel: "Repos Not Fetched",
          text: "Repo list fetch failed!"
      });
    });
  }

  handleRepoSelect(evt){
    evt.preventDefault();
    this.redirectToBranchesListPage(evt.currentTarget.value);
  }

  redirectToBranchesListPage(selectedRepoId){
    let repos = this.props.repos;

    let selectedRepo = repos.find(repo => repo.id == selectedRepoId);

    // browserHistory.push("/repo/" + selectedRepo.id + "/branches");
  }

  render() {
    const {repos} = this.props;

    return (
      <div>
        <NotificationContainer />

        <div className="row">
          <div className="col-sm-3">
            <button type="button" className="btn btn-primary" onClick={this.handleGetRepos}>Get Repos</button>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <ReposList repos={repos} onSelect={this.handleRepoSelect}/>
          </div>
        </div>

      </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    repos: state.repos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(repoActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReposContainer);

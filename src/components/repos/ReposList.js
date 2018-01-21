import React, {PropTypes} from 'react';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import ReposListRow from './ReposListRow';

const ReposList = ({repos, onSelect}) => {
    const paperStyle = {
        margin: 20
    };

    let reposListRowElement = (
        <div className="panel-body">
            <div>
                <span className="bold italic">Data not fetched</span>
            </div>
            <div>
                <span className="italic">To fetch data, sign in to GitHub, then select "Get Repos" button above.</span>
            </div>
        </div>
    );

    if (repos !== null) {
        reposListRowElement = (
            <List>
                <Subheader>Select a repository:</Subheader>
                {repos.map(repo =>
                    <ReposListRow key={repo.id} repo={repo} onSelect={onSelect}/>
                )}
            </List>
        );
    }

    return (
        <Paper style={paperStyle} rounded={false}>
            <div className="paper-heading bold">Repositories</div>
            {reposListRowElement}
        </Paper>
    );
};


export default ReposList;

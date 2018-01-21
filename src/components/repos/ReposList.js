import React, {PropTypes} from 'react';
import ReposListRow from './ReposListRow';

const ReposList = ({repos, onSelect}) => {
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
            <div className="panel-body">
                <span className="bold">Select a repository:</span>
                <div className="list-group">
                    {repos.map(repo =>
                        <ReposListRow key={repo.id} repo={repo} onSelect={onSelect}/>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">Repositories</div>
            {reposListRowElement}
        </div >
    );
};


export default ReposList;

import React, {PropTypes} from 'react';

const ReposListRow = ({repo, onSelect}) => {
    return (
        <button type="button" className="list-group-item" value={repo.id} onClick={onSelect}>{repo.name}</button>
    );
};



export default ReposListRow;

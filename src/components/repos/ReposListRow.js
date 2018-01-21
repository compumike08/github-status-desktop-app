import React, {PropTypes} from 'react';
import {ListItem} from 'material-ui/List';

const ReposListRow = ({repo, onSelect}) => {
    return (
        <ListItem
            primaryText={repo.name}
            value={repo.id}
            onClick={onSelect}
        />
    );
};



export default ReposListRow;

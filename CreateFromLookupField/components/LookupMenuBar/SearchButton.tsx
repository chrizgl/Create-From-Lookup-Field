import * as React from 'react';
import { useContext } from 'react';
import { Search32Regular, Search32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button } from '@fluentui/react-components';
import { useStyles } from '../Styles';

import InputActionBarContext from '../CreateFromLookupContext';

type SearchButtonProps = {
    onClickSearchRequest: () => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({ onClickSearchRequest }) => {
    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }

    const validInputState = contextValue.validInputState;
    const searchState = contextValue.searchState;

    const classes = useStyles();
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const showSearchButton = () =>
        searchState.overlayHidden ? (
            <Search32Regular className={iconClass}></Search32Regular>
        ) : (
            <Search32Filled className={overflowClass}></Search32Filled>
        );

    return <>{validInputState && <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest} />}</>;
};
export default SearchButton;

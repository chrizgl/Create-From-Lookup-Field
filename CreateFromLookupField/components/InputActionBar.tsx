import * as React from 'react';
import { useCallback, useContext } from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import WebApiRequest from './WebApiComponent';
import InputActionBarContext from './InputActionBarContext';
import { IButtonState } from '../interfaces/IButtonState';
import SearchField from './SearchField';

const SEARCH_DELAY = 1000;

const InputActionBar: React.FC<ICreateFromLookupProps> = (props) => {
    const webApiRequest = WebApiRequest({ utils: props.utils, webApi: props.webApi, config: props.config });
    const openOnSidePane = props.openOnSidePane;

    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }
    const inputValue = contextValue.inputValue;
    const validInputState = contextValue.validInputState;
    const searchState = contextValue.searchState;
    const openState = contextValue.openState;
    const createState = contextValue.createState;
    const setCreateState = contextValue.setCreateState;
    const createEnabledState = contextValue.createEnabledState;
    const setCreateEnabledState = contextValue.setCreateEnabledState;
    const onClickSearchRequest = contextValue.onClickSearchRequest;

    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const handleCreate = useCallback(async () => {
        const result = await webApiRequest.createRecord(inputValue);
        if (result) {
            setCreateEnabledState(!result.lookupValue);
            if (result.lookupValue) {
                props.onChangeRequest(result.lookupValue);
            }
        }
    }, [webApiRequest, inputValue, props, setCreateEnabledState]);

    const onClickCreateRequest = useCallback(() => {
        setCreateState((state: IButtonState) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state: IButtonState) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        handleCreate();
    }, [handleCreate, setCreateState]);

    // BUTTON ACTION: Open on Side Pane
    const onClickOpenRequest = useCallback(() => {
        openOnSidePane.openOnSidePane(props.lookupValue);
    }, [openOnSidePane, props.lookupValue]);

    // Component Buttons (Icons)
    const showSearchButton = () =>
        searchState.overlayHidden ? (
            <Search32Regular className={iconClass}></Search32Regular>
        ) : (
            <Search32Filled className={overflowClass}></Search32Filled>
        );

    const showCreateButton = () =>
        createState.overlayHidden ? (
            <AddCircle32Regular className={iconClass}></AddCircle32Regular>
        ) : (
            <AddCircle32Filled className={overflowClass}></AddCircle32Filled>
        );

    const showOpenButton = () =>
        openState.overlayHidden ? (
            <Open32Regular className={iconClass}></Open32Regular>
        ) : (
            <Open32Filled className={overflowClass}></Open32Filled>
        );

    return (
        <div className={stackClasses}>
            <SearchField />
            {validInputState && (
                <>
                    <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest} />
                    {createEnabledState && (
                        <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest} />
                    )}
                </>
            )}
            {props.lookupValue && (
                <>
                    <Button className={classes.stackitem} icon={showOpenButton()} onClick={onClickOpenRequest} />
                </>
            )}
        </div>
    );
};
export default InputActionBar;

import * as React from 'react';
import { useCallback, useMemo, useContext, useState } from 'react'; // avoid re-rendering
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import WebApiRequest from './WebApiComponent';
import InputActionBarContext from './InputActionBarContext';
import { IInputActionBarContext } from '../interfaces/IInputActionBarContext';

const SEARCH_DELAY = 1000;

const InputActionBar: React.FC<ICreateFromLookupProps> = (props) => {
    const _props = props;
    const webApiRequest = WebApiRequest({ utils: _props.utils, webApi: _props.webApi, config: _props.config });
    const openOnSidePane = _props.openOnSidePane; // Styling specific code:

    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }
    const id = useId();
    const inputValue = contextValue.inputValue;
    const setInputValue = contextValue.setInputValue;
    const validInputState = contextValue.validInputState;
    const setValidInputState = contextValue.setValidInputState;
    const searchState = contextValue.searchState;
    const setSearchState = contextValue.setSearchState;
    const openState = contextValue.openState;
    const setOpenState = contextValue.setOpenState;
    const createState = contextValue.createState;
    const setCreateState = contextValue.setCreateState;
    const createEnabledState = contextValue.createEnabledState;
    const setCreateEnabledState = contextValue.setCreateEnabledState;
    const lookupDialogState = contextValue.lookupDialogState;
    const setLookupDialogState = contextValue.setLookupDialogState;

    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);
    const inputClass = mergeClasses(classes.input, classes.stackitem);

    const handleSearch = useCallback(async () => {
        webApiRequest.retrieveRecords(inputValue).then((result) => {
            if (result) {
                const foundRef = result.hasFound;
                if (!foundRef) {
                    setCreateEnabledState(true);
                } else {
                    setLookupDialogState((state) => ({ ...state, values: result.lookupValues, open: true }));
                    setCreateEnabledState(false);
                }
            }
        });
    }, [inputValue, setCreateEnabledState, setLookupDialogState, webApiRequest]);

    const handleCreate = useCallback(async () => {
        const result = await webApiRequest.createRecord(inputValue);
        if (result) {
            if (result.lookupValue) {
                _props.onChangeRequest(result.lookupValue);
                setCreateEnabledState(false);
            } else {
                setCreateEnabledState(true);
            }
        }
    }, [webApiRequest, inputValue, _props, setCreateEnabledState]);

    const onClickCreateRequest = () => {
        setCreateState({ overlayHidden: false, iconBackground: 'lightgreen' });
        setTimeout(() => {
            setCreateState({ overlayHidden: true, iconBackground: 'transparent' });
        }, SEARCH_DELAY);
        handleCreate();
    };

    const onClickSearchRequest = () => {
        setSearchState({ overlayHidden: false, iconBackground: 'lightgreen' });
        setTimeout(() => {
            setSearchState({ overlayHidden: true, iconBackground: 'transparent' });
        }, SEARCH_DELAY);
        if (validInputState) {
            console.log('onClickSearchRequest - validInputState');
            handleSearch();
        }
    };

    const onInputChange = (value: string) => {
        setInputValue(value);
        if (value.length > 3) {
            setValidInputState(true);
        } else {
            setValidInputState(false);
            setCreateEnabledState(false);
        }
    };

    const onInputKey: InputProps['onKeyUp'] = (key) => {
        console.log('onInputKey - key: ' + key.key);
        if (key.key === 'Enter') {
            onClickSearchRequest();
        }
    };

    // BUTTON ACTION: Open on Side Pane
    const onClickOpenRequest = () => {
        console.log('onClickOpenRequest - Open on Side Pane: ' + _props.lookupValue);
        openOnSidePane.openOnSidePane(_props.lookupValue);
    };

    // Component Buttons (Icons)
    const showSearchButton = () => {
        if (searchState.overlayHidden) {
            return <Search32Regular className={iconClass}></Search32Regular>;
        } else {
            return <Search32Filled className={overflowClass}></Search32Filled>;
        }
    };
    const showCreateButton = () => {
        if (createState.overlayHidden) {
            return <AddCircle32Regular className={iconClass}></AddCircle32Regular>;
        } else {
            return <AddCircle32Filled className={overflowClass}></AddCircle32Filled>;
        }
    };
    const showOpenButton = () => {
        if (openState.overlayHidden) {
            return <Open32Regular className={iconClass}></Open32Regular>;
        } else {
            return <Open32Filled className={overflowClass}></Open32Filled>;
        }
    };

    return (
        <div className={stackClasses}>
            <Input
                id={id}
                readOnly={false}
                className={inputClass}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyUp={onInputKey}
            />
            {validInputState && (
                <>
                    <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest} />
                    {createEnabledState && (
                        <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest} />
                    )}
                </>
            )}
            {_props.lookupValue && (
                <>
                    <Button className={classes.stackitem} icon={showOpenButton()} onClick={onClickOpenRequest} />
                </>
            )}
        </div>
    );
};
export default InputActionBar;

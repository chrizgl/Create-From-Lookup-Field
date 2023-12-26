import * as React from 'react';
import { useState, useCallback, useMemo } from 'react'; // avoid re-rendering
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ICreateFromLookupState } from '../interfaces/_ICreateFromLookupState';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import SelectItemDialog from './SelectItemDialog';
import WebApiRequest from './WebApiComponent';

const SEARCH_DELAY = 1000;

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = useMemo(() => props, [props]);
    const webApiRequest = WebApiRequest({ utils: _props.utils, webApi: _props.webApi, config: _props.config });
    const openOnSidePane = _props.openOnSidePane;

    // Styling specific code:
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const inputClass = mergeClasses(classes.input, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const id = useId();
    const [inputValue, setInputValue] = useState('');
    const [validInputState, setValidInputState] = useState(false);

    // STATE AREA:
    const [searchState, setSearchState] = useState<ICreateFromLookupState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const [createEnabledState, setCreateEnabledState] = useState(false);

    const [createState, setCreateState] = useState<ICreateFromLookupState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const [lookupDialogState, setLookupDialogState] = useState<ILookupDialogState>({
        values: new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse,
        open: false,
        selectedItem: [],
    });

    const [openEnabledState, setOpenEnabledState] = useState(false);
    const [openState, setOpenState] = useState<ICreateFromLookupState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        setLookupDialogState: setLookupDialogState,
        config: _props.config,
    };
    const lookupDialog = SelectItemDialog(lookupDialogProps);

    const onInputKey: InputProps['onKeyUp'] = (key) => {
        if (key.key === 'Enter') {
            onClickSearchRequest();
        }
    };

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
    }, [inputValue, webApiRequest]);

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
    }, [webApiRequest, inputValue, _props]);

    const onClickSearchRequest = () => {
        setSearchState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        if (validInputState) {
            console.log('onClickSearchRequest - validInputState');
            handleSearch();
        }
    };

    const onClickCreateRequest = () => {
        setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        handleCreate();
    };

    // BUTTON ACTION: Open on Side Pane
    const onClickOpenRequest = () => {
        console.log('onClickOpenRequest - Open on Side Pane');
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

    const onInputChange = (value: string) => {
        setInputValue(value);
        if (value.length > 3) {
            setValidInputState(true);
        } else {
            setValidInputState(false);
            setCreateEnabledState(false);
        }
    };

    // Der Haupt-Render
    return (
        <FluentProvider theme={webLightTheme}>
            <div className={stackClasses}>{lookupDialog.show(lookupDialogState)}</div>
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
        </FluentProvider>
    );
};
export default CreateFromLookupApp;

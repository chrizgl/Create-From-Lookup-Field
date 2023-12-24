import * as React from 'react';
import { useState, useCallback, useMemo } from 'react'; // avoid re-rendering
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ICreateFromLookupState } from '../interfaces/ICreateFromLookupState';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import SelectItemDialog from './SelectItemDialog';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import WebApiRequest from './WebApiComponent';

const SEARCH_DELAY = 1000;

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const webApiRequest = WebApiRequest(props.webApiProps);
    const openOnSidePane = props.openOnSidePane;

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
        onChangeRequest: props.onChangeRequest,
        setLookupDialogState: setLookupDialogState,
        config: props.webApiProps.config,
    };
    const lookupDialog = SelectItemDialog(lookupDialogProps);

    const onInputKey: InputProps['onKeyUp'] = (key) => {
        if (key.key === 'Enter') {
            onClickSearchRequest();
        }
    };

    const foundRef = React.useRef(false);

    const handleSearch = useCallback(async () => {
        console.log('handleSearch called');
        const result = await webApiRequest.getEntity();
        if (result) {
            foundRef.current = true;
            if (!foundRef.current) {
                setCreateEnabledState(true);
            } else {
                setLookupDialogState((state) => ({ ...state, values: result.lookupValues, open: true }));
                setCreateEnabledState(false);
            }
        }
    }, [webApiRequest]);

    const handleCreate = useCallback(async () => {
        const result = await webApiRequest.createRecord(inputValue);
        if (result) {
            const recordCreated = result.isCreated;
            if (recordCreated) {
                props.onChangeRequest(result.lookupValue);
                setCreateEnabledState(false);
            } else {
                setCreateEnabledState(true);
            }
        }
    }, [webApiRequest, inputValue, props]);

    const onClickSearchRequest = () => {
        console.log('new onClickSearchRequest is called');
        setSearchState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
            if (validInputState) {
                console.log('onClickSearchRequest - validInputState');
                handleSearch();
            }
        }, SEARCH_DELAY);
    };

    const onClickCreateRequest = () => {
        setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
            handleCreate();
        }, SEARCH_DELAY);
    };

    // BUTTON ACTION: Open on Side Pane
    const onClickOpenRequest = () => {
        console.log('onClickOpenRequest - Open on Side Pane');
        openOnSidePane.openOnSidePane(props.lookupValue);
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

    return (
        <FluentProvider theme={webLightTheme}>
            <div className={stackClasses}>{lookupDialog.show(lookupDialogState)}</div>
            <div className={stackClasses}>
                <Input
                    id={id}
                    readOnly={props.isDisabled}
                    className={inputClass}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyUp={onInputKey}
                />
                <div hidden={!validInputState}>
                    <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest}></Button>
                </div>
                <div hidden={!createEnabledState || !validInputState}>
                    <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest}></Button>
                </div>
                <div hidden={false}>
                    <Button className={classes.stackitem} icon={showOpenButton()} onClick={onClickOpenRequest}></Button>
                </div>
            </div>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;

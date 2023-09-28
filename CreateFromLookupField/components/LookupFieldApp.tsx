import * as React from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import type { PopoverProps } from '@fluentui/react-components';
import { useState } from 'react';
import { useStyles } from './Styles';
import iCreateFromLookupProps from '../interfaces/iCreateFromLookupProps';
import { iCreateFromLookupState } from '../interfaces/iCreateFromLookupState';
import { SelectItemDialog } from './SelectItemDialog';
import WebApiRequest from './WebApiComponent';

const CreateFromLookupApp = (props: iCreateFromLookupProps): JSX.Element => {
    const webApiRequest = new WebApiRequest(props.webAPI, props.config);
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const inputClass = mergeClasses(classes.input, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const id = useId();
    let found = true;
    let createdRecord = false;
    const [inputValue, setInputValue] = useState('');
    const [validInputState, setValidInputState] = useState(false);
    const [searchState, setSearchState] = useState<iCreateFromLookupState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });
    const [createEnabledState, setCreateEnabledState] = useState(false);
    const [createState, setCreateState] = useState<iCreateFromLookupState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });
    const [selectedItemState, setSelectedItemState] = useState('');
    const onInputKey: InputProps['onKeyUp'] = (key) => {
        if (key.key === 'Enter') {
            onClickSearchRequest();
        }
    };

    const onClickSearchRequest = () => {
        setSearchState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
        if (validInputState === true) {
            webApiRequest.retrieveRecords(inputValue).then((result) => {
                if (result) {
                    found = result.hasFound;
                    if (!found) {
                        setCreateEnabledState(true);
                    } else {
                        setCreateEnabledState(false);
                        console.log(result.lookupValues);
                    }
                }
            });
        }
    };

    const onClickCreateRequest = () => {
        setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
        webApiRequest.createRecord(inputValue).then((result) => {
            if (result) {
                createdRecord = result.isCreated;
                if (createdRecord === true) {
                    props.onChangeRequest(result.lookupValue);
                    setCreateEnabledState(false);
                } else {
                    setCreateEnabledState(true);
                }
            }
        });
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

    const onInputChange = (value: string) => {
        setInputValue(value);
        console.log(selectedItemState);
        if (value.length > 3) {
            setValidInputState(true);
        } else {
            setValidInputState(false);
            setCreateEnabledState(false);
        }
    };

    return (
        <FluentProvider theme={webLightTheme}>
            {SelectItemDialog(props.lookupValues, setSelectedItemState)}
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
            </div>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;

import * as React from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled } from '@fluentui/react-icons';
import {
    mergeClasses,
    Button,
    FluentProvider,
    webLightTheme,
    Input,
    InputProps,
    useId,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
} from '@fluentui/react-components';
import type { PopoverProps } from '@fluentui/react-components';
import { useState } from 'react';
import { useStyles } from './Styles';
import { iCreateFromLookupProps } from '../interfaces/iCreateFromLookupProps';
import { iCreateFromLookupState } from '../interfaces/iCreateFromLookupState';
import { SelectItemDialog } from './SelectItemDialog';

const CreateFromLookupApp = (props: iCreateFromLookupProps): JSX.Element => {
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
            props.onSearchRequest(inputValue).then((result) => {
                found = result;
                if (!found) {
                    setCreateEnabledState(true);
                } else {
                    setCreateEnabledState(false);
                }
            });
        }
    };

    const onClickCreateRequest = () => {
        setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
        props.onCreateRequest(inputValue).then((result) => {
            createdRecord = result;
            if (createdRecord === true) {
                setCreateEnabledState(false);
            } else {
                setCreateEnabledState(true);
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
        if (value.length > 3) {
            setValidInputState(true);
        } else {
            setValidInputState(false);
            setCreateEnabledState(false);
        }
    };
    // kann ggf. verwendet werden z.B. um vor dem Erstellen nachzufragen
    const openDialog = () => {
        return (
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Create new item?</DialogTitle>
                    <DialogContent>No item found. Do you want to create it new?</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance='secondary'>Close</Button>
                        </DialogTrigger>
                        <Button appearance='primary'>Do Something</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        );
    };

    return (
        <FluentProvider theme={webLightTheme}>
            {SelectItemDialog(props.lookupValues)}
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

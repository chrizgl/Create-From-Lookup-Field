import * as React from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useState } from 'react';
import { useStyles } from './Styles';

export interface ICreateFromLookupProps {
    input: string | undefined;
    utils: ComponentFramework.Utility;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    onRequest: (text: string) => void;
    onSearchRequest: (text: string) => Promise<boolean>;
    onCreateRequest: (text: string) => Promise<boolean>;
}

export interface ICreateFromLookupState {
    currentValue: string;
    overlayHidden: boolean;
    iconBackground: string;
}

interface IClipboardClassObject {
    clipboardIcon: string;
    textbox: string;
    iconWrapper: string;
    textboxOverlay: string;
}

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const inputClass = mergeClasses(classes.input, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);
    const id = useId();
    let found = true;
    let createdRecord = false;
    const [inputValue, setInputValue] = useState('');
    const [searchState, setSearchState] = useState<ICreateFromLookupState>({
        currentValue: '',
        overlayHidden: true,
        iconBackground: 'transparent',
    });
    const [createEnabledState, setCreateEnabledState] = useState(false);
    const [createState, setCreateState] = useState<ICreateFromLookupState>({
        currentValue: '',
        overlayHidden: true,
        iconBackground: 'transparent',
    });
    const onInputKey: InputProps['onKeyUp'] = (key) => {
        if (key.key === 'Enter') {
            onClickSearchRequest();
            onRequest();
        }
        // console.log('onInputKey ' + inputValue);
    };

    const onRequest = () => {
        props.onRequest(inputValue);
    };
    //
    // noch habe ich eine eigene Funktionen für Search und Create, eventuell ginge hier ne Klasse und instanzieren?
    //
    const onClickSearchRequest = () => {
        console.log('onClickSearchRequest ' + inputValue);

        setSearchState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
        props.onSearchRequest(inputValue).then((result) => {
            console.log('onClickSearchRequest result ' + result);
            found = result;
            console.log('found ' + found);
            if (found === true) {
                setCreateEnabledState(false);
                //console.log('1. if - createEnabledState ' + createEnabledState);
            } else {
                setCreateEnabledState(true);
                //console.log('2. else set true? - createEnabledState ' + createEnabledState);
            }
            //console.log('3. After if/else - createEnabledState ' + createEnabledState);
        });
    };

    const onClickCreateRequest = () => {
        console.log('onClickCreateRequest ' + inputValue);

        setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
        props.onCreateRequest(inputValue).then((result) => {
            console.log('onClickCreateRequest result ' + result);
            createdRecord = result;
            console.log('createdRecord ' + createdRecord);
            if (createdRecord === true) {
                setCreateEnabledState(false);
                // console.log('1. if - createEnabledState ' + createEnabledState);
            } else {
                setCreateEnabledState(true);
                // console.log('2. else set true? - createEnabledState ' + createEnabledState);
            }
            // console.log('3. After if/else - createEnabledState ' + createEnabledState);
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

    return (
        <FluentProvider theme={webLightTheme}>
            <div className={stackClasses}>
                <Input
                    id={id}
                    readOnly={props.isDisabled}
                    className={inputClass}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={onInputKey}
                />
                <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest}></Button>
                <div hidden={!createEnabledState}>
                    <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest}></Button>
                </div>
            </div>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;

import * as React from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useState } from 'react';
import { useStyles } from './Styles';
import { iCreateFromLookupProps } from '../interfaces/iCreateFromLookupProps';
import { iCreateFromLookupState } from '../interfaces/iCreateFromLookupState';

// Component Class
class CreateFromLookupComponent extends React.PureComponent<iCreateFromLookupProps> {
    _props: iCreateFromLookupProps;
    private _useStyles = useStyles;
    private _useState = useState;
    private _id = useId();
    //
    //
    constructor(props: iCreateFromLookupProps) {
        super(props);
        this._props = props;
    }

    public render() {
        const classes = this._useStyles();
        const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
        const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
        const inputClass = mergeClasses(classes.input, classes.stackitem);
        const iconClass = mergeClasses(classes.icon, classes.stackitem);

        const [inputValue, setInputValue] = this._useState('');
        const [validInputState, setValidInputState] = this._useState(false);
        const [searchState, setSearchState] = this._useState<iCreateFromLookupState>({
            currentValue: '',
            overlayHidden: true,
            iconBackground: 'transparent',
        });
        const [createEnabledState, setCreateEnabledState] = this._useState(false);
        const [createState, setCreateState] = this._useState<iCreateFromLookupState>({
            currentValue: '',
            overlayHidden: true,
            iconBackground: 'transparent',
        });
        let found = true;
        let createdRecord = false;
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
        const onClickSearchRequest = () => {
            // console.log('onClickSearchRequest ' + inputValue);

            // console.log('validInput =' + validInputState);
            setSearchState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
            setTimeout(() => {
                setSearchState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
            }, 1000);
            if (validInputState === true) {
                this._props.onSearchRequest(inputValue).then((result) => {
                    console.log('onClickSearchRequest result ' + result);
                    found = result;
                    console.log('found ' + found);
                    if (!found) {
                        setCreateEnabledState(true);
                    } else {
                        setCreateEnabledState(false);
                    }
                });
            }
        };
        const onClickCreateRequest = () => {
            console.log('onClickCreateRequest ' + inputValue);

            setCreateState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
            setTimeout(() => {
                setCreateState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
            }, 1000);
            this._props.onCreateRequest(inputValue).then((result) => {
                console.log('onClickCreateRequest result ' + result);
                createdRecord = result;
                console.log('createdRecord ' + createdRecord);
                if (createdRecord === true) {
                    setCreateEnabledState(false);
                } else {
                    setCreateEnabledState(true);
                }
            });
        };
        const onInputChange = (value: string) => {
            setInputValue(value);
            console.log('onInputChange ' + value);
            if (value.length > 3) {
                setValidInputState(true);
            } else {
                setValidInputState(false);
                setCreateEnabledState(false);
            }
            console.log('validInput ' + validInputState);
        };

        const onRequest = () => {
            this._props.onRequest(inputValue);
        };
        //
        const onInputKey: InputProps['onKeyUp'] = (key) => {
            if (key.key === 'Enter') {
                onClickSearchRequest();
                onRequest();
            }
        };

        return (
            <FluentProvider theme={webLightTheme}>
                <div className={stackClasses}>
                    <Input
                        id={this._id}
                        readOnly={this._props.isDisabled}
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
    }
}
export default CreateFromLookupComponent;

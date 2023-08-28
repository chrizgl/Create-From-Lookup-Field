import * as React from 'react';
import {
    mergeClasses,
    Button,
    FluentProvider,
    webLightTheme,
    Combobox,
    ComboboxProps,
    ComboboxState,
    Input,
    InputProps,
    InputOnChangeData,
    useId,
    Overflow,
} from '@fluentui/react-components';
import { useStyles } from './Styles';
import { useState } from 'react';
import { on } from 'events';

export interface ILookupFieldProps {
    lookupValue: ComponentFramework.LookupValue;
    performLookupObjects: (lookupValue: ComponentFramework.LookupValue) => void;
    onInputChange: () => void;
}

const LookupFieldApp = (props: ILookupFieldProps): JSX.Element => {
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const id = useId();
    const [inputValue, setInputValue] = useState(props.lookupValue.name ?? '');
    const onComboboxChange: ComboboxProps['onChange'] = () => {};

    const onButtonClick = (props: ILookupFieldProps) => {
        return () => {
            props.performLookupObjects(props.lookupValue);
        };
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <div className={stackClasses}>
                <Input></Input>
                <Combobox onChange={onComboboxChange}></Combobox>
                <Button onClick={onButtonClick(props)} />
            </div>
        </FluentProvider>
    );
};

export default LookupFieldApp;

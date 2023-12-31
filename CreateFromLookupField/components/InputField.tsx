import React, { useContext, useId } from 'react';
import { Input, InputProps, mergeClasses } from '@fluentui/react-components';
import LookupFieldContext from './InputActionBarContext';
import { useStyles } from './Styles';

const InputField: React.FC = (props) => {
    const classes = useStyles();
    const inputClass = mergeClasses(classes.input, classes.stackitem);

    const id = useId();
    let inputValue = '';
    let setInputValue = (value: string) => {};
    let validInputState = false;
    let setValidInputState = (value: boolean) => {};
    let createEnabledState = false;
    let setCreateEnabledState = (value: boolean) => {};

    const context = useContext(LookupFieldContext);
    if (context !== null) {
        inputValue = context.inputValue;
        setInputValue = context.setInputValue;
        validInputState = context.validInputState;
        setValidInputState = context.setValidInputState;
        createEnabledState = context.createEnabledState;
        setCreateEnabledState = context.setCreateEnabledState;
    }

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
        if (key.key === 'Enter') {
            onClickSearchRequest();
        }
    };

    return (
        <Input
            id={id}
            readOnly={false}
            className={inputClass}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyUp={onInputKey}
        />
    );
};

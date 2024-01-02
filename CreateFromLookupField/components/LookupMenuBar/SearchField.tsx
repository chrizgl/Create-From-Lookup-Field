import * as React from 'react';
import { useContext } from 'react';
import { mergeClasses, Input, InputProps, useId } from '@fluentui/react-components';
import { useStyles } from '../Styles';
import InputActionBarContext from '../CreateFromLookupContext';

type SearchFieldProps = {
    onClickSearchRequest: () => void;
};

const SearchField: React.FC<SearchFieldProps> = ({ onClickSearchRequest }) => {
    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }
    const id = useId();
    const inputValue = contextValue.inputValue;
    const setInputValue = contextValue.setInputValue;
    const setValidInputState = contextValue.setValidInputState;
    const setCreateEnabledState = contextValue.setCreateEnabledState;

    const classes = useStyles();
    const inputClass = mergeClasses(classes.input, classes.stackitem);

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
export default SearchField;

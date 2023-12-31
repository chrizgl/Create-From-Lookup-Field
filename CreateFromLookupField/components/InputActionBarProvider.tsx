// InputActionBarProvider.tsx
import React, { useState } from 'react';
import LookupFieldContext from './InputActionBarContext';
import { IInputActionBarProvider } from '../interfaces/IInputActionBarProvider';
import { IInputActionBarContext } from '../interfaces/IInputActionBarContext';
import { IButtonState } from '../interfaces/IButtonState';

const InputActionBarProvider = ({ children }: IInputActionBarProvider) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [validInputState, setValidInputState] = useState<boolean>(false);

    const [searchState, setSearchState] = useState<IButtonState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const [createState, setCreateState] = useState<IButtonState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const [openState, setOpenState] = useState<IButtonState>({
        overlayHidden: true,
        iconBackground: 'transparent',
    });

    const [createEnabledState, setCreateEnabledState] = useState(false);

    const contextValue: IInputActionBarContext = {
        inputValue,
        setInputValue,
        validInputState,
        setValidInputState,
        searchState,
        setSearchState,
        openState,
        setOpenState,
        createState,
        setCreateState,
        createEnabledState,
        setCreateEnabledState,
    };

    return <LookupFieldContext.Provider value={contextValue}>{children}</LookupFieldContext.Provider>;
};

export default InputActionBarProvider;

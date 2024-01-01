// InputActionBarProvider.tsx
import React, { useState, useCallback } from 'react';
import LookupFieldContext from './InputActionBarContext';
import { IInputActionBarProvider } from '../interfaces/IInputActionBarProvider';
import { IInputActionBarContext } from '../interfaces/IInputActionBarContext';
import { IButtonState } from '../interfaces/IButtonState';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import WebApiRequest from './WebApiComponent';

const SEARCH_DELAY = 1000;

const InputActionBarProvider = ({ children, props }: IInputActionBarProvider) => {
    const webApiRequest = WebApiRequest(props);
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

    const [lookupDialogState, setLookupDialogState] = useState<ILookupDialogState>({
        values: new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse,
        open: false,
        selectedItem: [],
    });

    const [createEnabledState, setCreateEnabledState] = useState(false);

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
    }, [inputValue, setCreateEnabledState, setLookupDialogState, webApiRequest]);

    const onClickSearchRequest = useCallback(() => {
        setSearchState((state: IButtonState) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state: IButtonState) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        if (validInputState) {
            handleSearch();
        }
    }, [handleSearch, setSearchState, validInputState]);

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
        lookupDialogState,
        setLookupDialogState,
        onClickSearchRequest,
    };

    return <LookupFieldContext.Provider value={contextValue}>{children}</LookupFieldContext.Provider>;
};

export default InputActionBarProvider;

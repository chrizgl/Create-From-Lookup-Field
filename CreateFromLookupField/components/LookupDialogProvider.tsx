// LookupDialogProvider.tsx
import React, { useState } from 'react';
import { ILookupDialogProvider } from '../interfaces/ILookupDialogProvider';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import { ILookupDialogContext } from '../interfaces/ILookupDialogContext';
import LookupDialogContext from './LookupDialogContext';

const LookupDialogProvider = ({ children }: ILookupDialogProvider) => {
    const [lookupDialogState, setLookupDialogState] = useState<ILookupDialogState>({
        values: new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse,
        open: false,
        selectedItem: [],
    });

    const contextValue: ILookupDialogContext = {
        lookupDialogState,
        setLookupDialogState,
    };

    return <LookupDialogContext.Provider value={contextValue}>{children}</LookupDialogContext.Provider>;
};

export default LookupDialogProvider;

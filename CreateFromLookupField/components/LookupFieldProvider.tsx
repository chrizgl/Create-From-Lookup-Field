// LookupFieldProvider.tsx
import React, { useState } from 'react';
import LookupFieldContext from './LookupFieldContext';
import { ILookupFieldProviderProps } from '../interfaces/ILookupFieldProviderProps';

const LookupFieldProvider = ({ children }: ILookupFieldProviderProps) => {
    const [value, setValue] = useState(null); // Initialisieren Sie Ihren Zustand hier

    return <LookupFieldContext.Provider value={value}>{children}</LookupFieldContext.Provider>;
};

export default LookupFieldProvider;

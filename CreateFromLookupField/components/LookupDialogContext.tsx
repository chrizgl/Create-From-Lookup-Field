// LookupContext.js
import React from 'react';
import { ILookupDialogContext } from '../interfaces/ILookupDialogContext';

const LookupDialogContext = React.createContext<ILookupDialogContext | null>(null);

export default LookupDialogContext;

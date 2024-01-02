// LookupContext.js
import React from 'react';
import { IInputActionBarContext } from '../interfaces/IInputActionBarContext';

const InputActionBarContext = React.createContext<IInputActionBarContext | null>(null);

export default InputActionBarContext;

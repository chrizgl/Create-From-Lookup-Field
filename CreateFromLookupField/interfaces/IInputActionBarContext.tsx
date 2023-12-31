import { SetStateAction } from 'react';
import { IButtonState } from './IButtonState';
import { ILookupDialogState } from './ILookupDialogState';

interface IInputActionBarContext {
    // the current value of the input field and it's setter:
    inputValue: string;
    setInputValue: (value: string) => void;
    // the current state of the search button and it's setter:
    searchState: IButtonState;
    setSearchState: (value: IButtonState) => void;
    // the current state of the create button and it's setter:
    createState: IButtonState;
    setCreateState: (value: IButtonState) => void;
    // the current state of the open button and it's setter:
    openState: IButtonState;
    setOpenState: (value: IButtonState) => void;
    // the current state of the valid input and it's setter:
    validInputState: boolean;
    setValidInputState: (value: boolean) => void;
    // the current visibility state of the create button and it's setter:
    createEnabledState: boolean;
    setCreateEnabledState: (value: boolean) => void;

    // the current state of the lookup dialog and it's setter:
    lookupDialogState: ILookupDialogState;
    setLookupDialogState: (value: SetStateAction<ILookupDialogState>) => void;
}

export { IInputActionBarContext };

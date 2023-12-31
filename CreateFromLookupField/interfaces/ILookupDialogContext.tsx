import { ILookupDialogState } from './ILookupDialogState';

interface ILookupDialogContext {
    // the current state of the lookup dialog and it's setter:
    lookupDialogState: ILookupDialogState;
    setLookupDialogState: (value: React.SetStateAction<ILookupDialogState>) => void;
}

export { ILookupDialogContext };

import { ILookupDialogState } from './ILookupDialogState';

interface ILookupDialogProps {
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
    setLookupDialogState: (value: React.SetStateAction<ILookupDialogState>) => void;
}

export { ILookupDialogProps };

import { ILookupDialogState } from './ILookupDialogState';
import { IConfig } from './IConfig';

interface ILookupDialogProps {
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
    setLookupDialogState: (value: React.SetStateAction<ILookupDialogState>) => void;
    lookupDialogState: ILookupDialogState;
    config: IConfig;
}

export { ILookupDialogProps };

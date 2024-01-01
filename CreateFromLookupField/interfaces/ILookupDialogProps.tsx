import { IConfig } from './IConfig';

interface ILookupDialogProps {
    onChangeRequest: (lookupValue: ComponentFramework.LookupValue[]) => void;
    config: IConfig;
}

export { ILookupDialogProps };

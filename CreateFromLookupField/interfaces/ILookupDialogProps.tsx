import { IConfig } from './IConfig';

interface ILookupDialogProps {
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
    config: IConfig;
}

export { ILookupDialogProps };

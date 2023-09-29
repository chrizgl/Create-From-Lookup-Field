import { IConfig } from './IConfig';
interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    config: IConfig;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

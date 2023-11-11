import { IConfig } from './IConfig';
interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    config: IConfig;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    lookupViewId: string;
    lookupEntityName: string;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

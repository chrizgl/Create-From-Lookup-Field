import { IWebApi } from './IWebApi';

interface ICreateFromLookupProps {
    webApiProps: IWebApi;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValue: ComponentFramework.LookupValue[];
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    lookupViewId: string;
    lookupEntityName: string;
    openOnSidePane: any;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

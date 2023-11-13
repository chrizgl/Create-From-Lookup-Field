import OpenOnSidePane from '../components/OpenOnSidePane';
import { IConfig } from './IConfig';

interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    config: IConfig;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValue: ComponentFramework.LookupValue[];
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    lookupViewId: string;
    lookupEntityName: string;
    openOnSidePane: OpenOnSidePane;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

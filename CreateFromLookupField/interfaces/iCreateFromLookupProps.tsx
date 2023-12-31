import { IConfig } from './IConfig';

interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webApi: ComponentFramework.WebApi;
    config: IConfig;
    lookupValue: ComponentFramework.LookupValue[];
    currentValue: string;
    lookupViewId: string;
    lookupEntityName: string;
    openOnSidePane: any;
    onChangeRequest: (lookupValue: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

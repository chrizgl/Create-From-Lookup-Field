import { IConfig } from './IConfig';

interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webApi: ComponentFramework.WebApi;
    config: IConfig;
    lookupValue: ComponentFramework.LookupValue[];
    lookupViewId: string;
    lookupEntityName: string;
    openOnSidePane: any;
    onChangeRequest: (lookupValue: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

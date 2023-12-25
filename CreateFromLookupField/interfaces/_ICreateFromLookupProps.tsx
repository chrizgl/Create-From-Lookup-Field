import { IConfig } from './_IConfig';

interface ICreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webApi: ComponentFramework.WebApi;
    config: IConfig;
    lookupValue: ComponentFramework.LookupValue[];
    currentValue: string;
    lookupViewId: string;
    lookupEntityName: string;
    openOnSidePane: any;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
}

export { ICreateFromLookupProps };

import { ReactNode } from 'react';
import { IConfig } from './IConfig';

interface IInputActionBarProvider {
    children: ReactNode;
    props: {
        utils: ComponentFramework.Utility;
        webApi: ComponentFramework.WebApi;
        config: IConfig;
        onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
    };
}

export { IInputActionBarProvider };

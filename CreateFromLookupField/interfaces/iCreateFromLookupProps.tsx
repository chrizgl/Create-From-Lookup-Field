import { IInputs } from '../generated/ManifestTypes';
import iConfig from './iConfig';

export default interface iCreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    config: iConfig;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    onChangeRequest: (value: ComponentFramework.LookupValue[]) => void;
    // onSearchRequest: (text: string) => Promise<boolean>;
    // onCreateRequest: (text: string) => Promise<boolean>;
}

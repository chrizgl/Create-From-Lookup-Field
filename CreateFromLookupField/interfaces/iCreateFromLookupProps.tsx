import { IInputs } from '../generated/ManifestTypes';

export default interface iCreateFromLookupProps {
    utils: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    config: any;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    onSearchRequest: (text: string) => Promise<boolean>;
    onCreateRequest: (text: string) => Promise<boolean>;
}

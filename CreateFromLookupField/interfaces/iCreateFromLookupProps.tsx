import { IInputs } from '../generated/ManifestTypes';

export interface iCreateFromLookupProps {
    utils: ComponentFramework.Utility;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    onSearchRequest: (text: string) => Promise<boolean>;
    onCreateRequest: (text: string) => Promise<boolean>;
}

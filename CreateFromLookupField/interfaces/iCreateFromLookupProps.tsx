import { IInputs } from '../generated/ManifestTypes';

export interface iCreateFromLookupProps {
    input: string | undefined;
    utils: ComponentFramework.Utility;
    isDisabled: boolean;
    currentValue: string;
    isCreateEnabled: boolean;
    onRequest: (text: string) => void;
    onSearchRequest: (text: string) => Promise<boolean>;
    onCreateRequest: (text: string) => Promise<boolean>;
}

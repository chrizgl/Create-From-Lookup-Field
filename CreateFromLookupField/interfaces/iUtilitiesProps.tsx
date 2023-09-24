import { IInputs } from '../generated/ManifestTypes';

export interface iUtilitiesProps {
    utils: ComponentFramework.Utility;
    onSearchRequest: (text: string) => Promise<boolean>;
    onCreateRequest: (text: string) => Promise<boolean>;
}

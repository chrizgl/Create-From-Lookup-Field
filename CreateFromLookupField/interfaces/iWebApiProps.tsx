import { IInputs } from '../generated/ManifestTypes';
import iConfig from './iConfig';

export default interface iWebApiProps {
    utils: ComponentFramework.Utility;
    webApi: ComponentFramework.WebApi;
    config: iConfig;
}

import iWebApiProps from '../interfaces/iWebApiProps';
import iUpdateField from '../interfaces/iUpdateField';
import iConfig from '../interfaces/iConfig';
import { IInputs } from '../generated/ManifestTypes';

class WebApiRequest {
    private _webApi: ComponentFramework.WebApi;
    private _config: iConfig;

    constructor(webApi: ComponentFramework.WebApi, config: iConfig) {
        this._webApi = webApi;
        this._config = config;
    }

    public async createRecord(value: string) {
        let createdRecord = false;
        let createdRecordId: any; // replace any with correct type later
        const lookupValue: ComponentFramework.LookupValue[] = [];
        const recordData: ComponentFramework.WebApi.Entity = {}; // store record data
        recordData[`${this._config.lookupColumnName}`] = value;
        // Set payload for update fields from config
        this._config.updateColumns?.forEach((field: iUpdateField) => {
            recordData[field.name] = field.value;
        });
        try {
            const resp = await this._webApi.createRecord(this._config.targetEntityName, recordData);
            if (resp) {
                createdRecordId = resp.id;
                console.log(`Item created with id = ${createdRecordId}.`);
                createdRecord = true;
                lookupValue[0] = new Object() as ComponentFramework.LookupValue;
                lookupValue[0] = {
                    id: createdRecordId,
                    name: value,
                    entityType: this._config.targetEntityName,
                };
                // this.onChange();
                console.log('kommt aus der neuen Klasse: ' + lookupValue);
            } else {
                createdRecord = false;
            }
            return {
                isCreated: createdRecord,
                lookupValue: lookupValue ?? null,
            };
        } catch (error) {
            console.log(error);
        }
    }
}
export default WebApiRequest;

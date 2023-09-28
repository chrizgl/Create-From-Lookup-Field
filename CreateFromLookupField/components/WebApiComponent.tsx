import iUpdateField from '../interfaces/iUpdateField';
import iConfig from '../interfaces/iConfig';

class WebApiRequest {
    private _webApi: ComponentFramework.WebApi;
    private _config: iConfig;
    private _lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    private _lookupValue: ComponentFramework.LookupValue[] = [];

    constructor(webApi: ComponentFramework.WebApi, config: iConfig) {
        this._webApi = webApi;
        this._config = config;
    }
    public async retrieveRecords(value: string) {
        let targetEntityId = '';
        console.log(`Searching for ${value}`);
        // Retrieve select for search string form config
        const selectString = this._config.selectedColumns?.join(',');
        // const filterString = this._config.filter[0].name + ' eq ' + this._config.filter[0].value;
        let foundRecords: boolean;
        const valueToSearch = "'" + value + "'";
        const searchString = `?$select=${selectString}&$filter=${this._config.lookupColumnName} eq ${valueToSearch}`; // and ${filterString}&$top=5`;
        try {
            const result = await this._webApi.retrieveMultipleRecords(this._config.targetEntityName, searchString);
            if (result && result.entities.length > 0) {
                console.log(`${result.entities.length} records successfully retrieved`);
                this._lookupValues = result;
                targetEntityId = result.entities[0][`${this._config.lookupColumn}`];
                // define lookupValue
                this._lookupValue[0] = new Object() as ComponentFramework.LookupValue;
                this._lookupValue[0] = {
                    id: targetEntityId,
                    name: value,
                    entityType: this._config.targetEntityName,
                };
                foundRecords = true;
            } else {
                foundRecords = false;
            }
            return { hasFound: foundRecords, lookupValue: this._lookupValue, lookupValues: this._lookupValues };
        } catch (error) {
            console.log('Failed to retrieve records');
        }
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

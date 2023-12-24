import { IUpdateField } from '../interfaces/IUpdateField';
import { IWebApi } from '../interfaces/IWebApi';

const WebApiRequest = (props: IWebApi) => {
    const _webApi = props.webApi;
    const _config = props.config;
    const _utils = props.utils;
    let _lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    const _lookupValue: ComponentFramework.LookupValue[] = [];

    const getEntity = async () => {
        const result = await _utils.getEntityMetadata('cgsol_part');
        if (result) {
            return result;
        }
    };

    const retrieveRecords = async (value: string) => {
        let targetEntityId = '';
        // Retrieve select for search string form config
        const selectString = _config.selectedColumns?.join(',');
        // const filterString = this._config.filter[0].name + ' eq ' + this._config.filter[0].value;
        let foundRecords: boolean;
        const valueToSearch = "'" + value + "'";
        const searchString = `?$select=${selectString}&$filter=${_config.lookupColumnName} eq ${valueToSearch}`; // and ${filterString}&$top=5`;
        try {
            const result = await _webApi.retrieveMultipleRecords(_config.targetEntityName, searchString);
            if (result && result.entities.length > 0) {
                console.log(`${result.entities.length} records successfully retrieved`);
                _lookupValues = result;
                targetEntityId = result.entities[0][`${_config.lookupColumn}`];
                // define lookupValue
                _lookupValue[0] = new Object() as ComponentFramework.LookupValue;
                _lookupValue[0] = {
                    id: targetEntityId,
                    name: value,
                    entityType: _config.targetEntityName,
                };
                foundRecords = true;
            } else {
                foundRecords = false;
            }
            return { hasFound: foundRecords, lookupValue: _lookupValue, lookupValues: _lookupValues };
        } catch (error) {
            console.log('Failed to retrieve records');
        }
    };

    const createRecord = async (value: string) => {
        let createdRecord = false;
        let createdRecordId: any; // replace any with correct type later
        const lookupValue: ComponentFramework.LookupValue[] = [];
        const recordData: ComponentFramework.WebApi.Entity = {}; // store record data
        recordData[`${_config.lookupColumnName}`] = value;
        // Set payload for update fields from config
        _config.updateColumns?.forEach((field: IUpdateField) => {
            recordData[field.name] = field.value;
        });
        try {
            const resp = await _webApi.createRecord(_config.targetEntityName, recordData);
            if (resp) {
                createdRecordId = resp.id;
                console.log(`Item created with id = ${createdRecordId}.`);
                createdRecord = true;
                lookupValue[0] = new Object() as ComponentFramework.LookupValue;
                lookupValue[0] = {
                    id: createdRecordId,
                    name: value,
                    entityType: _config.targetEntityName,
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
    };
    return { getEntity, retrieveRecords, createRecord };
};
export default WebApiRequest;

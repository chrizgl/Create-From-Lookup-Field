/*
import iWebApiProps from "../interfaces/iWebApiProps";
import iUpdateField from "../interfaces/iUpdateField";

const webApi = (props: iWebApiProps, updateField: iUpdateField) => {
    const webApi = props.webApi;
    async const createRecord = (value: string) => {
        
        let createdRecord: boolean; // store information wether record was created or not
        const recordData: ComponentFramework.WebApi.Entity = {};  // store record data
        //recordData[`${this._config.lookupColumnName}`] = value;
        // Set payload for update fields from config
        //this._config.updateColumns?.forEach((field: iUpdateField) => {
            recordData[field.name] = field.value;
        //});
        try {
            const resp = await webApi.createRecord("account", recordData);
            if (resp) {
                this._targetEntityId = <any>resp.id;
                console.log(`Item created with id = ${this._targetEntityId}.`);
                createdRecord = true;
                this._lookupValue[0] = new Object() as ComponentFramework.LookupValue;
                this._lookupValue[0] = {
                    id: this._targetEntityId,
                    name: value,
                    entityType: this._targetEntityName,
                };
        }
        catch {
            console.log('Item creation failed.')
        }


            this.onChange();
        } else {
            createdRecord = false;
        }
        return createdRecord;
    }
}
*/

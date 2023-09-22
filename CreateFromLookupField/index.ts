import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { iCreateFromLookupProps } from './interfaces/iCreateFromLookupProps';
import { iUpdateField } from './interfaces/iUpdateField';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentValue: string;
    private _sourceEntityId: string;
    private _sourceEntityName: string;
    private _targetEntityId: string;
    private _targetEntityName: string;
    private _isCreateEnabled: boolean;
    private _config: any;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        this._context = context;
        this._root = createRoot(container!);
        this._sourceEntityId = this._context.parameters.sourceEntityId.raw || '';
        this._isCreateEnabled = false;
        this._config = JSON.parse(this._context.parameters.configJSON.raw ?? '');
        this._targetEntityName = this._config.targetEntityName;
        this._sourceEntityName = this._config.sourceEntityName;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const inputValue = context.parameters.searchInputField.raw || '';
        const lookupValue: ComponentFramework.LookupValue = context.parameters.lookUpColumn.raw[0];
        const propertyValue = `name: ${lookupValue.name} entityType: ${lookupValue.entityType} id: ${lookupValue.id}`;
        console.log(`propertyValue = ${propertyValue}`);
        const props: iCreateFromLookupProps = {
            input: inputValue,
            utils: context.utils,
            isDisabled: false,
            isCreateEnabled: this._isCreateEnabled,
            currentValue: this._currentValue,
            onRequest: this.onChange,
            onSearchRequest: this.retrieveRecords.bind(this),
            onCreateRequest: this.createRecord.bind(this),
        };
        // Render the React component
        console.log(`propertyValue = ${propertyValue}`);
        this._root.render(createElement(CreateFromLookupApp, props));
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this._root.unmount();
    }

    private onChange = (value: string) => {
        this._currentValue = value;
        this._notifyOutputChanged();
    };
    private async createRecord(value: string): Promise<boolean> {
        let createdRecord: boolean;
        const recordData: ComponentFramework.WebApi.Entity = {};
        recordData[`${this._config.lookupColumnName}`] = value;
        // Set payload for update fields from config
        this._config.updateColumns?.forEach((field: iUpdateField) => {
            recordData[field.name] = field.value;
        });
        const resp = await this._context.webAPI
            .createRecord(this._targetEntityName, recordData)
            .catch((err) => console.log('Item creation failed.'));

        if (resp) {
            // Currently there is a bug with EntityReference defination
            // It should be resp.id.guid as per doc but response contains the record GUID at resp.id
            // Workaround is to typecast resp.is into any
            this._targetEntityId = <any>resp.id;
            console.log(`Item created with id = ${this._targetEntityId}.`);
            createdRecord = true;
            this.relateRecord();
        } else {
            createdRecord = false;
        }
        return createdRecord;
    }
    private async retrieveRecords(value: string): Promise<boolean> {
        console.log(`Searching for ${value}`);
        // Retrieve select for search string form config
        const selectString = this._config.selectedColumns?.join(',');
        const filterString = this._config.filter[0].name + ' eq ' + this._config.filter[0].value;
        let foundRecords: boolean;
        const valueToSearch = "'" + value + "'";
        const searchString = `?$select=${selectString}&$filter=${this._config.lookupColumnName} eq ${valueToSearch} and ${filterString}&$top=5`;
        const result = await this._context.webAPI
            .retrieveMultipleRecords(this._targetEntityName, searchString)
            .catch((err) => console.log('Failed to retrieve records'));
        if (result && result.entities.length > 0) {
            console.log(`${result.entities.length} records successfully retrieved`);
            this._targetEntityId = result.entities[0][`${this._config.lookupColumn}`];
            this.relateRecord();
            foundRecords = true;
        } else {
            foundRecords = false;
        }
        return foundRecords;
    }
    private relateRecord(): void {
        console.log(`Relating ${this._sourceEntityName} with ${this._targetEntityName}`);
        console.log(`targetEntityMultiple = ${this._config.targetEntityMultiple}`);
        if (this._targetEntityId && this._sourceEntityId) {
            const recordData: ComponentFramework.WebApi.Entity = {};
            recordData[`${this._config.sourceLookupField}@odata.bind`] = `/${this._config.targetEntityMultiple}(${this._targetEntityId})`;
            this._context.webAPI.updateRecord(this._sourceEntityName, this._sourceEntityId, recordData);
        } else {
            console.log(`Source Entity Id = ${this._sourceEntityId}`);
            console.log(`Target Entity Id = ${this._targetEntityId}`);
            console.log(`Failed to relate ${this._sourceEntityName} with ${this._targetEntityName}`);
        }
    }
}

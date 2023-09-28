import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import iCreateFromLookupProps from './interfaces/iCreateFromLookupProps';
import iUpdateField from './interfaces/iUpdateField';
import iConfig from './interfaces/iConfig';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentValue: string;
    private _targetEntityId: string;
    private _targetEntityName: string;
    private _isCreateEnabled: boolean;
    private _config: iConfig;
    private _lookupValue: ComponentFramework.LookupValue[] = [];
    private _lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._root = createRoot(container!);
        this._isCreateEnabled = false;
        this._config = JSON.parse(this._context.parameters.configJSON.raw ?? '');
        this._targetEntityName = this._config.targetEntityName;
        this._lookupValues = new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const props: iCreateFromLookupProps = {
            utils: context.utils,
            webAPI: context.webAPI,
            config: this._config,
            isDisabled: false,
            isCreateEnabled: this._isCreateEnabled,
            currentValue: this._currentValue,
            lookupValues: this._lookupValues,
            onSearchRequest: this.retrieveRecords.bind(this),
            onChangeRequest: this.onChange.bind(this),
            // onCreateRequest: this.createRecord.bind(this),
        };
        // Render the React component
        this._root.render(createElement(CreateFromLookupApp, props));
    }

    public getOutputs(): IOutputs {
        return { lookupField: this._lookupValue };
    }

    public destroy(): void {
        this._root.unmount();
    }

    private onChange = (value: ComponentFramework.LookupValue[]) => {
        this._lookupValue = value;
        this._notifyOutputChanged();
    };
    /*
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
            this._lookupValue[0] = new Object() as ComponentFramework.LookupValue;
            this._lookupValue[0] = {
                id: this._targetEntityId,
                name: value,
                entityType: this._targetEntityName,
            };
            this.onChange();
        } else {
            createdRecord = false;
        }
        return createdRecord;
    }
    */
    private async retrieveRecords(value: string): Promise<boolean> {
        console.log(`Searching for ${value}`);
        // Retrieve select for search string form config
        const selectString = this._config.selectedColumns?.join(',');
        // const filterString = this._config.filter[0].name + ' eq ' + this._config.filter[0].value;
        let foundRecords: boolean;
        const valueToSearch = "'" + value + "'";
        const searchString = `?$select=${selectString}&$filter=${this._config.lookupColumnName} eq ${valueToSearch}`; // and ${filterString}&$top=5`;
        const result = await this._context.webAPI
            .retrieveMultipleRecords(this._targetEntityName, searchString)
            .catch((err) => console.log('Failed to retrieve records'));
        if (result && result.entities.length > 0) {
            console.log(`${result.entities.length} records successfully retrieved`);
            this._lookupValues = result;
            this._targetEntityId = result.entities[0][`${this._config.lookupColumn}`];
            // define lookupValue
            this._lookupValue[0] = new Object() as ComponentFramework.LookupValue;
            this._lookupValue[0] = {
                id: this._targetEntityId,
                name: value,
                entityType: this._targetEntityName,
            };
            // this.onChange();
            foundRecords = true;
        } else {
            foundRecords = false;
        }
        return foundRecords;
    }
}

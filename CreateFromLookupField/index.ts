import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp, { ICreateFromLookupProps } from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _isReadOnly: boolean;
    private _entityName: string;
    private _entityTypes: string[];
    private _viewIds: string[];
    private _currentValue: string;
    private _inputValue: string;
    private _sourceRecordId: any;
    private _targetRecordId: string | undefined;
    private _isCreateEnabled: boolean;
    private _sourceEntityTypeName: string | undefined;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        this._context = context;
        this._root = createRoot(container!);
        this._notifyOutputChanged = notifyOutputChanged;
        this._entityName = 'cgsol_prt_partnumber';
        this._isCreateEnabled = false;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const inputValue = context.parameters.input.raw || '';
        const isDisabled = context.mode.isControlDisabled;
        this._sourceRecordId = context.resources.getString('cgsol_prt_partnumber');

        const props: ICreateFromLookupProps = {
            input: inputValue,
            utils: context.utils,
            isDisabled: false,
            isCreateEnabled: this._isCreateEnabled,
            currentValue: this._currentValue,
            onRequest: this.onChange,
            onSearchRequest: this.retrieveRecords.bind(this),
            onCreateRequest: this.createRecord.bind(this),
        };
        console.log('currentValue', props.currentValue);
        this._root.render(createElement(CreateFromLookupApp, props));
    }

    public getOutputs(): IOutputs {
        return {
            // lookupField: this._lookupField,
        };
    }

    public destroy(): void {
        this._root.unmount();
    }

    private onChange = (value: string) => {
        this._currentValue = value;
        this._notifyOutputChanged();
        console.log('onChange called -- and currentValue is: ', this._currentValue);
    };
    private async createRecord(value: string): Promise<boolean> {
        let createdRecord: boolean;
        const recordData: ComponentFramework.WebApi.Entity = {};
        recordData['cgsol_prt_partnumber'] = value;
        recordData['cgsol_prt_generation'] = 0;
        recordData['cgsol_prt_iscurrent'] = true;

        const resp = await this._context.webAPI
            .createRecord('cgsol_part', recordData)
            .catch((err) => console.log('Contact creation failed.'));

        if (resp) {
            // Currently there is a bug with EntityReference defination
            // It should be resp.id.guid as per doc but response contains the record GUID at resp.id
            // Workaround is to typecast resp.is into any
            this._targetRecordId = <any>resp.id;
            // this.outputLabel.innerHTML = `Contact created with id = ${this.contactEntityId}.`;
            createdRecord = true;
            this.relateRecord();
        } else {
            createdRecord = false;
        }
        return createdRecord;
    }
    private async retrieveRecords(value: string): Promise<boolean> {
        let foundRecords: boolean;
        const valueToSearch = "'" + value + "'";
        const searchString = `?$select=cgsol_prt_partnumber,cgsol_prt_generation&$filter=contains(cgsol_prt_partnumber, ${valueToSearch})&$top=3`;
        const result = await this._context.webAPI
            .retrieveMultipleRecords('cgsol_part', searchString)
            .catch((err) => console.log('Failed to retrieve records'));
        if (result && result.entities.length > 0) {
            console.log(`${result.entities.length} records successfully retrieved`);
            result.entities.forEach((ele) => {
                console.log('Part Number: ' + ele.cgsol_prt_partnumber + '\t\t Generation: ' + ele.cgsol_prt_generation);
            });
            foundRecords = true;
        } else {
            foundRecords = false;
        }
        console.log('foundRecords: ', foundRecords);
        return foundRecords;
    }
    private relateRecord(): void {
        console.log('relateRecord called');
        const recordId = (this._context as any)?.page?.entityId ?? '';
        console.log('\t _targetRecordId: ', this._targetRecordId);
        console.log('\t recordId: ', recordId);
        if (this._targetRecordId) {
            const recordData: ComponentFramework.WebApi.Entity = {};
            console.log('\t _sourceRecordId: ', this._sourceRecordId);
            console.log('\t _target: ', this._targetRecordId);
            recordData['cgsol_prt_ChildPart@odata.bind'] = `/cgsol_parts(${recordId})`;
            this._context.webAPI.updateRecord('cgsol_part', this._targetRecordId || '', recordData);
            console.log(`Contact with id = ${this._targetRecordId} updated.`);
        } else {
            console.log(`Contact id is not defined.`);
        }

        // this.retrieveContactButton.disabled = false;
    }
}

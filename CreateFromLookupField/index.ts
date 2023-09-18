import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp, { ICreateFromLookupProps } from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

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
    private _selectedValue: ComponentFramework.LookupValue[] | undefined;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        this._context = context;
        this._root = createRoot(container!);
        this._sourceEntityId = this._context.parameters.entityId.raw || '';
        this._targetEntityName = 'cgsol_prt_partnumber';
        this._isCreateEnabled = false;
        this._notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const inputValue = context.parameters.input.raw || '';
        const isDisabled = context.mode.isControlDisabled;
        //this._sourceEntityId = this._context.parameters.entityId.raw || '';
        this._sourceEntityName = this._context.parameters.entityName.raw || '';

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
        // console.log('currentValue', props.currentValue);
        this._root.render(createElement(CreateFromLookupApp, props));
    }

    public getOutputs(): IOutputs {
        return {
            // lookupField: this._lookupField,
            // input: this._currentValue,
        };
    }

    public destroy(): void {
        this._root.unmount();
    }

    private onChange = (value: string) => {
        this._currentValue = value;
        this._notifyOutputChanged();
        // console.log('onChange called -- and currentValue is: ', this._currentValue);
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
            this._targetEntityId = <any>resp.id;
            console.log(`Part created with id = ${this._targetEntityId}.`);
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
        const searchString = `?$select=cgsol_prt_partnumber,cgsol_prt_generation,cgsol_partid,cgsol_prt_iscurrent&$filter=cgsol_prt_partnumber eq ${valueToSearch} and cgsol_prt_iscurrent eq true&$top=5&$orderby=cgsol_prt_generation`;
        const result = await this._context.webAPI
            .retrieveMultipleRecords('cgsol_part', searchString)
            .catch((err) => console.log('Failed to retrieve records'));
        if (result && result.entities.length > 0) {
            console.log(`${result.entities.length} records successfully retrieved`);
            result.entities.forEach((ele) => {
                console.log('Part Number: ' + ele.cgsol_prt_partnumber + '\t\t Generation: ' + ele.cgsol_prt_generation);
            });
            this._targetEntityId = result.entities[0].cgsol_partid;
            this.relateRecord();
            // console.log('targetEntityId within retrieveRecords() ', this._targetEntityId);
            foundRecords = true;
        } else {
            foundRecords = false;
        }
        // console.log('foundRecords: ', foundRecords);
        return foundRecords;
    }
    private relateRecord(): void {
        // console.log('sourceEntityId within relateRecord() ', this._sourceEntityId);
        // console.log('targetEntityId within relateRecord() ', this._targetEntityId);

        if (this._targetEntityId) {
            const recordData: ComponentFramework.WebApi.Entity = {};
            recordData['cgsol_asn_ChildPart@odata.bind'] = `/cgsol_parts(${this._targetEntityId})`;
            this._context.webAPI.updateRecord(this._sourceEntityName, this._sourceEntityId, recordData);
            // console.log(`Part Assignment with id = ${this._sourceEntityId} updated.`);
        } else {
            console.log(`Part id is not defined.`);
        }
    }
}

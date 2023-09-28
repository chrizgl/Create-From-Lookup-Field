import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import iCreateFromLookupProps from './interfaces/iCreateFromLookupProps';
import iConfig from './interfaces/iConfig';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentValue: string;
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
            onChangeRequest: this.onChange.bind(this),
        };
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
}

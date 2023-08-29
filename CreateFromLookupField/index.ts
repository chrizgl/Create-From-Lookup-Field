import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp, { ICreateFromLookupProps } from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { lookup } from 'dns';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _lookupField: any[] = [];
    private _isReadOnly: boolean;
    private _defaultEntityType : string;
	private _viewId : string;
	private _entityTypes : string[];
	private _viewIds : string[];
    private _currentValue: string

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        this._root = createRoot(container!);
        this._notifyOutputChanged = notifyOutputChanged;
        this._lookupField = context.parameters.lookupField.raw || [];
        this._isReadOnly = context.mode.isControlDisabled;
        this._currentValue = this._lookupField[0].name;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const lookupField = context.parameters.lookupField;
        const isDisabled = false;

        const props: ICreateFromLookupProps = {
            lookupField: lookupField,
            utils: context.utils,
            isDisabled: false,
            currentValue: this._currentValue,
            onRequest: this.onChange,
        };
        console.log('currentValue', props.currentValue)
        this._root.render(createElement(CreateFromLookupApp, props));
    }

    public getOutputs(): IOutputs {
        return {
        };
    }

    public destroy(): void {
        this._root.unmount();
    }

    private onChange = (value: string) => {
        this._currentValue = value;
        this._notifyOutputChanged();
        console.log('onChange called -- and currentValue is: ', this._currentValue)
    };
}

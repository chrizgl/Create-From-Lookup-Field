import { IInputs, IOutputs } from './generated/ManifestTypes';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ICreateFromLookupProps } from './interfaces/ICreateFromLookupProps';
import { IConfig } from './interfaces/IConfig';
import { IOpenOnSidePaneProps } from './interfaces/IOpenOnSidePaneProps';
import CreateFromLookupApp from './components/LookupFieldApp';
import OpenOnSidePane from './components/OpenOnSidePane';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentValue: string;
    private _isCreateEnabled: boolean;
    private _config: IConfig;
    private _lookupValue: ComponentFramework.LookupValue[] = [];
    private _lookupValues: ComponentFramework.WebApi.RetrieveMultipleResponse;
    private _lookupViewId: string;
    private _lookupEntityName: string;

    private _openOnSiedePane: OpenOnSidePane;
    private _openOnSidePaneProps: IOpenOnSidePaneProps;

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
        this._lookupValue = this._context.parameters.lookupField.raw ?? [];
        this._lookupValues = new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse;
        this._lookupViewId = this._context.parameters.lookupField.getViewId();
        this._lookupEntityName = this._context.parameters.lookupField.getTargetEntityType();

        this._openOnSidePaneProps = {
            page: (<any>this._context).page,
            alwaysRender:  this._context.parameters.alwaysRender.raw == '1' ? true : false,
            canClose: this._context.parameters.canClose.raw == '1' ? true : false,
            hideHeader: this._context.parameters.hideHeader.raw == '1' ? true : false,
            width: this._context.parameters.width.raw!,
            lookupValue: this._lookupValue,
        }
        this._openOnSiedePane = new OpenOnSidePane(this._openOnSidePaneProps);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log('updateView called');
        const props: ICreateFromLookupProps = {
            utils: context.utils,
            webAPI: context.webAPI,
            config: this._config,
            isDisabled: false,
            isCreateEnabled: this._isCreateEnabled,
            currentValue: this._currentValue,
            lookupValue: this._lookupValue,
            lookupValues: this._lookupValues,
            lookupViewId: this._lookupViewId,
            lookupEntityName: this._lookupEntityName,
            openOnSidePane: this._openOnSiedePane,
            onChangeRequest: this.onChange.bind(this), // was wird hier wirklich gebinded? 
        };
        this._root.render(createElement(CreateFromLookupApp, props));
        console.log('updateView ended');
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

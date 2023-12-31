import { IInputs, IOutputs } from './generated/ManifestTypes';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IConfig } from './interfaces/IConfig';
import CreateFromLookupApp from './components/LookupFieldApp';
import { ICreateFromLookupProps } from './interfaces/ICreateFromLookupProps';
import OpenOnSidePane from './components/OpenOnSidePane';
import { IOpenOnSidePaneProps } from './interfaces/IOpenOnSidePaneProps';
import LookupFieldProvider from './components/InputActionBarProvider';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentValue: string;
    private _config: IConfig;
    private _lookupValue: ComponentFramework.LookupValue[] = [];
    private _lookupViewId: string;
    private _lookupEntityName: string;

    private _openOnSiedePane: any;
    private _openOnSidePaneProps: IOpenOnSidePaneProps;

    private _counter: number;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ) {
        // Add control initialization code
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._root = createRoot(container!);

        this._config = JSON.parse(this._context.parameters.configJSON.raw ?? '');
        this._lookupValue = this._context.parameters.lookupField.raw ?? [];
        this._lookupViewId = this._context.parameters.lookupField.getViewId();
        this._lookupEntityName = this._context.parameters.lookupField.getTargetEntityType();

        this._openOnSidePaneProps = {
            page: (<any>this._context).page,
            alwaysRender: this._context.parameters.alwaysRender.raw == '1',
            canClose: this._context.parameters.canClose.raw == '1',
            hideHeader: this._context.parameters.hideHeader.raw == '1',
            width: this._context.parameters.width.raw!,
            lookupValue: this._lookupValue,
        };
        this._openOnSiedePane = OpenOnSidePane(this._openOnSidePaneProps);
        this._counter = 0;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._counter++;
        console.log('updateView call no.: ' + this._counter);

        const props: ICreateFromLookupProps = {
            utils: context.utils,
            webApi: context.webAPI,
            config: this._config,
            currentValue: this._currentValue,
            lookupValue: this._lookupValue,
            lookupViewId: this._lookupViewId,
            lookupEntityName: this._lookupEntityName,
            openOnSidePane: this._openOnSiedePane,
            onChangeRequest: this.onChange.bind(this),
        };
        this._root.render(createElement(CreateFromLookupApp, props));
        // console.log('lookupViewId: ' + this._lookupViewId);
        // console.log('lookupEntityName: ' + this._lookupEntityName);
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

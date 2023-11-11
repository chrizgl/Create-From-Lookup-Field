import { IInputs, IOutputs } from './generated/ManifestTypes';
import CreateFromLookupApp from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ICreateFromLookupProps } from './interfaces/ICreateFromLookupProps';
import { IConfig } from './interfaces/IConfig';

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
    private _panes: any;
    private _container: HTMLDivElement;

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
        this._lookupViewId = this._context.parameters.lookupField.getViewId();
        this._lookupEntityName = this._context.parameters.lookupField.getTargetEntityType();
        this._container = container;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const props: ICreateFromLookupProps = {
            utils: context.utils,
            webAPI: context.webAPI,
            config: this._config,
            isDisabled: false,
            isCreateEnabled: this._isCreateEnabled,
            currentValue: this._currentValue,
            lookupValues: this._lookupValues,
            lookupViewId: this._lookupViewId,
            lookupEntityName: this._lookupEntityName,
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

    public GetPanes() {
        this._panes = (Xrm as any).App!.sidePanes;
    }

    public OpenOnSidePane() {
        // IF THE COLUMN IS NULL
        if (this.HasValue()) {
            // VERIFY IF THE RECORD IS OPENED ON PANE
            if (!this.IsOpened()) {
                this._panes
                    .createPane({
                        title: this._context.parameters.lookupField.raw![0].name!.toUpperCase(),
                        imageSrc: this.RetrieveEntityImage(),
                        alwaysRender: this._context.parameters.alwaysRender.raw == '1' ? true : false,
                        canClose: this._context.parameters.canClose.raw == '1' ? true : false,
                        hideHeader: this._context.parameters.hideHeader.raw == '1' ? true : false,
                        paneId: this._context.parameters.lookupField.raw![0].entityType + ':' + this._context.parameters.lookup.raw![0].id,
                        width: this._context.parameters.width.raw!,
                    })
                    .then((pane: any) => {
                        pane.navigate({
                            pageType: 'entityrecord',
                            entityName: this._context.parameters.lookupField.raw![0].entityType,
                            entityId: this._context.parameters.lookupField.raw![0].id,
                        });
                    });
            } else {
                this.Close();
            }
        }

        if (this._panes.state == 0) this._panes.state = 1;

        this.GetPanes();
    }

    public HasValue(): boolean {
		return this._context.parameters.lookupField.raw!.length == 1
			? true
			: false;
	}

	public IsOpened(): boolean {
		return this._panes.getPane(this._context.parameters.lookupField.raw![0].entityType + ":" + this._context.parameters.lookup.raw![0].id) != undefined
			? true
			: false;
	}

	public Close(): any {
		const pane = this._panes.getPane(this._context.parameters.lookupField.raw![0].entityType + ":" + this._context.parameters.lookup.raw![0].id);
		if (pane !== undefined)
			pane.close();
	}

	private RetrieveEntityImage(): string | undefined {

		let icon: string | undefined;
		const req = new XMLHttpRequest();
		const baseUrl = (<any>this._context).page.getClientUrl();
		const caller = this;
		req.open("GET", baseUrl + "/api/data/v9.1/Entihttps://typescript-eslint.io/rules/no-this-aliastyDefinitions(LogicalName='" + this._context.parameters.lookup.raw![0].entityType + "')?$select=IconSmallName,ObjectTypeCode", false);
		req.setRequestHeader("OData-MaxVersion", "4.0");
		req.setRequestHeader("OData-Version", "4.0");
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		req.onreadystatechange = function () {
			if (this.readyState === 4) {
				req.onreadystatechange = null;
				if (this.status === 200) {
					const result = JSON.parse(this.response);
					if (result.ObjectTypeCode >= 10000 && result.IconSmallName != null)
						icon = baseUrl + "/WebResources/" + result.IconSmallName.toString();
					else
						icon = baseUrl + caller.GetURL(result.ObjectTypeCode);
				}
			}
		};
		req.send();

		return icon;
	}

	private GetURL(objectTypeCode: number) {

		//default icon
		let url = "/_imgs/svg_" + objectTypeCode.toString() + ".svg";

		if (!this.UrlExists(url)) {
			url = "/_imgs/ico_16_" + objectTypeCode.toString() + ".gif";

			if (!this.UrlExists(url)) {
				url = "/_imgs/ico_16_"
					+ objectTypeCode.toString() +
					".png";

				//default icon

				if (!this.UrlExists(url)) {
					url = "/_imgs/ico_16_customEntity.gif";
				}
			}
		}

		return url;
	}

	private UrlExists(url: string) {
		const http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status != 404 && http.status != 500;
	}

    private onChange = (value: ComponentFramework.LookupValue[]) => {
        this._lookupValue = value;
        this._notifyOutputChanged();
    };
}

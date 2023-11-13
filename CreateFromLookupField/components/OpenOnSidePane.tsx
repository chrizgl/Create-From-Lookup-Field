import { IOpenOnSidePaneProps } from "../interfaces/IOpenOnSidePaneProps";

class OpenOnSidePane {
    private _props: IOpenOnSidePaneProps;
    private _panes: any;

    constructor(props: IOpenOnSidePaneProps) {
        this._props = { lookupValue: props.lookupValue, page: props.page, alwaysRender: props.alwaysRender,
            canClose: props.canClose, hideHeader: props.hideHeader, width: props.width};
        this.GetPanes();
        }

    public GetPanes() {
        this._panes = (Xrm as any).App!.sidePanes;
    }

    public OpenOnSidePane(lookupValue: ComponentFramework.LookupValue[]) {
        this._props.lookupValue = lookupValue;
        // IF THE COLUMN IS NULL
        if (this.HasValue()) {
            // VERIFY IF THE RECORD IS OPENED ON PANE

            if (!this.IsOpened()) {
                this._panes
                    .createPane({
                        title: this._props.lookupValue![0].name!.toUpperCase(),
                        imageSrc: this.RetrieveEntityImage(),
                        alwaysRender: this._props.alwaysRender,
                        canClose: this._props.canClose,
                        hideHeader: this._props.hideHeader,
                        paneId: this._props.lookupValue![0].entityType + ':' + this._props.lookupValue![0].id,
                        width: this._props.width,
                    })
                    .then((pane: any) => {
                        pane.navigate({
                            pageType: 'entityrecord',
                            entityName: this._props.lookupValue![0].entityType,
                            entityId: this._props.lookupValue![0].id,
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
        return this._props.lookupValue.length === 1
            ? true
            : false;
    }

    public IsOpened(): boolean {
        return this._panes.getPane(this._props.lookupValue![0].entityType + ":" + this._props.lookupValue![0].id) != undefined
            ? true
            : false;
    }

    public Close(): any {
        const pane = this._panes.getPane(this._props.lookupValue![0].entityType + ":" + this._props.lookupValue![0].id);
        if (pane !== undefined)
            pane.close();
    }

    private RetrieveEntityImage(): any {
        let icon: string | undefined;
        const req = new XMLHttpRequest();
        const baseUrl = (this._props.page.getClientUrl());
        const caller = this;
        req.open("GET", baseUrl + "/api/data/v9.1/EntityDefinitions(LogicalName='" + this._props.lookupValue![0].entityType + "')?$select=IconSmallName,ObjectTypeCode", false);
		req.setRequestHeader("OData-MaxVersion", "4.0");
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
}
export default OpenOnSidePane;
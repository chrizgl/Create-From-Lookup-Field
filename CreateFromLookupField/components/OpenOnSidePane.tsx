import { IOpenOnSidePaneProps } from '../interfaces/IOpenOnSidePaneProps';

const OpenOnSidePane = (props: IOpenOnSidePaneProps) => {
    const _props = {
        page: props.page,
        lookupValue: props.lookupValue,
        alwaysRender: props.alwaysRender,
        canClose: props.canClose,
        hideHeader: props.hideHeader,
        width: props.width,
    };

    let _panes: any;

    const getPanes = () => {
        _panes = (Xrm as any).App!.sidePanes;
    };

    const openOnSidePane = (lookupValue: ComponentFramework.LookupValue[]) => {
        _props.lookupValue = lookupValue;
        getPanes();
        console.log('_props.lookupValue: ' + _props.lookupValue[0].entityType + ':' + _props.lookupValue[0].id) +
            ' - ' +
            _props.lookupValue[0].name!;
        if (hasValue()) {
            if (!isOpened()) {
                _panes
                    .createPane({
                        title: _props.lookupValue![0].name!.toUpperCase(),
                        imageSrc: retrieveEntityImage(),
                        alwaysRender: _props.alwaysRender,
                        canClose: _props.canClose,
                        hideHeader: _props.hideHeader,
                        paneId: _props.lookupValue![0].entityType + ':' + _props.lookupValue![0].id,
                        width: _props.width,
                    })
                    .then((pane: any) => {
                        pane.navigate({
                            pageType: 'entityrecord',
                            entityName: _props.lookupValue![0].entityType,
                            entityId: _props.lookupValue![0].id,
                        });
                    });
            } else {
                closePane();
            }
        }

        if (_panes.state === 0) _panes.state = 1;

        getPanes();
    };

    const hasValue = (): boolean => {
        return _props.lookupValue.length === 1;
    };

    const isOpened = (): boolean => {
        const result = _panes.getPane(_props.lookupValue![0].entityType + ':' + _props.lookupValue![0].id) != undefined ? true : false;
        console.log('isOpened: ' + result);
        return result;
    };

    const closePane = (): any => {
        const pane = _panes.getPane(_props.lookupValue![0].entityType + ':' + _props.lookupValue![0].id);
        if (pane !== undefined) pane.close();
    };

    const retrieveEntityImage = (): any => {
        let icon: string | undefined;
        const req = new XMLHttpRequest();
        const baseUrl = _props.page.getClientUrl();
        req.open(
            'GET',
            baseUrl +
                "/api/data/v9.1/EntityDefinitions(LogicalName='" +
                _props.lookupValue![0].entityType +
                "')?$select=IconSmallName,ObjectTypeCode",
            false,
        );
        req.setRequestHeader('OData-MaxVersion', '4.0');
        req.setRequestHeader('OData-MaxVersion', '4.0');
        req.setRequestHeader('OData-Version', '4.0');
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    const result = JSON.parse(this.response);
                    if (result.ObjectTypeCode >= 10000 && result.IconSmallName != null)
                        icon = baseUrl + '/WebResources/' + result.IconSmallName.toString();
                    else icon = baseUrl + getURL(result.ObjectTypeCode);
                }
            }
        };
        req.send();

        return icon;
    };

    const getURL = (objectTypeCode: number) => {
        //default icon
        let url = '/_imgs/svg_' + objectTypeCode.toString() + '.svg';

        if (!urlExists(url)) {
            url = '/_imgs/ico_16_' + objectTypeCode.toString() + '.gif';

            if (!urlExists(url)) {
                url = '/_imgs/ico_16_' + objectTypeCode.toString() + '.png';

                //default icon

                if (!urlExists(url)) {
                    url = '/_imgs/ico_16_customEntity.gif';
                }
            }
        }

        return url;
    };

    const urlExists = (url: string) => {
        const http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404 && http.status != 500;
    };

    return {
        openOnSidePane,
    };
};
export default OpenOnSidePane;

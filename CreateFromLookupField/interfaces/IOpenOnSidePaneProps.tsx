// Purpose: Interface for OpenOnSidePane component.
interface IOpenOnSidePaneProps {
    lookupValue: ComponentFramework.LookupValue[];
    page: any;
    alwaysRender: boolean;
    canClose: boolean;
    hideHeader: boolean;
    width: number;
}

export { IOpenOnSidePaneProps };

import { IInputs, IOutputs } from './generated/ManifestTypes';
import LookupFieldApp, { ILookupFieldProps } from './components/LookupFieldApp';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

export class CreateFromLookupField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _root: Root;

    // Reference to ComponentFramework Context object
    private _context: ComponentFramework.Context<IInputs>;

    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens
    private _notifyOutputChanged: () => void;

    // Values to be filled based on control context, passed as arguments to lookupObjects API
    private _entityType = '';
    private _defaultViewId = '';

    // Used to store necessary data for a single lookup entity selected during runtime
    private _selectedItem: ComponentFramework.LookupValue;

    // Used to track which lookup property is being updated
    private _updateSelected = false;

    private _lookupValues: ComponentFramework.LookupValue[];

    /**
     * Empty constructor.
     */
    constructor() {}

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ): void {
        this._entityType = context.parameters.lookupfield.getTargetEntityType();
        this._defaultViewId = context.parameters.lookupfield.getViewId();
        this._root = createRoot(container!);
        this._notifyOutputChanged = notifyOutputChanged;
        this.performLookupObjects.bind(this, this._entityType, this._defaultViewId, (value, update = true) => {
            this._selectedItem = value;
            this._updateSelected = update;
        });
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const lookupValue: ComponentFramework.LookupValue = context.parameters.lookupfield.raw[0];
        const props: ILookupFieldProps = {
            lookupValue: lookupValue,
            performLookupObjects: this.performLookupObjects.bind(this, this._entityType, this._defaultViewId, (value, update = true) => {
                this._selectedItem = value;
                this._updateSelected = update;
            }),
            onInputChange: () => {
                this._notifyOutputChanged();
            },
        };
        this._context = context;
        this._root.render(createElement(LookupFieldApp, props));
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        // Send the updated selected lookup item back to the ComponentFramework, based on the currently selected item
        return {
            lookupfield: [this._selectedItem],
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this._root.unmount();
    }
    /*******************/
    /*PRIVATE FUNCTIONS*/
    /*******************/

    private performLookupObjects(
        entityType: string,
        viewId: string,
        setSelected: (value: ComponentFramework.LookupValue, update?: boolean) => void,
    ): void {
        // Used cached values from lookup parameter to set options for lookupObjects API
        const lookupOptions = {
            defaultEntityType: entityType,
            defaultViewId: viewId,
            allowMultiSelect: false,
            entityTypes: [entityType],
            viewIds: [viewId],
        };

        this._context.utils.lookupObjects(lookupOptions).then(
            (success) => {
                if (success && success.length > 0) {
                    // Cache the necessary information for the newly selected entity lookup
                    const selectedReference = success[0];
                    const selectedLookupValue: ComponentFramework.LookupValue = {
                        id: selectedReference.id,
                        name: selectedReference.name,
                        entityType: selectedReference.entityType,
                    };

                    // Update the primary or secondary lookup property
                    setSelected(selectedLookupValue);

                    // Trigger a control update
                    this._notifyOutputChanged();
                } else {
                    setSelected({} as ComponentFramework.LookupValue);
                }
            },
            (error) => {
                console.log(error);
            },
        );
    }
    private notifyChange() {
        this._notifyOutputChanged();
    }
}

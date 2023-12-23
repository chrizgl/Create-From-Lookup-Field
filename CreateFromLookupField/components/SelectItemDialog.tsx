import * as React from 'react';
import {
    Avatar,
    Button,
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    TableCellLayout,
    TableColumnDefinition,
    createTableColumn,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    useRestoreFocusTarget,
} from '@fluentui/react-components';
import { useStyles } from './Styles';
import { mergeClasses } from '@fluentui/react-components';
import { ITableGridItem } from '../interfaces/ITableGridItem';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import { ITableGridField } from '../interfaces/ITableGridField';
import { IConfig } from '../interfaces/IConfig';

class LookupDialog {
    private _props: ILookupDialogProps;
    private _config: IConfig;

    constructor(props: ILookupDialogProps) {
        this._props = { onChangeRequest: props.onChangeRequest, setLookupDialogState: props.setLookupDialogState, config: props.config };
        this._config = props.config;
    }

    // Alternative build where ITableGrid is an array of possible fields:
    private buildItems = (values: ComponentFramework.WebApi.RetrieveMultipleResponse) => {
        const entities = values.entities;
        let items: any[] = [];
        if (entities !== undefined) {
            for (const entity of entities) {
                const fieldMap = new Map<string, ITableGridField>();
                if (entity !== undefined) {
                    for (const field of this._config.fields.values()) {
                        if (field.visible) {
                            fieldMap.set(field.id, { label: entity[field.id] });
                        }
                    }
                    let item = { id: entity[this._config.lookupColumn] };
                    item = Object.assign(item, Object.fromEntries(fieldMap));
                    items.push(item);
                }
            }
        } else {
            items = [];
        }
        return items;
    };
    public show = (state: ILookupDialogState) => {
        const classes = useStyles();
        const dialogClass = mergeClasses(classes.dialog, classes.stackitem);
        const restoreFocusTargetAttribute = useRestoreFocusTarget();

        // Build the items from WebApi response:
        const items = this.buildItems(state.values);

        const columns: TableColumnDefinition<ITableGridField>[] = [];
        // Iterate over the fields and create the columns:
        for (const field of this._config.fields.values()) {
            if (field.visible) {
                columns.push(
                    createTableColumn<ITableGridField>({
                        columnId: field.id,
                        compare: (a: any, b: any) => {
                            return a.label.localeCompare(b.label);
                        },
                        renderHeaderCell: () => {
                            return field.title;
                        },
                        // je nach Typ des Feldes wird ein anderes Layout gerendert:
                        renderCell: (item) => {
                            switch (field.type) {
                                case 'Person': {
                                    return (
                                        <TableCellLayout>
                                            <Avatar name={item[field.id].label?.toString()} />
                                        </TableCellLayout>
                                    );
                                }
                                case 'Text': {
                                    return <TableCellLayout>{item[field.id].label?.toString()}</TableCellLayout>;
                                }
                                case 'Timestamp': {
                                    if (item[field.id].label) {
                                        const date = new Date(item[field.id].label as number);
                                        return <TableCellLayout>{date.toLocaleDateString()}</TableCellLayout>;
                                    } else {
                                        return <TableCellLayout></TableCellLayout>;
                                    }
                                }
                                case 'Numeric': {
                                    return <TableCellLayout>{item[field.id].label?.toString()}</TableCellLayout>;
                                }
                            }
                        },
                    }),
                );
            }
        }

        const setValue = (id: string) => {
            const lookupValue: ComponentFramework.LookupValue[] = [];
            const item = items.find((item) => item.id === id);
            if (item !== undefined) {
                lookupValue[0] = {
                    id: item.id,
                    name: item[this._config.lookupColumnName].label,
                    entityType: this._props.config.targetEntityName,
                };
            }
            this._props.onChangeRequest(lookupValue);
            this._props.setLookupDialogState(() => ({ ...state, open: false }));
        };
        return (
            <Dialog
                open={state.open}
                onOpenChange={(event, data) => {
                    if (!data.open) {
                        this._props.setLookupDialogState(() => ({ ...state, open: false }));
                        restoreFocusTargetAttribute;
                    }
                }}
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <DataGrid
                                items={items}
                                columns={columns}
                                sortable
                                selectionMode='single'
                                getRowId={(item) => item.id}
                                onSelectionChange={(event, data) => setValue(data.selectedItems.entries().next().value[0])}
                                focusMode='composite'
                            >
                                <DataGridHeader>
                                    <DataGridRow selectionCell={{ 'aria-label': 'Select all rows' }}>
                                        {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                                    </DataGridRow>
                                </DataGridHeader>
                                <DataGridBody<ITableGridItem>>
                                    {({ item, rowId }) => (
                                        <DataGridRow<ITableGridItem> key={rowId} selectionCell={{ 'aria-label': 'Select row' }}>
                                            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                                        </DataGridRow>
                                    )}
                                </DataGridBody>
                            </DataGrid>
                        </DialogContent>
                        <DialogActions fluid>
                            <Button appearance='secondary'>Select</Button>
                            <Button appearance='secondary'>Something Else</Button>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance='secondary'>Close</Button>
                            </DialogTrigger>
                            <Button appearance='primary'>Do Something</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    };
}
export default LookupDialog;

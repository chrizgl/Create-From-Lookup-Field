import * as React from 'react';
import { useContext } from 'react';
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
    mergeClasses,
    Input,
} from '@fluentui/react-components';
import { ITableGridItem } from '../interfaces/ITableGridItem';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import { ITableGridField } from '../interfaces/ITableGridField';
import { useStyles } from './Styles';
import InputActionBarContext from './CreateFromLookupContext';

// TODO: Anhand vom Lookup-Dialog kann ich mir das Prinzip für die WebApi-Component ableiten.
const LookupDialog: React.FC<ILookupDialogProps> = (props) => {
    const classes = useStyles();
    const restoreFocusTargetAttribute = useRestoreFocusTarget();

    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('LookupDialogContext is undefined');
    }
    const lookupDialogState = contextValue.lookupDialogState;
    const setLookupDialogState = contextValue.setLookupDialogState;

    const buildItems = (values: ComponentFramework.WebApi.RetrieveMultipleResponse) => {
        const entities = values.entities;
        let items: any[] = [];
        if (entities !== undefined) {
            for (const entity of entities) {
                const fieldMap = new Map<string, ITableGridField>();
                if (entity !== undefined) {
                    for (const field of props.config.fields.values()) {
                        if (field.visible) {
                            fieldMap.set(field.id, { label: entity[field.id] });
                        }
                    }
                    let item = { id: entity[props.config.lookupColumn] };
                    item = Object.assign(item, Object.fromEntries(fieldMap));
                    items.push(item);
                }
            }
        } else {
            items = [];
        }
        return items;
    };
    const show = (): React.JSX.Element => {
        const state = lookupDialogState;
        const items = buildItems(state.values);
        const columns: TableColumnDefinition<ITableGridField>[] = [];
        for (const field of props.config.fields.values()) {
            if (field.visible) {
                columns.push(
                    createTableColumn<ITableGridField>({
                        columnId: field.id,
                        compare: (a: any, b: any) => {
                            const aLabel = a[field.id].label ?? '';
                            const bLabel = b[field.id].label ?? '';
                            return aLabel.toString().localeCompare(bLabel.toString());
                        },
                        renderHeaderCell: () => {
                            return field.title;
                        },
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
                    name: item[props.config.lookupColumnName].label,
                    entityType: props.config.targetEntityName,
                };
            }
            props.onChangeRequest(lookupValue);
            setLookupDialogState(() => ({ ...state, open: false }));
        };
        return (
            <Dialog
                open={state.open}
                onOpenChange={(event, data) => {
                    if (!data.open) {
                        setLookupDialogState(() => ({ ...state, open: false }));
                        restoreFocusTargetAttribute;
                    }
                }}
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Select item</DialogTitle>
                        <DialogContent>
                            <div className={classes.dialogBody}>
                                <DataGrid
                                    className={classes.gridBody}
                                    items={items}
                                    columns={columns}
                                    sortable
                                    selectionMode='single'
                                    getRowId={(item) => item.id}
                                    onSelectionChange={(event, data) => {
                                        setValue(data.selectedItems.entries().next().value[0]);
                                    }}
                                    focusMode='composite'
                                >
                                    <DataGridHeader>
                                        <DataGridRow selectionCell={{ 'aria-label': 'Select all rows' }}>
                                            {({ renderHeaderCell }) => (
                                                <DataGridHeaderCell className={classes.gridHeaderCell}>
                                                    {renderHeaderCell()}
                                                </DataGridHeaderCell>
                                            )}
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
                            </div>
                        </DialogContent>
                        <DialogActions fluid>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance='secondary'>Close</Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    };
    return show();
};
export default LookupDialog;

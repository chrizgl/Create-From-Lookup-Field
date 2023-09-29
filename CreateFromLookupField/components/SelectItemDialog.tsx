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
import { ITableGridItem } from '../interfaces/ITableGrid';
import { ILookupDialog } from '../interfaces/ILookupDialog';
import { ISelectItemDialogState } from '../interfaces/ISelectItemDialogState';
import * as moment from 'moment';

class SelectItemDialog {
    private _lookupValue: ComponentFramework.LookupValue[];
    private _props: ILookupDialog;

    constructor(props: ILookupDialog) {
        this._props = { onChangeRequest: props.onChangeRequest };
    }

    private buildItems = (values: ComponentFramework.WebApi.RetrieveMultipleResponse) => {
        const entities = values.entities;
        let items: ITableGridItem[] = [];
        if (entities !== undefined) {
            for (const entity of entities) {
                items.push({
                    id: entity.cgsol_prt_partid,
                    partNumber: { label: entity.cgsol_prt_partnumber },
                    owner: { label: entity.cgsol_owner, status: 'available' },
                    lastUpdated: { label: moment(entity.modifiedon).format('DD.MM.YYYY hh:mm:ss'), timestamp: 1 },
                    revision: {
                        label: entity.cgsol_prt_revision,
                    },
                    generation: entity.cgsol_prt_generation,
                    descriptionEn: entity.cgsol_prt_descriptionen,
                });
            }
        } else {
            items = [
                {
                    id: '1',
                    partNumber: { label: '3380040' },
                    owner: { label: 'Max Mustermann', status: 'available' },
                    lastUpdated: { label: '7h ago', timestamp: 1 },
                    revision: {
                        label: '10',
                    },
                    generation: { label: 1 },
                    descriptionEn: { label: 'Test' },
                },
            ];
        }
        return items;
    };

    private onSelect = (data: any) => {
        console.log('Selected item: ' + data.entities[0].cgsol_prt_partnumber + ' with id: ' + data.entities[0].cgsol_prt_partid);
    };

    public show = (state: ISelectItemDialogState, setState: any) => {
        const restoreFocusTargetAttribute = useRestoreFocusTarget();
        const values = this.buildItems(state.values);
        const columns: TableColumnDefinition<ITableGridItem>[] = [
            createTableColumn<ITableGridItem>({
                columnId: 'partNumber',
                compare: (a, b) => {
                    return a.partNumber.label.localeCompare(b.partNumber.label);
                },
                renderHeaderCell: () => {
                    return 'Part number';
                },
                renderCell: (item) => {
                    return <TableCellLayout>{item.partNumber.label}</TableCellLayout>;
                },
            }),
            createTableColumn<ITableGridItem>({
                columnId: 'owner',
                compare: (a, b) => {
                    return a.owner.label.localeCompare(b.owner.label);
                },
                renderHeaderCell: () => {
                    return 'Owner';
                },
                renderCell: (item) => {
                    return (
                        <TableCellLayout
                            media={<Avatar aria-label={item.owner.label} name={item.owner.label} badge={{ status: item.owner.status }} />}
                        >
                            {item.owner.label}
                        </TableCellLayout>
                    );
                },
            }),
            createTableColumn<ITableGridItem>({
                columnId: 'lastUpdated',
                compare: (a, b) => {
                    return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
                },
                renderHeaderCell: () => {
                    return 'Last updated';
                },

                renderCell: (item) => {
                    return item.lastUpdated.label;
                },
            }),
            createTableColumn<ITableGridItem>({
                columnId: 'revision',
                compare: (a, b) => {
                    return a.revision.label.localeCompare(b.revision.label);
                },
                renderHeaderCell: () => {
                    return 'Revision';
                },
                renderCell: (item) => {
                    return <TableCellLayout>{item.revision.label}</TableCellLayout>;
                },
            }),
        ];
        return (
            <Dialog
                open={state.open}
                onOpenChange={(event, data) => {
                    if (!data.open) {
                        setState(() => ({ ...state, open: false }));
                        restoreFocusTargetAttribute;
                    }
                }}
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Dialog title</DialogTitle>
                        <DialogContent>
                            <DataGrid
                                items={values}
                                columns={columns}
                                sortable
                                selectionMode='single'
                                getRowId={(item) => item.id}
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
export default SelectItemDialog;

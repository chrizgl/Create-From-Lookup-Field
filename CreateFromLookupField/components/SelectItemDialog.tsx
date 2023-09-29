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
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from '@fluentui/react-components';
import { ITableGridItem } from '../interfaces/ITableGrid';
import { ISelectItemDialogState } from '../interfaces/ISelectItemDialogState';
import * as moment from 'moment';

class SelectItemDialog {
    constructor() {}

    private buildItems = (values: ComponentFramework.WebApi.RetrieveMultipleResponse) => {
        const entities = values.entities;
        let items: ITableGridItem[] = [];
        if (entities !== undefined) {
            for (const entity of entities) {
                items.push({
                    partNumber: { label: entity.cgsol_prt_partnumber },
                    owner: { label: entity.cgsol_owner, status: 'available' },
                    lastUpdated: { label: moment(entity.modifiedon).format('DD.MM.YYYY hh:mm:ss'), timestamp: 1 },
                    revision: {
                        label: entity.cgsol_prt_revision,
                    },
                });
            }
        } else {
            items = [
                {
                    partNumber: { label: '3380040' },
                    owner: { label: 'Max Mustermann', status: 'available' },
                    lastUpdated: { label: '7h ago', timestamp: 1 },
                    revision: {
                        label: '10',
                    },
                },
                {
                    partNumber: { label: '8870030' },
                    owner: { label: 'Erika Mustermann', status: 'busy' },
                    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
                    revision: {
                        label: '04',
                    },
                },
                {
                    partNumber: { label: 'T70001' },
                    owner: { label: 'John Doe', status: 'away' },
                    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
                    revision: {
                        label: '00',
                    },
                },
                {
                    partNumber: { label: '33900020' },
                    owner: { label: 'Jane Doe', status: 'offline' },
                    lastUpdated: { label: 'Tue at 9:30 AM', timestamp: 3 },
                    revision: {
                        label: '42',
                    },
                },
            ];
        }
        return items;
    };

    public show = (state: ISelectItemDialogState) => {
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
            <DataGrid
                items={values}
                columns={columns}
                sortable
                selectionMode='single'
                getRowId={(item) => item.partNumber.label + '_' + item.revision.label}
                // onSelectionChange={(e, data) => setSelectedItemState(data)}
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
        );
    };
}
export default SelectItemDialog;

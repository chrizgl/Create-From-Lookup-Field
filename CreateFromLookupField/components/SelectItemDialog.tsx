import * as React from 'react';
import {
    FolderRegular,
    EditRegular,
    OpenRegular,
    DocumentRegular,
    PeopleRegular,
    DocumentPdfRegular,
    VideoRegular,
} from '@fluentui/react-icons';
import {
    PresenceBadgeStatus,
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
import type { PopoverProps, Select } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { IInputs, IOutputs } from '../generated/ManifestTypes';

type PartNumberCell = {
    label: string;
};

type LastUpdatedCell = {
    label: string;
    timestamp: number;
};

type RevisionCell = {
    label: string;
};

type OwnerCell = {
    label: string;
    status: PresenceBadgeStatus;
};

type Item = {
    partNumber: PartNumberCell;
    owner: OwnerCell;
    lastUpdated: LastUpdatedCell;
    revision: RevisionCell;
};

const dataGrid = () => {
    const items: Item[] = [
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

    const columns: TableColumnDefinition<Item>[] = [
        createTableColumn<Item>({
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
        createTableColumn<Item>({
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
        createTableColumn<Item>({
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
        createTableColumn<Item>({
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
            items={items}
            columns={columns}
            sortable
            selectionMode='single'
            getRowId={(item) => item.partNumber.label}
            onSelectionChange={(e, data) => console.log(data)}
            focusMode='composite'
        >
            <DataGridHeader>
                <DataGridRow selectionCell={{ 'aria-label': 'Select all rows' }}>
                    {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Item>>
                {({ item, rowId }) => (
                    <DataGridRow<Item> key={rowId} selectionCell={{ 'aria-label': 'Select row' }}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
};
export const SelectItemDialog = (props: ComponentFramework.WebApi.RetrieveMultipleResponse) => {
    if (props.entities !== undefined) {
        const entities = props.entities ?? undefined;
        const items = [];
        for (const entity of entities) {
            items.push({
                partid: entity.cgsol_partid,
            });
            console.log(entity.cgsol_partid);
        }
    }
    return (
        <Popover>
            <PopoverTrigger disableButtonEnhancement>
                <Button>Popover trigger</Button>
            </PopoverTrigger>

            <PopoverSurface>
                Hallo
                {dataGrid()}
                <Button>noch ein Button</Button>
            </PopoverSurface>
        </Popover>
    );
};

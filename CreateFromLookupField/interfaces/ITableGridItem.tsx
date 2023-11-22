import { ITableGridField } from './ITableGridField';
import { PresenceBadgeStatus } from '@fluentui/react-components';

type Field = {
    label: string;
    id: string;
};

interface ITableGridItem {
    id: string;
    [key: string]: Field | string | PresenceBadgeStatus | undefined;
}

export { ITableGridItem };

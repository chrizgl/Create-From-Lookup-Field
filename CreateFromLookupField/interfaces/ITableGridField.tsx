import { PresenceBadgeStatus } from '@fluentui/react-components';

interface ITableGridField {
    [id: string]: {
        label: string | number;
        status?: PresenceBadgeStatus;
    }
}

export { ITableGridField };

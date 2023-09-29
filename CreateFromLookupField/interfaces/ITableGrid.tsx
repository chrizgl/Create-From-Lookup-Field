import { PresenceBadgeStatus } from '@fluentui/react-components';

interface ITableGridItem {
    partNumber: {
        label: string;
    };
    owner: {
        label: string;
        status: PresenceBadgeStatus;
    };
    lastUpdated: {
        label: string;
        timestamp: number;
    };
    revision: {
        label: string;
    };
}

export { ITableGridItem };

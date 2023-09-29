import { PresenceBadgeStatus } from '@fluentui/react-components';

interface ITableGridItem {
    id: string;
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
    generation: {
        label: number;
    };
    descriptionEn: {
        label: string;
    };
}

export { ITableGridItem };

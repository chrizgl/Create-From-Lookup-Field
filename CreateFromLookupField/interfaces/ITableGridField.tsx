import { PresenceBadgeStatus } from '@fluentui/react-components';

interface ITableGridField {
    [id: string]: {
        label: string | number | boolean | undefined;
        status?: PresenceBadgeStatus;
    };
}

export { ITableGridField };

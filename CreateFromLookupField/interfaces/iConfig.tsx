interface IConfig {
    lookupColumnName: string;
    lookupColumn: string;
    sourceLookupField: string;
    sourceEntityName: string;
    targetEntityName: string;
    targetEntityMultiple: string;
    selectedColumns: string[];
    fields: {
        id: string;
        title: string;
        type: 'Person' | 'Numeric' | 'Text' | 'Timestamp';
        visible: boolean;
    }[];
    filter: [
        {
            name: string;
            value: boolean;
        },
    ];
    orderBy: string;
    updateColumns: {
        name: string;
        value: string | boolean | number | true | false;
    }[];
}

export { IConfig };

interface IConfig {
    lookupColumnName: string;
    lookupColumn: string;
    sourceLookupField: string;
    sourceEntityName: string;
    targetEntityName: string;
    targetEntityMultiple: string;
    selectedColumns: [string];
    filter: [
        {
            name: string;
            value: boolean;
        },
    ];
    orderBy: string;
    updateColumns: [
        {
            name: string;
            value: any;
        },
    ];
}

export { IConfig };

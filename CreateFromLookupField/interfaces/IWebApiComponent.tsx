interface IWebApiComponent {
    getEntity: (entityName: string, id: string, query?: string) => Promise<any>; // Ersetzen Sie 'any' durch den tatsächlichen Rückgabetyp
    retrieveRecords: (entityName: string, query?: string) => Promise<any>; // Ersetzen Sie 'any' durch den tatsächlichen Rückgabetyp
    createRecord: (record: any) => Promise<any>; // Ersetzen Sie 'any' durch den tatsächlichen Rückgabetyp
}

export default IWebApiComponent;

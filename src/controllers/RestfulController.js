export class RestfulController {
    constructor() {
        this.isRestful = true;
    }
    exposedMethods() {
        return [
            {
                functionName: 'index',
                url: '',
                httpMethods: ["GET"],
            },
            {
                functionName: "create",
                url: '',
                httpMethods: ["POST"]
            },
            {
                functionName: 'show',
                url: ':id',
                httpMethods: ['GET']
            },
            {
                functionName: 'update',
                url: ':id',
                httpMethods: ['PUT']
            },
            {
                functionName: 'destroy',
                url: ':id',
                httpMethods: ['DELETE']
            }
        ];
    }
}

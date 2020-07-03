export interface OmniRequest {
    authToken?: string;
    url: string;
    originalUrl: string;
    parameters: {
        [parameterName: string]: any;
    };
    dataSource: {
        url: {
            [name: string]: string;
        };
        cookies: {
            [cookieName: string]: string;
        };
        headers: {
            [headerName: string]: string;
        };
        body: {
            [name: string]: any;
        };
        queryString: {
            [name: string]: any;
        };
    };
}

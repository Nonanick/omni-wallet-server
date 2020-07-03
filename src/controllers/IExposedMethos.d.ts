export interface IExposedMethod {
    functionName: string;
    requiredParameters: string[];
    httpMethods: ('GET' | 'PUT' | 'POST' | 'DELETE')[];
}
export declare type UrlExposedMethods = {
    [url: string]: IExposedMethod;
};

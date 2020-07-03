export interface IExposedMethod {
    functionName: string;
    url: string;
    requiredParameters?: string[];
    httpMethods: ('GET' | 'PUT' | 'POST' | 'DELETE')[];
}
export declare type RouteExposedMethods = IExposedMethod[];

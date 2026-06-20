/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LogisticsProviderRequest } from '../models/LogisticsProviderRequest';
import type { LogisticsProviderResponse } from '../models/LogisticsProviderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LogisticsProviderService {
    /**
     * @returns LogisticsProviderResponse
     * @throws ApiError
     */
    public static logisticsProviderGetAll(): CancelablePromise<Array<LogisticsProviderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/LogisticsProvider/GetAll',
        });
    }
    /**
     * @param id
     * @returns LogisticsProviderResponse
     * @throws ApiError
     */
    public static logisticsProviderGet(
        id?: number,
    ): CancelablePromise<LogisticsProviderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/LogisticsProvider/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns LogisticsProviderResponse
     * @throws ApiError
     */
    public static logisticsProviderCreate(
        data: LogisticsProviderRequest,
    ): CancelablePromise<LogisticsProviderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LogisticsProvider/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns LogisticsProviderResponse
     * @throws ApiError
     */
    public static logisticsProviderUpdate(
        data: LogisticsProviderRequest,
    ): CancelablePromise<LogisticsProviderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LogisticsProvider/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static logisticsProviderDelete(
        data: LogisticsProviderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LogisticsProvider/Delete',
            body: data,
        });
    }
}

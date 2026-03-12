/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverRequest } from '../models/DriverRequest';
import type { DriverResponse } from '../models/DriverResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DriverService {
    /**
     * @returns DriverResponse
     * @throws ApiError
     */
    public static driverGetAll(): CancelablePromise<Array<DriverResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Driver/GetAll',
        });
    }
    /**
     * @param id
     * @returns DriverResponse
     * @throws ApiError
     */
    public static driverGet(
        id?: number,
    ): CancelablePromise<DriverResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Driver/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns DriverResponse
     * @throws ApiError
     */
    public static driverCreate(
        data: DriverRequest,
    ): CancelablePromise<DriverResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Driver/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns DriverResponse
     * @throws ApiError
     */
    public static driverUpdate(
        data: DriverRequest,
    ): CancelablePromise<DriverResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Driver/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static driverDelete(
        data: DriverRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Driver/Delete',
            body: data,
        });
    }
}

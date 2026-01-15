/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationStateRequest } from '../models/LocationStateRequest';
import type { LocationStateResponse } from '../models/LocationStateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationStateService {
    /**
     * @returns LocationStateResponse
     * @throws ApiError
     */
    public static locationStateGetAll(): CancelablePromise<Array<LocationStateResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/LocationState/GetAll',
        });
    }
    /**
     * @param id
     * @returns LocationStateResponse
     * @throws ApiError
     */
    public static locationStateGet(
        id?: number,
    ): CancelablePromise<LocationStateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/LocationState/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns LocationStateResponse
     * @throws ApiError
     */
    public static locationStateGet2(
        code?: string,
    ): CancelablePromise<LocationStateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/LocationState/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns LocationStateResponse
     * @throws ApiError
     */
    public static locationStateCreate(
        data: LocationStateRequest,
    ): CancelablePromise<LocationStateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LocationState/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns LocationStateResponse
     * @throws ApiError
     */
    public static locationStateUpdate(
        data: LocationStateRequest,
    ): CancelablePromise<LocationStateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LocationState/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static locationStateDelete(
        data: LocationStateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/LocationState/Delete',
            body: data,
        });
    }
}

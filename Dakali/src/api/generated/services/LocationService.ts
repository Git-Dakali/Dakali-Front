/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationRequest } from '../models/LocationRequest';
import type { LocationResponse } from '../models/LocationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationService {
    /**
     * @returns LocationResponse
     * @throws ApiError
     */
    public static locationGetAll(): CancelablePromise<Array<LocationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Location/GetAll',
        });
    }
    /**
     * @param id
     * @returns LocationResponse
     * @throws ApiError
     */
    public static locationGet(
        id?: number,
    ): CancelablePromise<LocationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Location/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns LocationResponse
     * @throws ApiError
     */
    public static locationCreate(
        data: LocationRequest,
    ): CancelablePromise<LocationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Location/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns LocationResponse
     * @throws ApiError
     */
    public static locationUpdate(
        data: LocationRequest,
    ): CancelablePromise<LocationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Location/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static locationDelete(
        data: LocationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Location/Delete',
            body: data,
        });
    }
}

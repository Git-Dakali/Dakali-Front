/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnRequest } from '../models/ColumnRequest';
import type { ColumnResponse } from '../models/ColumnResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ColumnService {
    /**
     * @returns ColumnResponse
     * @throws ApiError
     */
    public static columnGetAll(): CancelablePromise<Array<ColumnResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Column/GetAll',
        });
    }
    /**
     * @param id
     * @returns ColumnResponse
     * @throws ApiError
     */
    public static columnGet(
        id?: number,
    ): CancelablePromise<ColumnResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Column/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns ColumnResponse
     * @throws ApiError
     */
    public static columnGet2(
        code?: string,
    ): CancelablePromise<ColumnResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Column/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns ColumnResponse
     * @throws ApiError
     */
    public static columnCreate(
        data: ColumnRequest,
    ): CancelablePromise<ColumnResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Column/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns ColumnResponse
     * @throws ApiError
     */
    public static columnUpdate(
        data: ColumnRequest,
    ): CancelablePromise<ColumnResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Column/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static columnDelete(
        data: ColumnRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Column/Delete',
            body: data,
        });
    }
}

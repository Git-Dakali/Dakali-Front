/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxStatusRequest } from '../models/TaxStatusRequest';
import type { TaxStatusResponse } from '../models/TaxStatusResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaxStatusService {
    /**
     * @returns TaxStatusResponse
     * @throws ApiError
     */
    public static taxStatusGetAll(): CancelablePromise<Array<TaxStatusResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/TaxStatus/GetAll',
        });
    }
    /**
     * @param id
     * @returns TaxStatusResponse
     * @throws ApiError
     */
    public static taxStatusGet(
        id?: number,
    ): CancelablePromise<TaxStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/TaxStatus/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns TaxStatusResponse
     * @throws ApiError
     */
    public static taxStatusGet2(
        code?: string,
    ): CancelablePromise<TaxStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/TaxStatus/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns TaxStatusResponse
     * @throws ApiError
     */
    public static taxStatusCreate(
        data: TaxStatusRequest,
    ): CancelablePromise<TaxStatusResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/TaxStatus/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns TaxStatusResponse
     * @throws ApiError
     */
    public static taxStatusUpdate(
        data: TaxStatusRequest,
    ): CancelablePromise<TaxStatusResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/TaxStatus/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static taxStatusDelete(
        data: TaxStatusRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/TaxStatus/Delete',
            body: data,
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StockRequest } from '../models/StockRequest';
import type { StockResponse } from '../models/StockResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StockService {
    /**
     * @returns StockResponse
     * @throws ApiError
     */
    public static stockGetAll(): CancelablePromise<Array<StockResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Stock/GetAll',
        });
    }
    /**
     * @param id
     * @returns StockResponse
     * @throws ApiError
     */
    public static stockGet(
        id?: number,
    ): CancelablePromise<StockResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Stock/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns StockResponse
     * @throws ApiError
     */
    public static stockCreate(
        data: StockRequest,
    ): CancelablePromise<StockResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns StockResponse
     * @throws ApiError
     */
    public static stockUpdate(
        data: StockRequest,
    ): CancelablePromise<StockResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static stockDelete(
        data: StockRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/Delete',
            body: data,
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StockEntryRequest } from '../models/StockEntryRequest';
import type { StockFilter } from '../models/StockFilter';
import type { StockRequest } from '../models/StockRequest';
import type { StockResponse } from '../models/StockResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StockService {
    /**
     * @param stockFilter
     * @returns StockResponse
     * @throws ApiError
     */
    public static stockGetAll(
        stockFilter: StockFilter,
    ): CancelablePromise<Array<StockResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/GetAll',
            body: stockFilter,
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
    public static stockUpdatePhysical(
        data: StockRequest,
    ): CancelablePromise<StockResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/UpdatePhysical',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static stockRecount(
        data: Array<StockRequest>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/Recount',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static stockStockEntry(
        data: StockEntryRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Stock/StockEntry',
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

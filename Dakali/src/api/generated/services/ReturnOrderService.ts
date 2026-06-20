/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResultPageResponseOfReturnOrderResponse } from '../models/ResultPageResponseOfReturnOrderResponse';
import type { ReturnOrderFilter } from '../models/ReturnOrderFilter';
import type { ReturnOrderRequest } from '../models/ReturnOrderRequest';
import type { ReturnOrderResponse } from '../models/ReturnOrderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReturnOrderService {
    /**
     * @param filter
     * @returns ResultPageResponseOfReturnOrderResponse
     * @throws ApiError
     */
    public static returnOrderGetPage(
        filter: ReturnOrderFilter,
    ): CancelablePromise<ResultPageResponseOfReturnOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ReturnOrder/GetPage',
            body: filter,
        });
    }
    /**
     * @param data
     * @returns ReturnOrderResponse
     * @throws ApiError
     */
    public static returnOrderCreate(
        data: ReturnOrderRequest,
    ): CancelablePromise<ReturnOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ReturnOrder/Create',
            body: data,
        });
    }
    /**
     * @param saleId
     * @returns ReturnOrderResponse
     * @throws ApiError
     */
    public static returnOrderNotReturned(
        saleId: number,
    ): CancelablePromise<ReturnOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ReturnOrder/NotReturned',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns ReturnOrderResponse
     * @throws ApiError
     */
    public static returnOrderReturned(
        saleId: number,
    ): CancelablePromise<ReturnOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ReturnOrder/Returned',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns ReturnOrderResponse
     * @throws ApiError
     */
    public static returnOrderStored(
        saleId: number,
    ): CancelablePromise<ReturnOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ReturnOrder/Stored',
            body: saleId,
        });
    }
}

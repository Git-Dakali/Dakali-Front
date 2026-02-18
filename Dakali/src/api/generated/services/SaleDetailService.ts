/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SaleDetailRequest } from '../models/SaleDetailRequest';
import type { SaleDetailResponse } from '../models/SaleDetailResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SaleDetailService {
    /**
     * @param idSale
     * @returns SaleDetailResponse
     * @throws ApiError
     */
    public static saleDetailGetBySale(
        idSale?: number,
    ): CancelablePromise<Array<SaleDetailResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/SaleDetail/GetBySale',
            query: {
                'idSale': idSale,
            },
        });
    }
    /**
     * @param saleDetailRequest
     * @param idSale
     * @returns any
     * @throws ApiError
     */
    public static saleDetailCreate(
        saleDetailRequest: SaleDetailRequest,
        idSale?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/SaleDetail/Create',
            query: {
                'idSale': idSale,
            },
            body: saleDetailRequest,
        });
    }
    /**
     * @param saleDetailRequest
     * @param idSale
     * @returns any
     * @throws ApiError
     */
    public static saleDetailDelete(
        saleDetailRequest: SaleDetailRequest,
        idSale?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/SaleDetail/Delete',
            query: {
                'idSale': idSale,
            },
            body: saleDetailRequest,
        });
    }
}

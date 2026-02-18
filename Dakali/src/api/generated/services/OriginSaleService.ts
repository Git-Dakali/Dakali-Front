/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OriginSaleRequest } from '../models/OriginSaleRequest';
import type { OriginSaleResponse } from '../models/OriginSaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OriginSaleService {
    /**
     * @returns OriginSaleResponse
     * @throws ApiError
     */
    public static originSaleGetAll(): CancelablePromise<Array<OriginSaleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/OriginSale/GetAll',
        });
    }
    /**
     * @param id
     * @returns OriginSaleResponse
     * @throws ApiError
     */
    public static originSaleGet(
        id?: number,
    ): CancelablePromise<OriginSaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/OriginSale/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns OriginSaleResponse
     * @throws ApiError
     */
    public static originSaleCreate(
        data: OriginSaleRequest,
    ): CancelablePromise<OriginSaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/OriginSale/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns OriginSaleResponse
     * @throws ApiError
     */
    public static originSaleUpdate(
        data: OriginSaleRequest,
    ): CancelablePromise<OriginSaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/OriginSale/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static originSaleDelete(
        data: OriginSaleRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/OriginSale/Delete',
            body: data,
        });
    }
}

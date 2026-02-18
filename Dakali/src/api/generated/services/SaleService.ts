/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SaleRequest } from '../models/SaleRequest';
import type { SaleResponse } from '../models/SaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SaleService {
    /**
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGetAll(): CancelablePromise<Array<SaleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetAll',
        });
    }
    /**
     * @param id
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGet(
        id?: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleCreate(
        data: SaleRequest,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleUpdate(
        data: SaleRequest,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static saleDelete(
        data: SaleRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Delete',
            body: data,
        });
    }
}

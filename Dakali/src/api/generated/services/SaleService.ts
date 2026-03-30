/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResultPageResponseOfSaleResponse } from '../models/ResultPageResponseOfSaleResponse';
import type { SaleFilter } from '../models/SaleFilter';
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
     * @param cityFilter
     * @returns ResultPageResponseOfSaleResponse
     * @throws ApiError
     */
    public static saleGetPage(
        cityFilter: SaleFilter,
    ): CancelablePromise<ResultPageResponseOfSaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/GetPage',
            body: cityFilter,
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
     * @param number
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGetByNumber(
        number?: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetByNumber',
            query: {
                'number': number,
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
     * @param saleId
     * @param longitude
     * @param latitude
     * @returns any
     * @throws ApiError
     */
    public static saleAddLocation(
        saleId?: number,
        longitude?: number,
        latitude?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/AddLocation',
            query: {
                'SaleId': saleId,
                'longitude': longitude,
                'latitude': latitude,
            },
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

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountryRequest } from '../models/CountryRequest';
import type { ProvinceRequest } from '../models/ProvinceRequest';
import type { ProvinceResponse } from '../models/ProvinceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProvinceService {
    /**
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceGetAll(): CancelablePromise<Array<ProvinceResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Province/GetAll',
        });
    }
    /**
     * @param data
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceGetByCountry(
        data: CountryRequest,
    ): CancelablePromise<Array<ProvinceResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Province/GetByCountry',
            body: data,
        });
    }
    /**
     * @param id
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceGet(
        id?: number,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Province/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceGet2(
        code?: string,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Province/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceCreate(
        data: ProvinceRequest,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Province/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns ProvinceResponse
     * @throws ApiError
     */
    public static provinceUpdate(
        data: ProvinceRequest,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Province/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static provinceDelete(
        data: ProvinceRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Province/Delete',
            body: data,
        });
    }
}

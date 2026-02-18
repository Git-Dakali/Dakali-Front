/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountryRequest } from '../models/CountryRequest';
import type { CountryResponse } from '../models/CountryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CountryService {
    /**
     * @returns CountryResponse
     * @throws ApiError
     */
    public static countryGetAll(): CancelablePromise<Array<CountryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Country/GetAll',
        });
    }
    /**
     * @param id
     * @returns CountryResponse
     * @throws ApiError
     */
    public static countryGet(
        id?: number,
    ): CancelablePromise<CountryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Country/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns CountryResponse
     * @throws ApiError
     */
    public static countryGet2(
        code?: string,
    ): CancelablePromise<CountryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Country/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns CountryResponse
     * @throws ApiError
     */
    public static countryCreate(
        data: CountryRequest,
    ): CancelablePromise<CountryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Country/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns CountryResponse
     * @throws ApiError
     */
    public static countryUpdate(
        data: CountryRequest,
    ): CancelablePromise<CountryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Country/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static countryDelete(
        data: CountryRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Country/Delete',
            body: data,
        });
    }
}

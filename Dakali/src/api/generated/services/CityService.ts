/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CityFilter } from '../models/CityFilter';
import type { CityRequest } from '../models/CityRequest';
import type { CityResponse } from '../models/CityResponse';
import type { ProvinceRequest } from '../models/ProvinceRequest';
import type { ResultPageResponseOfCityResponse } from '../models/ResultPageResponseOfCityResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CityService {
    /**
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityGetAll(): CancelablePromise<Array<CityResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/GetAll',
        });
    }
    /**
     * @param cityFilter
     * @returns ResultPageResponseOfCityResponse
     * @throws ApiError
     */
    public static cityGetPage(
        cityFilter: CityFilter,
    ): CancelablePromise<ResultPageResponseOfCityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/GetPage',
            body: cityFilter,
        });
    }
    /**
     * @param data
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityGetByCity(
        data: ProvinceRequest,
    ): CancelablePromise<Array<CityResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/GetByCity',
            body: data,
        });
    }
    /**
     * @param id
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityGet(
        id?: number,
    ): CancelablePromise<CityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityGet2(
        code?: string,
    ): CancelablePromise<CityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityCreate(
        data: CityRequest,
    ): CancelablePromise<CityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns CityResponse
     * @throws ApiError
     */
    public static cityUpdate(
        data: CityRequest,
    ): CancelablePromise<CityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static cityDelete(
        data: CityRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Delete',
            body: data,
        });
    }
}

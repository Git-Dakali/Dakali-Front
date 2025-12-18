/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StockStateRequest } from '../models/StockStateRequest';
import type { StockStateResponse } from '../models/StockStateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StockStateService {
    /**
     * @returns StockStateResponse
     * @throws ApiError
     */
    public static stockStateGetAll(): CancelablePromise<Array<StockStateResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/StockState/GetAll',
        });
    }
    /**
     * @param id
     * @returns StockStateResponse
     * @throws ApiError
     */
    public static stockStateGet(
        id?: number,
    ): CancelablePromise<StockStateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/StockState/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns StockStateResponse
     * @throws ApiError
     */
    public static stockStateGet2(
        code?: string,
    ): CancelablePromise<StockStateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/StockState/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns StockStateResponse
     * @throws ApiError
     */
    public static stockStateCreate(
        data: StockStateRequest,
    ): CancelablePromise<StockStateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/StockState/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns StockStateResponse
     * @throws ApiError
     */
    public static stockStateUpdate(
        data: StockStateRequest,
    ): CancelablePromise<StockStateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/StockState/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static stockStateDelete(
        data: StockStateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/StockState/Delete',
            body: data,
        });
    }
}

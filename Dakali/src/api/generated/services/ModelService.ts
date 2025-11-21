/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelRequest } from '../models/ModelRequest';
import type { ModelResponse } from '../models/ModelResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModelService {
    /**
     * @returns ModelResponse
     * @throws ApiError
     */
    public static modelGetAll(): CancelablePromise<Array<ModelResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/GetAll',
        });
    }
    /**
     * @param id
     * @returns ModelResponse
     * @throws ApiError
     */
    public static modelGet(
        id?: number,
    ): CancelablePromise<ModelResponse> {
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
     * @returns ModelResponse
     * @throws ApiError
     */
    public static modelGet2(
        code?: string,
    ): CancelablePromise<ModelResponse> {
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
     * @returns ModelResponse
     * @throws ApiError
     */
    public static modelCreate(
        data: ModelRequest,
    ): CancelablePromise<ModelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns ModelResponse
     * @throws ApiError
     */
    public static modelUpdate(
        data: ModelRequest,
    ): CancelablePromise<ModelResponse> {
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
    public static modelDelete(
        data: ModelRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Delete',
            body: data,
        });
    }
}

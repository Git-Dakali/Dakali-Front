/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRequest } from '../models/CategoryRequest';
import type { CategoryResponse } from '../models/CategoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryService {
    /**
     * @returns CategoryResponse
     * @throws ApiError
     */
    public static categoryGetAll(): CancelablePromise<Array<CategoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Category/GetAll',
        });
    }
    /**
     * @param id
     * @returns CategoryResponse
     * @throws ApiError
     */
    public static categoryGet(
        id?: number,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Category/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns CategoryResponse
     * @throws ApiError
     */
    public static categoryGet2(
        code?: string,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Category/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns CategoryResponse
     * @throws ApiError
     */
    public static categoryCreate(
        data: CategoryRequest,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Category/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns CategoryResponse
     * @throws ApiError
     */
    public static categoryUpdate(
        data: CategoryRequest,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Category/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static categoryDelete(
        data: CategoryRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Category/Delete',
            body: data,
        });
    }
}

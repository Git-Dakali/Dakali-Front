/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductRequest } from '../models/ProductRequest';
import type { ProductResponse } from '../models/ProductResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductService {
    /**
     * @returns ProductResponse
     * @throws ApiError
     */
    public static productGetAll(): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Product/GetAll',
        });
    }
    /**
     * @param id
     * @returns ProductResponse
     * @throws ApiError
     */
    public static productGet(
        id?: number,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Product/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns ProductResponse
     * @throws ApiError
     */
    public static productCreate(
        data: ProductRequest,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Product/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns ProductResponse
     * @throws ApiError
     */
    public static productUpdate(
        data: ProductRequest,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Product/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static productDelete(
        data: ProductRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Product/Delete',
            body: data,
        });
    }
}

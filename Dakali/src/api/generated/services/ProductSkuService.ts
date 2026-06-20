/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductSkuResponse } from '../models/ProductSkuResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductSkuService {
    /**
     * @param sku
     * @returns ProductSkuResponse
     * @throws ApiError
     */
    public static productSkuGetBySku(
        sku?: string,
    ): CancelablePromise<ProductSkuResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ProductSku/GetBySku',
            query: {
                'Sku': sku,
            },
        });
    }
}

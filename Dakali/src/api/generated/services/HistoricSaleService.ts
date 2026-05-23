/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoricSaleResponse } from '../models/HistoricSaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HistoricSaleService {
    /**
     * @param saleId
     * @returns HistoricSaleResponse
     * @throws ApiError
     */
    public static historicSaleGet(
        saleId?: number,
    ): CancelablePromise<Array<HistoricSaleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/HistoricSale/GetAll',
            query: {
                'saleId': saleId,
            },
        });
    }
}

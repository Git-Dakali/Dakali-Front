/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoadMapSaleRequest } from '../models/RoadMapSaleRequest';
import type { RoadMapSaleResponse } from '../models/RoadMapSaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoadMapSaleService {
    /**
     * @param roadMapId
     * @returns RoadMapSaleResponse
     * @throws ApiError
     */
    public static roadMapSaleGetByRoadMap(
        roadMapId?: number,
    ): CancelablePromise<Array<RoadMapSaleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/RoadMapSale/GetByRoadMap',
            query: {
                'RoadMapId': roadMapId,
            },
        });
    }
    /**
     * @param data
     * @param roadMapId
     * @returns any
     * @throws ApiError
     */
    public static roadMapSaleAssignRoadMap(
        data: RoadMapSaleRequest,
        roadMapId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMapSale/AssignRoadMap',
            query: {
                'RoadMapId': roadMapId,
            },
            body: data,
        });
    }
    /**
     * @param data
     * @param roadMapId
     * @returns any
     * @throws ApiError
     */
    public static roadMapSaleUnassignRoadMap(
        data: RoadMapSaleRequest,
        roadMapId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMapSale/UnassignRoadMap',
            query: {
                'RoadMapId': roadMapId,
            },
            body: data,
        });
    }
}

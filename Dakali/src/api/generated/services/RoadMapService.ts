/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResultPageResponseOfRoadMapResponse } from '../models/ResultPageResponseOfRoadMapResponse';
import type { RoadMapFilter } from '../models/RoadMapFilter';
import type { RoadMapRequest } from '../models/RoadMapRequest';
import type { RoadMapResponse } from '../models/RoadMapResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoadMapService {
    /**
     * @returns RoadMapResponse
     * @throws ApiError
     */
    public static roadMapGetAll(): CancelablePromise<Array<RoadMapResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/RoadMap/GetAll',
        });
    }
    /**
     * @param cityFilter
     * @returns ResultPageResponseOfRoadMapResponse
     * @throws ApiError
     */
    public static roadMapGetPage(
        cityFilter: RoadMapFilter,
    ): CancelablePromise<ResultPageResponseOfRoadMapResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/GetPage',
            body: cityFilter,
        });
    }
    /**
     * @param id
     * @returns RoadMapResponse
     * @throws ApiError
     */
    public static roadMapGet(
        id?: number,
    ): CancelablePromise<RoadMapResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/RoadMap/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param data
     * @returns RoadMapResponse
     * @throws ApiError
     */
    public static roadMapCreate(
        data: RoadMapRequest,
    ): CancelablePromise<RoadMapResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns RoadMapResponse
     * @throws ApiError
     */
    public static roadMapUpdate(
        data: RoadMapRequest,
    ): CancelablePromise<RoadMapResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static roadMapDelete(
        data: RoadMapRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/Delete',
            body: data,
        });
    }
    /**
     * @param roadMapId
     * @returns any
     * @throws ApiError
     */
    public static roadMapOnTrip(
        roadMapId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/OnTrip',
            body: roadMapId,
        });
    }
    /**
     * @param roadMapId
     * @returns any
     * @throws ApiError
     */
    public static roadMapFinishTrip(
        roadMapId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/RoadMap/FinishTrip',
            body: roadMapId,
        });
    }
}

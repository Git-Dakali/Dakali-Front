/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HallwayRequest } from '../models/HallwayRequest';
import type { HallwayResponse } from '../models/HallwayResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HallwayService {
    /**
     * @returns HallwayResponse
     * @throws ApiError
     */
    public static hallwayGetAll(): CancelablePromise<Array<HallwayResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Hallway/GetAll',
        });
    }
    /**
     * @param id
     * @returns HallwayResponse
     * @throws ApiError
     */
    public static hallwayGet(
        id?: number,
    ): CancelablePromise<HallwayResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Hallway/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns HallwayResponse
     * @throws ApiError
     */
    public static hallwayGet2(
        code?: string,
    ): CancelablePromise<HallwayResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Hallway/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns HallwayResponse
     * @throws ApiError
     */
    public static hallwayCreate(
        data: HallwayRequest,
    ): CancelablePromise<HallwayResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Hallway/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns HallwayResponse
     * @throws ApiError
     */
    public static hallwayUpdate(
        data: HallwayRequest,
    ): CancelablePromise<HallwayResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Hallway/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static hallwayDelete(
        data: HallwayRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Hallway/Delete',
            body: data,
        });
    }
}

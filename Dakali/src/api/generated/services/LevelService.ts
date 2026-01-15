/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LevelRequest } from '../models/LevelRequest';
import type { LevelResponse } from '../models/LevelResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LevelService {
    /**
     * @returns LevelResponse
     * @throws ApiError
     */
    public static levelGetAll(): CancelablePromise<Array<LevelResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Level/GetAll',
        });
    }
    /**
     * @param id
     * @returns LevelResponse
     * @throws ApiError
     */
    public static levelGet(
        id?: number,
    ): CancelablePromise<LevelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Level/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param code
     * @returns LevelResponse
     * @throws ApiError
     */
    public static levelGet2(
        code?: string,
    ): CancelablePromise<LevelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Level/GetByCode',
            query: {
                'Code': code,
            },
        });
    }
    /**
     * @param data
     * @returns LevelResponse
     * @throws ApiError
     */
    public static levelCreate(
        data: LevelRequest,
    ): CancelablePromise<LevelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Level/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns LevelResponse
     * @throws ApiError
     */
    public static levelUpdate(
        data: LevelRequest,
    ): CancelablePromise<LevelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Level/Update',
            body: data,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static levelDelete(
        data: LevelRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Level/Delete',
            body: data,
        });
    }
}

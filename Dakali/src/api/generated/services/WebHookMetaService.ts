/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebHookMetaService {
    /**
     * @param hubMode
     * @param hubChallenge
     * @param hubVerifyToken
     * @returns string
     * @throws ApiError
     */
    public static webHookMetaEventGet(
        hubMode?: string,
        hubChallenge?: string,
        hubVerifyToken?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/WebHookMeta/Event',
            query: {
                'hub.mode': hubMode,
                'hub.challenge': hubChallenge,
                'hub.verify_token': hubVerifyToken,
            },
        });
    }
    /**
     * @param data
     * @returns binary
     * @throws ApiError
     */
    public static webHookMetaEventPost(
        data: any,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/WebHookMeta/Event',
            body: data,
        });
    }
}

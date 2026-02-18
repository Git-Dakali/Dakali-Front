/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProvinceRequest } from './ProvinceRequest';
import type { RequestGuid } from './RequestGuid';
export type CityRequest = (RequestGuid & {
    zipCode: string;
    name: string;
    province?: ProvinceRequest;
});


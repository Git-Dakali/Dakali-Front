/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProvinceResponse } from './ProvinceResponse';
import type { ResponseGuid } from './ResponseGuid';
export type CityResponse = (ResponseGuid & {
    zipCode: string;
    name: string;
    province?: ProvinceResponse;
});


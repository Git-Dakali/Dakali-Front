/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountryResponse } from './CountryResponse';
import type { ResponseCode } from './ResponseCode';
export type ProvinceResponse = (ResponseCode & {
    name: string;
    country?: CountryResponse;
});


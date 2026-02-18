/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountryRequest } from './CountryRequest';
import type { RequestCode } from './RequestCode';
export type ProvinceRequest = (RequestCode & {
    name: string;
    country?: CountryRequest;
});


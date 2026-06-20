/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CityRequest } from './CityRequest';
export type SaleLocationRequest = {
    saleId: number;
    address: string;
    observation: string;
    city?: CityRequest;
    longitude: number;
    latitude: number;
};


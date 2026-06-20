/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestGuid } from './RequestGuid';
import type { SaleRequest } from './SaleRequest';
export type ReturnOrderRequest = (RequestGuid & {
    number: number;
    sale: SaleRequest;
    returnDate?: string;
    state: string;
});


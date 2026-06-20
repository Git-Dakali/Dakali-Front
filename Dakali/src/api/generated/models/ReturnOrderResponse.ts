/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseGuid } from './ResponseGuid';
import type { SaleResponse } from './SaleResponse';
export type ReturnOrderResponse = (ResponseGuid & {
    number: number;
    sale: SaleResponse;
    returnDate?: string;
    state: string;
});


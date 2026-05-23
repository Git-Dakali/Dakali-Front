/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Filter } from './Filter';
export type SaleFilter = (Filter & {
    identifier?: string;
    number?: number;
    arcaNumber?: string;
    dni?: string;
    cuit?: string;
    date?: string;
    deliveryDate?: string;
    businessName?: string;
    address?: string;
    phone?: string;
    taxStatusId?: number;
    originSaleId?: number;
    cityId?: number;
    state?: string;
    skus: Array<string>;
});


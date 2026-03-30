/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CityResponse } from './CityResponse';
import type { OriginSaleResponse } from './OriginSaleResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { SaleDetailResponse } from './SaleDetailResponse';
import type { StoredFileResponse } from './StoredFileResponse';
import type { TaxStatusResponse } from './TaxStatusResponse';
export type SaleResponse = (ResponseGuid & {
    identifier: string;
    dni: string;
    cuit: string;
    number: number;
    arcaNumber: string;
    date?: string;
    deliveryDate?: string;
    deliveryStartTime: string;
    deliveryEndTime: string;
    businessName: string;
    address: string;
    floor: string;
    apartment: string;
    phone: string;
    observation: string;
    grossPrice: number;
    discounts: number;
    totalPrice: number;
    shippingPrice: number;
    latitude: number;
    longitude: number;
    taxStatus?: TaxStatusResponse;
    originSale?: OriginSaleResponse;
    pdfInvoice?: StoredFileResponse;
    city?: CityResponse;
    state: string;
    saleDetails: Array<SaleDetailResponse>;
});


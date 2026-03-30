/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CityRequest } from './CityRequest';
import type { OriginSaleRequest } from './OriginSaleRequest';
import type { RequestGuid } from './RequestGuid';
import type { SaleDetailRequest } from './SaleDetailRequest';
import type { StoredFileRequest } from './StoredFileRequest';
import type { TaxStatusRequest } from './TaxStatusRequest';
export type SaleRequest = (RequestGuid & {
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
    taxStatus?: TaxStatusRequest;
    originSale?: OriginSaleRequest;
    pdfInvoice?: StoredFileRequest;
    city?: CityRequest;
    state: string;
    saleDetails: Array<SaleDetailRequest>;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductColorRequest } from './ProductColorRequest';
import type { PropertyGroupRequest } from './PropertyGroupRequest';
import type { RequestGuid } from './RequestGuid';
export type VariantRequest = (RequestGuid & {
    name: string;
    price: number;
    salePrice: number;
    active: boolean;
    sortOrder: number;
    colorsHex: Array<ProductColorRequest>;
    propertyGroups: Array<PropertyGroupRequest>;
});


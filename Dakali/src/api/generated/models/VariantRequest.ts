/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorRequest } from './ColorRequest';
import type { PropertyGroupRequest } from './PropertyGroupRequest';
import type { RequestGuid } from './RequestGuid';
export type VariantRequest = (RequestGuid & {
    name: string;
    price: number;
    salePrice: number;
    active: boolean;
    sortOrder: number;
    colorsHex: Array<ColorRequest>;
    propertyGroups: Array<PropertyGroupRequest>;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorResponse } from './ColorResponse';
import type { PropertyGroupResponse } from './PropertyGroupResponse';
import type { ResponseGuid } from './ResponseGuid';
export type VariantResponse = (ResponseGuid & {
    name: string;
    price: number;
    salePrice: number;
    active: boolean;
    sortOrder: number;
    colorsHex: Array<ColorResponse>;
    propertyGroups: Array<PropertyGroupResponse>;
});


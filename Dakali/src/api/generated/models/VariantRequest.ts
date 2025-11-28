/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeGroupRequest } from './AttributeGroupRequest';
import type { ColorRequest } from './ColorRequest';
import type { RequestGuid } from './RequestGuid';
export type VariantRequest = (RequestGuid & {
    name: string;
    price: number;
    salePrice: number;
    active: boolean;
    colorsHex: Array<ColorRequest>;
    attributeGroups: Array<AttributeGroupRequest>;
});


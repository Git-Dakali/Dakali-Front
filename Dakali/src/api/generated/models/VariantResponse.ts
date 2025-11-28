/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeGroupResponse } from './AttributeGroupResponse';
import type { ColorResponse } from './ColorResponse';
import type { ResponseGuid } from './ResponseGuid';
export type VariantResponse = (ResponseGuid & {
    name: string;
    price: number;
    salePrice: number;
    active: boolean;
    colorsHex: Array<ColorResponse>;
    attributeGroups: Array<AttributeGroupResponse>;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeRequest } from './AttributeRequest';
import type { ColorRequest } from './ColorRequest';
import type { ImageRequest } from './ImageRequest';
export type VariantRequest = {
    id: number;
    size: string;
    cost: number;
    colorsHex: Array<ColorRequest>;
    images: Array<ImageRequest>;
    attributes: Array<AttributeRequest>;
};


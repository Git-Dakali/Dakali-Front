/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeResponse } from './AttributeResponse';
import type { ColorResponse } from './ColorResponse';
import type { ImageResponse } from './ImageResponse';
export type VariantResponse = {
    id: number;
    size: string;
    cost: number;
    colorsHex: Array<ColorResponse>;
    images: Array<ImageResponse>;
    attributes: Array<AttributeResponse>;
};


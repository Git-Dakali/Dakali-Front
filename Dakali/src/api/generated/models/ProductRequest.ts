/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRequest } from './CategoryRequest';
import type { FieldRequest } from './FieldRequest';
import type { ProductColorRequest } from './ProductColorRequest';
import type { ProductSkuRequest } from './ProductSkuRequest';
import type { RequestCode } from './RequestCode';
import type { VariantRequest } from './VariantRequest';
export type ProductRequest = (RequestCode & {
    name: string;
    description: string;
    active: boolean;
    price: number;
    salePrice: number;
    weight: number;
    category?: CategoryRequest;
    fields: Array<FieldRequest>;
    variants: Array<VariantRequest>;
    colors: Array<ProductColorRequest>;
    skus: Array<ProductSkuRequest>;
});


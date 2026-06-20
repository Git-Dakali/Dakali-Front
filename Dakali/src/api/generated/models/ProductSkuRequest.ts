/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductColorRequest } from './ProductColorRequest';
import type { ProductRequest } from './ProductRequest';
import type { RequestGuid } from './RequestGuid';
import type { VariantRequest } from './VariantRequest';
export type ProductSkuRequest = (RequestGuid & {
    product?: ProductRequest;
    color?: ProductColorRequest;
    variant?: VariantRequest;
    sku: string;
});


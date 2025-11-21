/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelRequest } from './ModelRequest';
import type { VariantRequest } from './VariantRequest';
export type ProductRequest = {
    name: string;
    description: string;
    model: ModelRequest;
    variants: Array<VariantRequest>;
};


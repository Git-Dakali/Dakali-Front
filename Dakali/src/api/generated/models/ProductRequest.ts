/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelRequest } from './ModelRequest';
import type { RequestGuid } from './RequestGuid';
import type { VariantRequest } from './VariantRequest';
export type ProductRequest = (RequestGuid & {
    name: string;
    description: string;
    model: ModelRequest;
    variants: Array<VariantRequest>;
});


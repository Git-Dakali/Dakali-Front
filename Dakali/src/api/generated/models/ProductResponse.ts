/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelResponse } from './ModelResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { VariantResponse } from './VariantResponse';
export type ProductResponse = (ResponseGuid & {
    name: string;
    description: string;
    model: ModelResponse;
    variants: Array<VariantResponse>;
});


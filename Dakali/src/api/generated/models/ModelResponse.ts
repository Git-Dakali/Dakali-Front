/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
import type { FieldGroupResponse } from './FieldGroupResponse';
import type { ResponseCode } from './ResponseCode';
export type ModelResponse = (ResponseCode & {
    category: CategoryResponse;
    fieldGroups: Array<FieldGroupResponse>;
    variantNames: Array<string>;
});


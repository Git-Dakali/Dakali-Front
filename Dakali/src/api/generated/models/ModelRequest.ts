/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRequest } from './CategoryRequest';
import type { FieldGroupRequest } from './FieldGroupRequest';
import type { RequestCode } from './RequestCode';
export type ModelRequest = (RequestCode & {
    category: CategoryRequest;
    fieldGroups: Array<FieldGroupRequest>;
    variantNames: Array<string>;
});


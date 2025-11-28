/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldResponse } from './FieldResponse';
import type { ResponseGuid } from './ResponseGuid';
export type FieldGroupResponse = (ResponseGuid & {
    name: string;
    sortOrder: number;
    fields: Array<FieldResponse>;
});


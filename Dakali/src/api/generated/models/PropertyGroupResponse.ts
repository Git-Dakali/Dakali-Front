/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyResponse } from './PropertyResponse';
import type { RequestGuid } from './RequestGuid';
export type PropertyGroupResponse = (RequestGuid & {
    name: string;
    sortOrder: number;
    properties: Array<PropertyResponse>;
});


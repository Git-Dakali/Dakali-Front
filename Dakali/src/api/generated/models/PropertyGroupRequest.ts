/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyRequest } from './PropertyRequest';
import type { RequestGuid } from './RequestGuid';
export type PropertyGroupRequest = (RequestGuid & {
    name: string;
    sortOrder: number;
    properties: Array<PropertyRequest>;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeRequest } from './AttributeRequest';
import type { RequestGuid } from './RequestGuid';
export type AttributeGroupRequest = (RequestGuid & {
    name: string;
    sortOrder: number;
    attributes: Array<AttributeRequest>;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeResponse } from './AttributeResponse';
import type { RequestGuid } from './RequestGuid';
export type AttributeGroupResponse = (RequestGuid & {
    name: string;
    sortOrder: number;
    attributes: Array<AttributeResponse>;
});


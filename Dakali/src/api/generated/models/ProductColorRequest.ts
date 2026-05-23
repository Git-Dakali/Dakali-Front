/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageRequest } from './ImageRequest';
import type { RequestGuid } from './RequestGuid';
export type ProductColorRequest = (RequestGuid & {
    name: string;
    hex: string;
    sku: string;
    sortOrder: number;
    images: Array<ImageRequest>;
});


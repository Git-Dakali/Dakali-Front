/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageRequest } from './ImageRequest';
import type { RequestGuid } from './RequestGuid';
export type ColorRequest = (RequestGuid & {
    name: string;
    hex: string;
    sortOrder: number;
    images: Array<ImageRequest>;
});


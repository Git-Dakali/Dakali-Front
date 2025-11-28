/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageResponse } from './ImageResponse';
import type { ResponseGuid } from './ResponseGuid';
export type ColorResponse = (ResponseGuid & {
    name: string;
    hex: string;
    sortOrder: number;
    images: Array<ImageResponse>;
});


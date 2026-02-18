/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseGuid } from './ResponseGuid';
import type { StoredFileResponse } from './StoredFileResponse';
export type ImageResponse = (ResponseGuid & {
    file?: StoredFileResponse;
    isPrimary: boolean;
    sortOrder: number;
});


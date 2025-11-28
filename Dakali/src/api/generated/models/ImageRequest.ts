/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestGuid } from './RequestGuid';
import type { StoredFileRequest } from './StoredFileRequest';
export type ImageRequest = (RequestGuid & {
    file: StoredFileRequest;
    isPrimary: boolean;
    sortOrder: number;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from './Response';
import type { StoredFileResponse } from './StoredFileResponse';
export type HistoricSaleResponse = (Response & {
    creationDate: string;
    state: string;
    description: string;
    storedFile: StoredFileResponse;
});


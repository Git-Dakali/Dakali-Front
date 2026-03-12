/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverResponse } from './DriverResponse';
import type { ResponseGuid } from './ResponseGuid';
import type { RoadMapSaleResponse } from './RoadMapSaleResponse';
export type RoadMapResponse = (ResponseGuid & {
    number: number;
    date?: string;
    travelDate?: string;
    completionDate?: string;
    driver: DriverResponse;
    state: string;
    sales: Array<RoadMapSaleResponse>;
});


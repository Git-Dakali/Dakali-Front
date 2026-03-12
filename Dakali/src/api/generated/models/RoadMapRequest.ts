/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverRequest } from './DriverRequest';
import type { RequestGuid } from './RequestGuid';
import type { RoadMapSaleRequest } from './RoadMapSaleRequest';
export type RoadMapRequest = (RequestGuid & {
    number: number;
    date?: string;
    travelDate?: string;
    completionDate?: string;
    driver: DriverRequest;
    state: string;
    sales: Array<RoadMapSaleRequest>;
});


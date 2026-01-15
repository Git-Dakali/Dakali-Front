/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnRequest } from './ColumnRequest';
import type { HallwayRequest } from './HallwayRequest';
import type { LevelRequest } from './LevelRequest';
import type { LocationStateRequest } from './LocationStateRequest';
import type { RequestGuid } from './RequestGuid';
export type LocationRequest = (RequestGuid & {
    hallway: HallwayRequest;
    column: ColumnRequest;
    level: LevelRequest;
    state: LocationStateRequest;
});


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnResponse } from './ColumnResponse';
import type { HallwayResponse } from './HallwayResponse';
import type { LevelResponse } from './LevelResponse';
import type { LocationStateResponse } from './LocationStateResponse';
import type { ResponseGuid } from './ResponseGuid';
export type LocationResponse = (ResponseGuid & {
    hallway: HallwayResponse;
    column: ColumnResponse;
    level: LevelResponse;
    state: LocationStateResponse;
});


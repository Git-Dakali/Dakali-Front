/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRequest } from './CategoryRequest';
import type { FieldGroupRequest } from './FieldGroupRequest';
import type { SizeRequest } from './SizeRequest';
export type ModelRequest = {
    id: number;
    code: string;
    category: CategoryRequest;
    fieldGroups: Array<FieldGroupRequest>;
    sizes: Array<SizeRequest>;
};


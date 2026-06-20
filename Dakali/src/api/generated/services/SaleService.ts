/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResultPageResponseOfSaleResponse } from '../models/ResultPageResponseOfSaleResponse';
import type { SaleFilter } from '../models/SaleFilter';
import type { SaleLocationRequest } from '../models/SaleLocationRequest';
import type { SaleRequest } from '../models/SaleRequest';
import type { SaleResponse } from '../models/SaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SaleService {
    /**
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGetAll(): CancelablePromise<Array<SaleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetAll',
        });
    }
    /**
     * @param cityFilter
     * @returns ResultPageResponseOfSaleResponse
     * @throws ApiError
     */
    public static saleGetPage(
        cityFilter: SaleFilter,
    ): CancelablePromise<ResultPageResponseOfSaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/GetPage',
            body: cityFilter,
        });
    }
    /**
     * @param id
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGet(
        id?: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetById',
            query: {
                'Id': id,
            },
        });
    }
    /**
     * @param number
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleGetByNumber(
        number?: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/GetByNumber',
            query: {
                'number': number,
            },
        });
    }
    /**
     * @param data
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleCreate(
        data: SaleRequest,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Create',
            body: data,
        });
    }
    /**
     * @param data
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleUpdate(
        data: SaleRequest,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Update',
            body: data,
        });
    }
    /**
     * @param saleId
     * @param isPrinted
     * @returns any
     * @throws ApiError
     */
    public static saleUpdateIsPrinted(
        saleId?: number,
        isPrinted?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/UpdateIsPrinted',
            query: {
                'saleId': saleId,
                'isPrinted': isPrinted,
            },
        });
    }
    /**
     * @param request
     * @returns any
     * @throws ApiError
     */
    public static saleAddLocation(
        request: SaleLocationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/AddLocation',
            body: request,
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static saleDelete(
        data: SaleRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Delete',
            body: data,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleConfirm(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Confirm',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static salePrepared(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Prepared',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static salePendingDispatch(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/PendingDispatch',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleOnTrip(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/OnTrip',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleDeliver(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Deliver',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static salePartialDeliver(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/PartialDeliver',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleReject(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Reject',
            body: saleId,
        });
    }
    /**
     * @param saleId
     * @returns SaleResponse
     * @throws ApiError
     */
    public static saleCancel(
        saleId: number,
    ): CancelablePromise<SaleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Sale/Cancel',
            body: saleId,
        });
    }
    /**
     * @param saleIds
     * @returns string
     * @throws ApiError
     */
    public static saleReportExcelDarLogitics(
        saleIds?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Sale/ReportExcelDarLogitics',
            query: {
                'SaleIds': saleIds,
            },
        });
    }
}

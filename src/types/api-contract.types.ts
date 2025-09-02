import type { Request } from 'express';
import type { HttpStatusCode } from '../core';
import type { ZodError } from 'zod';
import type { UserStatus, UserType } from '@/database/entities';

declare global {
  namespace Express {
    interface Request {
      user?: ApiRequestUser;
    }

    interface Response {
      sendResponse<T>(
        response: DataResponse<T> | DownloadResponse | ViewResponse | ApiError | ZodError | Error,
      ): this | void;
    }
  }
}

export class ApiError extends Error {
  public status: HttpStatusCode;
  public data: any;

  constructor(message: string, status: HttpStatusCode, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Add the user to the request object
export type ApiRequestUser = {
  id: string;
  userType: UserType;
  userStatus: UserStatus;
};

export interface AuthRequest extends Request {
  user: ApiRequestUser;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  pages: number;
}

type OutgoingHttpHeaders = {
  [header: string]: number | string | string[] | undefined;
};

export interface DataResponse<T = undefined> {
  message: string;
  data?: T;
  pagination?: Pagination;
  status: HttpStatusCode;
  headers?: OutgoingHttpHeaders[];
}

export interface DownloadResponse {
  filePath: string;
  fileName: string;
  headers?: OutgoingHttpHeaders[];
}

export interface ViewResponse {
  filePath: string;
  headers?: OutgoingHttpHeaders[];
}

export const isDownloadResponse = (res: any): res is DownloadResponse => {
  return typeof res?.filePath === 'string' && typeof res?.fileName === 'string';
};

export const isViewResponse = (res: any): res is ViewResponse => {
  return typeof res?.filePath === 'string';
};

export interface RequestQuery {
  page: string;
  pageSize: string;
  search: string;
  orderBy: string;
  order: 'ASC' | 'DESC';
  filters?: Record<string, string | string[] | boolean>;
}

export interface QueryFilter extends RequestQuery {
  limit: number;
  offset: number;
}

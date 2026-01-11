/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IBuilderIoCredentials } from '../types/BuilderIoTypes';

const CONTENT_API_BASE_URL = 'https://cdn.builder.io/api/v2';
const WRITE_API_BASE_URL = 'https://builder.io/api/v1/write';
const UPLOAD_API_BASE_URL = 'https://builder.io/api/v1/upload';
const ADMIN_API_BASE_URL = 'https://builder.io/api/v1';

/**
 * Make a request to the Builder.io Content API (read operations)
 */
export async function builderIoContentApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('builderIoApi') as IBuilderIoCredentials;

	const options: IRequestOptions = {
		method,
		uri: `${CONTENT_API_BASE_URL}${endpoint}`,
		headers: {
			Accept: 'application/json',
		},
		qs: {
			apiKey: credentials.publicApiKey,
			...query,
		},
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a request to the Builder.io Write API (create/update/delete operations)
 */
export async function builderIoWriteApiRequest(
	this: IExecuteFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	model: string,
	entryId?: string,
	body?: IDataObject,
	query: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('builderIoApi') as IBuilderIoCredentials;

	if (!credentials.privateApiKey) {
		throw new Error('Private API key is required for write operations');
	}

	let uri = `${WRITE_API_BASE_URL}/${model}`;
	if (entryId) {
		uri += `/${entryId}`;
	}

	const options: IRequestOptions = {
		method,
		uri,
		headers: {
			Authorization: `Bearer ${credentials.privateApiKey}`,
			'Content-Type': 'application/json',
		},
		qs: query,
		json: true,
	};

	if (body) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a request to the Builder.io Admin API
 */
export async function builderIoAdminApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('builderIoApi') as IBuilderIoCredentials;

	if (!credentials.privateApiKey) {
		throw new Error('Private API key is required for admin operations');
	}

	const options: IRequestOptions = {
		method,
		uri: `${ADMIN_API_BASE_URL}${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.privateApiKey}`,
			'Content-Type': 'application/json',
		},
		qs: query,
		json: true,
	};

	if (body) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Upload an asset to Builder.io
 */
export async function builderIoUploadAsset(
	this: IExecuteFunctions,
	binaryData: Buffer,
	filename: string,
	mimeType: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('builderIoApi') as IBuilderIoCredentials;

	if (!credentials.privateApiKey) {
		throw new Error('Private API key is required for upload operations');
	}

	const options: IRequestOptions = {
		method: 'POST',
		uri: UPLOAD_API_BASE_URL,
		headers: {
			Authorization: `Bearer ${credentials.privateApiKey}`,
		},
		formData: {
			file: {
				value: binaryData,
				options: {
					filename,
					contentType: mimeType,
				},
			},
		},
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Get all items with pagination
 */
export async function builderIoContentApiRequestAllItems(
	this: IExecuteFunctions,
	model: string,
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let offset = 0;
	const limit = 100;
	const maxResults = (query.maxResults as number) || 1000;

	delete query.maxResults;

	do {
		const response = await builderIoContentApiRequest.call(
			this,
			'GET',
			`/content/${model}`,
			{
				...query,
				limit,
				offset,
			},
		) as IDataObject;

		const results = (response.results as IDataObject[]) || [];

		if (results.length === 0) {
			break;
		}

		returnData.push(...results);
		offset += limit;
	} while (returnData.length < maxResults);

	return returnData.slice(0, maxResults);
}

/**
 * Helper to build query string from options
 */
export function buildQueryString(options: IDataObject): IDataObject {
	const query: IDataObject = {};

	if (options.limit) query.limit = options.limit;
	if (options.offset) query.offset = options.offset;
	if (options.includeRefs) query.includeRefs = options.includeRefs;
	if (options.cacheSeconds) query.cacheSeconds = options.cacheSeconds;
	if (options.locale) query.locale = options.locale;
	if (options.fields) query.fields = options.fields;
	if (options.sort) query.sort = JSON.stringify(options.sort);
	if (options.query) query.query = JSON.stringify(options.query);
	if (options.userAttributes) query.userAttributes = JSON.stringify(options.userAttributes);

	return query;
}

/**
 * Exponential backoff for rate limiting
 */
export async function exponentialBackoff(retryCount: number): Promise<void> {
	const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
	await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Parse Builder.io error response
 */
export function parseBuilderIoError(error: IDataObject): string {
	if (error.error && typeof error.error === 'object') {
		const errorObj = error.error as IDataObject;
		return errorObj.message as string || 'Unknown Builder.io error';
	}
	if (error.errors && Array.isArray(error.errors)) {
		return (error.errors as IDataObject[]).map((e: IDataObject) => `${e.field}: ${e.message}`).join(', ');
	}
	return 'Unknown Builder.io error';
}

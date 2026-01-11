/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Parse a JSON string or return the object if already parsed
 */
export function parseJsonOrDefault<T>(value: string | T, defaultValue: T): T {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value) as T;
		} catch {
			return defaultValue;
		}
	}
	return value;
}

/**
 * Build MongoDB-style query object for Builder.io
 */
export function buildQuery(filters: IDataObject[]): IDataObject {
	if (!filters || filters.length === 0) {
		return {};
	}

	const query: IDataObject = {};

	for (const filter of filters) {
		const field = filter.field as string;
		const operator = filter.operator as string;
		const value = filter.value;

		switch (operator) {
			case 'equals':
				query[`data.${field}`] = value;
				break;
			case 'notEquals':
				query[`data.${field}`] = { $ne: value };
				break;
			case 'contains':
				query[`data.${field}`] = { $regex: value, $options: 'i' };
				break;
			case 'greaterThan':
				query[`data.${field}`] = { $gt: value };
				break;
			case 'lessThan':
				query[`data.${field}`] = { $lt: value };
				break;
			case 'greaterThanOrEquals':
				query[`data.${field}`] = { $gte: value };
				break;
			case 'lessThanOrEquals':
				query[`data.${field}`] = { $lte: value };
				break;
			case 'in':
				query[`data.${field}`] = { $in: (value as string).split(',').map((v) => v.trim()) };
				break;
			case 'exists':
				query[`data.${field}`] = { $exists: true };
				break;
			case 'notExists':
				query[`data.${field}`] = { $exists: false };
				break;
			default:
				query[`data.${field}`] = value;
		}
	}

	return query;
}

/**
 * Build sort object for Builder.io queries
 */
export function buildSort(sortField: string, sortDirection: 'asc' | 'desc'): IDataObject {
	return {
		[sortField]: sortDirection === 'asc' ? 1 : -1,
	};
}

/**
 * Clean up undefined and null values from an object
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			cleaned[key] = value;
		}
	}
	return cleaned;
}

/**
 * Format date to ISO 8601 string
 */
export function formatDate(date: string | Date): string {
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Parse targeting user attributes from n8n format
 */
export function parseUserAttributes(attributes: IDataObject): IDataObject {
	const parsed: IDataObject = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (typeof value === 'string') {
			// Try to parse numbers and booleans
			if (value === 'true') {
				parsed[key] = true;
			} else if (value === 'false') {
				parsed[key] = false;
			} else if (!isNaN(Number(value))) {
				parsed[key] = Number(value);
			} else {
				parsed[key] = value;
			}
		} else {
			parsed[key] = value;
		}
	}
	return parsed;
}

/**
 * Get MIME type from filename
 */
export function getMimeType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	const mimeTypes: Record<string, string> = {
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		gif: 'image/gif',
		webp: 'image/webp',
		svg: 'image/svg+xml',
		mp4: 'video/mp4',
		webm: 'video/webm',
		pdf: 'application/pdf',
		json: 'application/json',
		txt: 'text/plain',
		html: 'text/html',
		css: 'text/css',
		js: 'application/javascript',
	};
	return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate that required fields are present
 */
export function validateRequiredFields(data: IDataObject, fields: string[]): void {
	const missing = fields.filter((field) => !data[field]);
	if (missing.length > 0) {
		throw new Error(`Missing required fields: ${missing.join(', ')}`);
	}
}

/**
 * Truncate string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}
	return `${str.substring(0, maxLength - 3)}...`;
}

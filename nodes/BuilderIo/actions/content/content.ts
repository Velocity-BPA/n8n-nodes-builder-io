/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { CONTENT_OPERATIONS, PUBLISHED_STATUS_OPTIONS } from '../../constants';
import { builderIoContentApiRequest, builderIoContentApiRequestAllItems, builderIoWriteApiRequest, buildQueryString } from '../../transport';
import { buildQuery, buildSort, cleanObject } from '../../utils';

export const contentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['content'],
			},
		},
		options: CONTENT_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'get',
	},
];

export const contentFields: INodeProperties[] = [
	// Model name - used by most operations
	{
		displayName: 'Model Name',
		name: 'model',
		type: 'string',
		required: true,
		default: 'page',
		description: 'The model name (e.g., "page", "section", "blog-post")',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['get', 'getAll', 'getByUrl', 'query', 'create', 'update', 'patch', 'delete', 'publish', 'unpublish', 'archive', 'duplicate'],
			},
		},
	},
	// Entry ID - used for single entry operations
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		required: true,
		default: '',
		description: 'The content entry ID',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['get', 'update', 'patch', 'delete', 'publish', 'unpublish', 'archive', 'duplicate'],
			},
		},
	},
	// URL - for getByUrl
	{
		displayName: 'URL Path',
		name: 'urlPath',
		type: 'string',
		required: true,
		default: '',
		placeholder: '/about',
		description: 'The URL path to match',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['getByUrl'],
			},
		},
	},
	// Data - for create and update
	{
		displayName: 'Content Data',
		name: 'data',
		type: 'json',
		required: true,
		default: '{}',
		description: 'The content data as JSON object',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['create', 'update', 'patch'],
			},
		},
	},
	// Name - for create
	{
		displayName: 'Entry Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name for the content entry',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['create'],
			},
		},
	},
	// Return All toggle
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['getAll', 'query'],
			},
		},
	},
	// Limit
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 20,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['getAll', 'query'],
				returnAll: [false],
			},
		},
	},
	// Query filters
	{
		displayName: 'Query Filters',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['query'],
			},
		},
		options: [
			{
				name: 'filterValues',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
						description: 'The field name to filter on',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						default: 'equals',
						options: [
							{ name: 'Equals', value: 'equals' },
							{ name: 'Not Equals', value: 'notEquals' },
							{ name: 'Contains', value: 'contains' },
							{ name: 'Greater Than', value: 'greaterThan' },
							{ name: 'Less Than', value: 'lessThan' },
							{ name: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
							{ name: 'Less Than or Equals', value: 'lessThanOrEquals' },
							{ name: 'In (comma-separated)', value: 'in' },
							{ name: 'Exists', value: 'exists' },
							{ name: 'Not Exists', value: 'notExists' },
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to filter by',
					},
				],
			},
		],
	},
	// Additional options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['get', 'getAll', 'getByUrl', 'query'],
			},
		},
		options: [
			{
				displayName: 'Cache Seconds',
				name: 'cacheSeconds',
				type: 'number',
				default: 0,
				description: 'Cache TTL override in seconds',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				description: 'Comma-separated list of fields to include in response',
			},
			{
				displayName: 'Include Refs',
				name: 'includeRefs',
				type: 'boolean',
				default: false,
				description: 'Whether to include referenced content',
			},
			{
				displayName: 'Include Unpublished',
				name: 'includeUnpublished',
				type: 'boolean',
				default: false,
				description: 'Whether to include unpublished content (requires private API key)',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: '',
				placeholder: 'en-US',
				description: 'Locale code for localized content',
			},
			{
				displayName: 'Published Status',
				name: 'published',
				type: 'options',
				default: '',
				options: PUBLISHED_STATUS_OPTIONS.map((opt) => ({
					name: opt.name,
					value: opt.value,
				})),
				description: 'Filter by published status',
			},
			{
				displayName: 'Sort Field',
				name: 'sortField',
				type: 'string',
				default: 'createdDate',
				description: 'Field to sort by',
			},
			{
				displayName: 'Sort Direction',
				name: 'sortDirection',
				type: 'options',
				default: 'desc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
			},
			{
				displayName: 'User Attributes',
				name: 'userAttributes',
				type: 'json',
				default: '{}',
				description: 'User attributes for targeting evaluation',
			},
		],
	},
	// Create/Update options
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Published',
				name: 'published',
				type: 'options',
				default: 'draft',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Published', value: 'published' },
				],
				description: 'The published status of the entry',
			},
			{
				displayName: 'URL Query',
				name: 'urlQuery',
				type: 'json',
				default: '[]',
				description: 'URL targeting query as JSON array',
			},
		],
	},
	// Duplicate options
	{
		displayName: 'New Name',
		name: 'newName',
		type: 'string',
		default: '',
		description: 'Name for the duplicated entry (optional)',
		displayOptions: {
			show: {
				resource: ['content'],
				operation: ['duplicate'],
			},
		},
	},
];

export async function executeContentOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const model = this.getNodeParameter('model', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'get': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;
			const query = buildQueryString(cleanObject(options));
			responseData = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}/${entryId}`, query);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const options = this.getNodeParameter('options', index) as IDataObject;
			const query: IDataObject = cleanObject(options);

			if (options.sortField && options.sortDirection) {
				query.sort = buildSort(options.sortField as string, options.sortDirection as 'asc' | 'desc');
			}

			if (returnAll) {
				responseData = await builderIoContentApiRequestAllItems.call(this, model, query);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
				const response = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}`, buildQueryString(query)) as IDataObject;
				responseData = (response.results as IDataObject[]) || [];
			}
			break;
		}

		case 'getByUrl': {
			const urlPath = this.getNodeParameter('urlPath', index) as string;
			const options = this.getNodeParameter('options', index) as IDataObject;
			const query = buildQueryString({
				...cleanObject(options),
				url: urlPath,
			});
			responseData = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}`, query);
			break;
		}

		case 'query': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const filterValues = (filters.filterValues as IDataObject[]) || [];
			const mongoQuery = buildQuery(filterValues);

			const query: IDataObject = {
				...cleanObject(options),
				query: mongoQuery,
			};

			if (options.sortField && options.sortDirection) {
				query.sort = buildSort(options.sortField as string, options.sortDirection as 'asc' | 'desc');
			}

			if (returnAll) {
				responseData = await builderIoContentApiRequestAllItems.call(this, model, query);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
				const response = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}`, buildQueryString(query)) as IDataObject;
				responseData = (response.results as IDataObject[]) || [];
			}
			break;
		}

		case 'create': {
			const name = this.getNodeParameter('name', index) as string;
			const data = this.getNodeParameter('data', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				name,
				data: JSON.parse(data),
				...cleanObject(additionalFields),
			};

			if (additionalFields.urlQuery) {
				body.query = JSON.parse(additionalFields.urlQuery as string);
				delete body.urlQuery;
			}

			responseData = await builderIoWriteApiRequest.call(this, 'POST', model, undefined, body);
			break;
		}

		case 'update': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			const data = this.getNodeParameter('data', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				data: JSON.parse(data),
				...cleanObject(additionalFields),
			};

			if (additionalFields.urlQuery) {
				body.query = JSON.parse(additionalFields.urlQuery as string);
				delete body.urlQuery;
			}

			responseData = await builderIoWriteApiRequest.call(this, 'PUT', model, entryId, body);
			break;
		}

		case 'patch': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			const data = this.getNodeParameter('data', index) as string;

			const body: IDataObject = {
				data: JSON.parse(data),
			};

			responseData = await builderIoWriteApiRequest.call(this, 'PATCH', model, entryId, body);
			break;
		}

		case 'delete': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			responseData = await builderIoWriteApiRequest.call(this, 'DELETE', model, entryId);
			break;
		}

		case 'publish': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			responseData = await builderIoWriteApiRequest.call(this, 'PUT', model, entryId, { published: 'published' });
			break;
		}

		case 'unpublish': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			responseData = await builderIoWriteApiRequest.call(this, 'PUT', model, entryId, { published: 'draft' });
			break;
		}

		case 'archive': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			responseData = await builderIoWriteApiRequest.call(this, 'PUT', model, entryId, { published: 'archived' });
			break;
		}

		case 'duplicate': {
			const entryId = this.getNodeParameter('entryId', index) as string;
			const newName = this.getNodeParameter('newName', index) as string;

			// First, get the original entry
			const original = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}/${entryId}`) as IDataObject;

			// Create a new entry with the same data
			const body: IDataObject = {
				name: newName || `${original.name} (Copy)`,
				data: original.data,
				published: 'draft',
			};

			if (original.query) {
				body.query = original.query;
			}

			responseData = await builderIoWriteApiRequest.call(this, 'POST', model, undefined, body);
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

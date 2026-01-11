/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { MODEL_OPERATIONS } from '../../constants';
import { builderIoAdminApiRequest, builderIoContentApiRequest, builderIoContentApiRequestAllItems } from '../../transport';

export const modelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['model'],
			},
		},
		options: MODEL_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const modelFields: INodeProperties[] = [
	// Model Name - for single model operations
	{
		displayName: 'Model Name',
		name: 'modelName',
		type: 'string',
		required: true,
		default: '',
		description: 'The model API name',
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['get', 'getSchema', 'getEntries', 'count'],
			},
		},
	},
	// Return All toggle for getEntries
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['getEntries'],
			},
		},
	},
	// Limit for getEntries
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
				resource: ['model'],
				operation: ['getEntries'],
				returnAll: [false],
			},
		},
	},
	// Options for getAll
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Include Private',
				name: 'includePrivate',
				type: 'boolean',
				default: false,
				description: 'Whether to include private models',
			},
		],
	},
	// Options for getEntries
	{
		displayName: 'Options',
		name: 'entryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['getEntries'],
			},
		},
		options: [
			{
				displayName: 'Include Unpublished',
				name: 'includeUnpublished',
				type: 'boolean',
				default: false,
				description: 'Whether to include unpublished entries',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: '',
				description: 'Locale code for localized content',
			},
		],
	},
];

export async function executeModelOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getAll': {
			const options = this.getNodeParameter('options', index) as IDataObject;
			const query: IDataObject = {};
			if (options.includePrivate) {
				query.includePrivate = true;
			}
			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/models', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const modelName = this.getNodeParameter('modelName', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/models/${modelName}`);
			break;
		}

		case 'getSchema': {
			const modelName = this.getNodeParameter('modelName', index) as string;
			const model = await builderIoAdminApiRequest.call(this, 'GET', `/models/${modelName}`) as IDataObject;
			responseData = {
				modelName,
				schema: model.schema || [],
				fields: model.fields || [],
			};
			break;
		}

		case 'getEntries': {
			const modelName = this.getNodeParameter('modelName', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const options = this.getNodeParameter('entryOptions', index) as IDataObject;

			const query: IDataObject = {};
			if (options.includeUnpublished) {
				query.includeUnpublished = true;
			}
			if (options.locale) {
				query.locale = options.locale;
			}

			if (returnAll) {
				responseData = await builderIoContentApiRequestAllItems.call(this, modelName, query);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
				const response = await builderIoContentApiRequest.call(this, 'GET', `/content/${modelName}`, query) as IDataObject;
				responseData = (response.results as IDataObject[]) || [];
			}
			break;
		}

		case 'count': {
			const modelName = this.getNodeParameter('modelName', index) as string;
			// Get all entries with minimal data to count them
			const response = await builderIoContentApiRequest.call(this, 'GET', `/content/${modelName}`, {
				limit: 1,
				fields: 'id',
			}) as IDataObject;
			responseData = {
				modelName,
				count: response.count || (response.results as IDataObject[])?.length || 0,
			};
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

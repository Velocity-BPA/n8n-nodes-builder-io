/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { SYMBOL_OPERATIONS } from '../../constants';
import { builderIoAdminApiRequest, builderIoContentApiRequest, builderIoWriteApiRequest } from '../../transport';

export const symbolOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['symbol'],
			},
		},
		options: SYMBOL_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const symbolFields: INodeProperties[] = [
	// Symbol ID
	{
		displayName: 'Symbol ID',
		name: 'symbolId',
		type: 'string',
		required: true,
		default: '',
		description: 'The symbol unique identifier',
		displayOptions: {
			show: {
				resource: ['symbol'],
				operation: ['get', 'update', 'delete', 'getInstances'],
			},
		},
	},
	// Symbol name for create
	{
		displayName: 'Symbol Name',
		name: 'symbolName',
		type: 'string',
		required: true,
		default: '',
		description: 'The name for the symbol',
		displayOptions: {
			show: {
				resource: ['symbol'],
				operation: ['create'],
			},
		},
	},
	// Model ID for create
	{
		displayName: 'Model',
		name: 'modelId',
		type: 'string',
		required: true,
		default: 'symbol',
		description: 'The model the symbol belongs to',
		displayOptions: {
			show: {
				resource: ['symbol'],
				operation: ['create'],
			},
		},
	},
	// Symbol data
	{
		displayName: 'Symbol Data',
		name: 'symbolData',
		type: 'json',
		required: true,
		default: '{}',
		description: 'The symbol content data as JSON',
		displayOptions: {
			show: {
				resource: ['symbol'],
				operation: ['create', 'update'],
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
				resource: ['symbol'],
				operation: ['getAll', 'getInstances'],
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
				resource: ['symbol'],
				operation: ['getAll', 'getInstances'],
				returnAll: [false],
			},
		},
	},
	// Options for create/update
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['symbol'],
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
			},
		],
	},
];

export async function executeSymbolOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const query: IDataObject = {};

			if (!returnAll) {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
			}

			const response = await builderIoContentApiRequest.call(this, 'GET', '/content/symbol', query) as IDataObject;
			responseData = (response.results as IDataObject[]) || [];
			break;
		}

		case 'get': {
			const symbolId = this.getNodeParameter('symbolId', index) as string;
			responseData = await builderIoContentApiRequest.call(this, 'GET', `/content/symbol/${symbolId}`);
			break;
		}

		case 'create': {
			const symbolName = this.getNodeParameter('symbolName', index) as string;
			const modelId = this.getNodeParameter('modelId', index) as string;
			const symbolData = this.getNodeParameter('symbolData', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				name: symbolName,
				modelId,
				data: JSON.parse(symbolData),
				...additionalFields,
			};

			responseData = await builderIoWriteApiRequest.call(this, 'POST', 'symbol', undefined, body);
			break;
		}

		case 'update': {
			const symbolId = this.getNodeParameter('symbolId', index) as string;
			const symbolData = this.getNodeParameter('symbolData', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				data: JSON.parse(symbolData),
				...additionalFields,
			};

			responseData = await builderIoWriteApiRequest.call(this, 'PUT', 'symbol', symbolId, body);
			break;
		}

		case 'delete': {
			const symbolId = this.getNodeParameter('symbolId', index) as string;
			responseData = await builderIoWriteApiRequest.call(this, 'DELETE', 'symbol', symbolId);
			break;
		}

		case 'getInstances': {
			const symbolId = this.getNodeParameter('symbolId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			const query: IDataObject = {
				query: JSON.stringify({
					'data.symbol.id': symbolId,
				}),
			};

			if (!returnAll) {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
			}

			// Search across all content for symbol references
			const response = await builderIoAdminApiRequest.call(this, 'GET', '/content', undefined, query) as IDataObject;
			responseData = (response.results as IDataObject[]) || [];
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

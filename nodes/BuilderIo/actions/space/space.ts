/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { SPACE_OPERATIONS } from '../../constants';
import { builderIoAdminApiRequest } from '../../transport';

export const spaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['space'],
			},
		},
		options: SPACE_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const spaceFields: INodeProperties[] = [
	// Space ID
	{
		displayName: 'Space ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The space unique identifier',
		displayOptions: {
			show: {
				resource: ['space'],
				operation: ['get', 'update', 'delete', 'getApiKeys'],
			},
		},
	},
	// Space name for create
	{
		displayName: 'Space Name',
		name: 'spaceName',
		type: 'string',
		required: true,
		default: '',
		description: 'The name for the new space',
		displayOptions: {
			show: {
				resource: ['space'],
				operation: ['create'],
			},
		},
	},
	// Settings JSON for update
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'json',
		default: '{}',
		description: 'Space configuration settings as JSON',
		displayOptions: {
			show: {
				resource: ['space'],
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
				resource: ['space'],
				operation: ['getAll'],
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
				resource: ['space'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Additional fields for create
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['space'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Clone From Space ID',
				name: 'cloneFromSpaceId',
				type: 'string',
				default: '',
				description: 'Clone settings from an existing space',
			},
		],
	},
];

export async function executeSpaceOperation(
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

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/spaces', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const spaceId = this.getNodeParameter('spaceId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/spaces/${spaceId}`);
			break;
		}

		case 'create': {
			const spaceName = this.getNodeParameter('spaceName', index) as string;
			const settings = this.getNodeParameter('settings', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				name: spaceName,
			};

			if (settings && settings !== '{}') {
				body.settings = JSON.parse(settings);
			}

			if (additionalFields.cloneFromSpaceId) {
				body.cloneFromSpaceId = additionalFields.cloneFromSpaceId;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/spaces', body);
			break;
		}

		case 'update': {
			const spaceId = this.getNodeParameter('spaceId', index) as string;
			const settings = this.getNodeParameter('settings', index) as string;

			const body: IDataObject = {};
			if (settings && settings !== '{}') {
				body.settings = JSON.parse(settings);
			}

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/spaces/${spaceId}`, body);
			break;
		}

		case 'delete': {
			const spaceId = this.getNodeParameter('spaceId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/spaces/${spaceId}`);
			break;
		}

		case 'getApiKeys': {
			const spaceId = this.getNodeParameter('spaceId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/spaces/${spaceId}/keys`);
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

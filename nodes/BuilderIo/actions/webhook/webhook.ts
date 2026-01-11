/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { WEBHOOK_OPERATIONS, WEBHOOK_EVENTS } from '../../constants';
import { builderIoAdminApiRequest } from '../../transport';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: WEBHOOK_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const webhookFields: INodeProperties[] = [
	// Webhook ID
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		description: 'The webhook unique identifier',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test'],
			},
		},
	},
	// Webhook URL for create
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'The endpoint URL to receive webhook events',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
	},
	// Events
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		default: [],
		options: WEBHOOK_EVENTS.map((event) => ({
			name: event,
			value: event,
		})),
		description: 'Events that will trigger the webhook',
		displayOptions: {
			show: {
				resource: ['webhook'],
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
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Additional fields for create/update
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Limit webhook to a specific model',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret for webhook signature verification',
			},
		],
	},
];

export async function executeWebhookOperation(
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

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/webhooks', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/webhooks/${webhookId}`);
			break;
		}

		case 'create': {
			const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
			const events = this.getNodeParameter('events', index) as string[];
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				url: webhookUrl,
				events,
				enabled: additionalFields.enabled !== false,
			};

			if (additionalFields.modelId) {
				body.modelId = additionalFields.modelId;
			}
			if (additionalFields.secret) {
				body.secret = additionalFields.secret;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/webhooks', body);
			break;
		}

		case 'update': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
			const events = this.getNodeParameter('events', index) as string[];
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				url: webhookUrl,
				events,
			};

			if (additionalFields.enabled !== undefined) {
				body.enabled = additionalFields.enabled;
			}
			if (additionalFields.modelId) {
				body.modelId = additionalFields.modelId;
			}
			if (additionalFields.secret) {
				body.secret = additionalFields.secret;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/webhooks/${webhookId}`, body);
			break;
		}

		case 'delete': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
			break;
		}

		case 'test': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'POST', `/webhooks/${webhookId}/test`);
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

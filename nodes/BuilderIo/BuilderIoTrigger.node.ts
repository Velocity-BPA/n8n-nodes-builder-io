/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { createHmac } from 'crypto';

import { BUILDER_IO_LICENSE_WARNING, WEBHOOK_EVENTS } from './constants';
import { builderIoAdminApiRequest } from './transport';

// Emit licensing notice once per node load
let licenseNoticeEmitted = false;

export class BuilderIoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Builder.io Trigger',
		name: 'builderIoTrigger',
		icon: 'file:builderIo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Builder.io events occur',
		defaults: {
			name: 'Builder.io Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'builderIoApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: WEBHOOK_EVENTS.map((event) => ({
					name: event,
					value: event,
					description: `Triggered when ${event.replace('.', ' is ')}`,
				})),
				description: 'The events to listen to',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Model ID',
						name: 'modelId',
						type: 'string',
						default: '',
						description: 'Limit webhook to a specific model ID',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Secret for webhook signature verification',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				// Check if we have a stored webhook ID
				if (webhookData.webhookId) {
					try {
						await builderIoAdminApiRequest.call(
							this,
							'GET',
							`/webhooks/${webhookData.webhookId}`,
						);
						return true;
					} catch {
						// Webhook doesn't exist anymore
						delete webhookData.webhookId;
						return false;
					}
				}

				// Check if a webhook with this URL already exists
				try {
					const webhooks = await builderIoAdminApiRequest.call(
						this,
						'GET',
						'/webhooks',
					) as IDataObject[];

					for (const webhook of webhooks) {
						if (webhook.url === webhookUrl) {
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch {
					// API call failed, assume webhook doesn't exist
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const options = this.getNodeParameter('options') as IDataObject;
				const webhookData = this.getWorkflowStaticData('node');

				const body: IDataObject = {
					url: webhookUrl,
					events,
					enabled: true,
				};

				if (options.modelId) {
					body.modelId = options.modelId;
				}
				if (options.webhookSecret) {
					body.secret = options.webhookSecret;
				}

				try {
					const response = await builderIoAdminApiRequest.call(
						this,
						'POST',
						'/webhooks',
						body,
					);

					webhookData.webhookId = (response as IDataObject).id;
					return true;
				} catch (error) {
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await builderIoAdminApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch {
						// Ignore errors during deletion
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Emit licensing notice once per node load
		if (!licenseNoticeEmitted) {
			this.logger.warn(BUILDER_IO_LICENSE_WARNING);
			licenseNoticeEmitted = true;
		}

		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options') as IDataObject;

		// Verify webhook signature if secret is configured
		if (options.webhookSecret) {
			const signature = req.headers['x-builder-signature'] as string;

			if (signature) {
				const expectedSignature = createHmac('sha256', options.webhookSecret as string)
					.update(JSON.stringify(body))
					.digest('hex');

				if (signature !== expectedSignature) {
					return {
						webhookResponse: 'Invalid signature',
					};
				}
			}
		}

		// Return the webhook payload
		return {
			workflowData: [
				this.helpers.returnJsonArray([
					{
						operation: body.operation,
						modelName: body.modelName,
						modelId: body.modelId,
						newValue: body.newValue,
						previousValue: body.previousValue,
						timestamp: new Date().toISOString(),
					},
				]),
			],
		};
	}
}

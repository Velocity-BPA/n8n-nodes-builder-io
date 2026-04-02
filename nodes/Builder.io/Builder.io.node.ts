/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-builderio/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Builderio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Builder.io',
    name: 'builderio',
    icon: 'file:builderio.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Builder.io API',
    defaults: {
      name: 'Builder.io',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'builderioApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Content',
            value: 'content',
          },
          {
            name: 'Models',
            value: 'models',
          },
          {
            name: 'Assets',
            value: 'assets',
          },
          {
            name: 'Webhooks',
            value: 'webhooks',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'content',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['content'] } },
  options: [
    { name: 'Get All', value: 'getAll', description: 'Get all content entries for a model', action: 'Get all content entries' },
    { name: 'Get', value: 'get', description: 'Get a specific content entry by ID', action: 'Get a content entry' },
    { name: 'Create', value: 'create', description: 'Create a new content entry', action: 'Create a content entry' },
    { name: 'Update', value: 'update', description: 'Update an existing content entry', action: 'Update a content entry' },
    { name: 'Delete', value: 'delete', description: 'Delete a content entry', action: 'Delete a content entry' },
    { name: 'Publish', value: 'publish', description: 'Publish content entry', action: 'Publish a content entry' }
  ],
  default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['models'] } },
	options: [
		{ name: 'Get All', value: 'getAll', description: 'Get all data models', action: 'Get all models' },
		{ name: 'Get', value: 'get', description: 'Get a specific data model', action: 'Get a model' },
		{ name: 'Create', value: 'create', description: 'Create a new data model', action: 'Create a model' },
		{ name: 'Update', value: 'update', description: 'Update an existing data model', action: 'Update a model' },
		{ name: 'Delete', value: 'delete', description: 'Delete a data model', action: 'Delete a model' },
	],
	default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['assets'],
		},
	},
	options: [
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Get all uploaded assets',
			action: 'Get all assets',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Upload a new asset file',
			action: 'Upload asset',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete an asset',
			action: 'Delete asset',
		},
	],
	default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhooks'],
		},
	},
	options: [
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Get all configured webhooks',
			action: 'Get all webhooks',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new webhook',
			action: 'Create a webhook',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific webhook',
			action: 'Get a webhook',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a webhook configuration',
			action: 'Update a webhook',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a webhook',
			action: 'Delete a webhook',
		},
	],
	default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['analytics'] } },
  options: [
    { name: 'Get Content Analytics', value: 'getContentAnalytics', description: 'Get content performance analytics', action: 'Get content analytics' },
    { name: 'Get Events', value: 'getEvents', description: 'Get event tracking data', action: 'Get events' },
  ],
  default: 'getContentAnalytics',
},
{
  displayName: 'Model',
  name: 'model',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['content'] } },
  default: '',
  placeholder: 'page',
  description: 'The name of the model to work with',
},
{
  displayName: 'Content ID',
  name: 'contentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['content'], operation: ['get', 'update', 'delete'] } },
  default: '',
  description: 'The ID of the content entry',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['content'], operation: ['getAll'] } },
  default: 100,
  description: 'Maximum number of entries to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['content'], operation: ['getAll'] } },
  default: 0,
  description: 'Number of entries to skip',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  displayOptions: { show: { resource: ['content'], operation: ['getAll'] } },
  default: '',
  description: 'MongoDB-style query to filter results',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['content'], operation: ['create', 'update'] } },
  default: '{}',
  description: 'The content data as JSON object',
},
{
  displayName: 'Content ID to Publish',
  name: 'publishId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['content'], operation: ['publish'] } },
  default: '',
  description: 'The ID of the content entry to publish',
},
{
	displayName: 'Model ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['models'],
			operation: ['get', 'update', 'delete'],
		},
	},
	default: '',
	description: 'The ID of the data model',
},
{
	displayName: 'Model Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['models'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'The name of the data model',
},
{
	displayName: 'Fields',
	name: 'fields',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	displayOptions: {
		show: {
			resource: ['models'],
			operation: ['create', 'update'],
		},
	},
	default: {},
	options: [
		{
			name: 'field',
			displayName: 'Field',
			values: [
				{
					displayName: 'Field Name',
					name: 'name',
					type: 'string',
					default: '',
					description: 'Name of the field',
				},
				{
					displayName: 'Field Type',
					name: 'type',
					type: 'options',
					options: [
						{ name: 'String', value: 'string' },
						{ name: 'Number', value: 'number' },
						{ name: 'Boolean', value: 'boolean' },
						{ name: 'Date', value: 'date' },
						{ name: 'Reference', value: 'reference' },
						{ name: 'List', value: 'list' },
						{ name: 'Object', value: 'object' },
					],
					default: 'string',
					description: 'Type of the field',
				},
				{
					displayName: 'Required',
					name: 'required',
					type: 'boolean',
					default: false,
					description: 'Whether the field is required',
				},
			],
		},
	],
	description: 'Fields for the data model',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['assets'],
			operation: ['getAll'],
		},
	},
	default: 100,
	description: 'Maximum number of assets to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['assets'],
			operation: ['getAll'],
		},
	},
	default: 0,
	description: 'Number of assets to skip',
},
{
	displayName: 'File',
	name: 'file',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['assets'],
			operation: ['create'],
		},
	},
	required: true,
	default: '',
	description: 'File to upload (binary data or URL)',
},
{
	displayName: 'Asset ID',
	name: 'assetId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['assets'],
			operation: ['delete'],
		},
	},
	required: true,
	default: '',
	description: 'ID of the asset to delete',
},
{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhooks'],
			operation: ['get', 'update', 'delete'],
		},
	},
	default: '',
	description: 'The ID of the webhook',
},
{
	displayName: 'URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhooks'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'The URL to send webhook notifications to',
},
{
	displayName: 'Events',
	name: 'events',
	type: 'multiOptions',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhooks'],
			operation: ['create', 'update'],
		},
	},
	options: [
		{
			name: 'Content Created',
			value: 'content.created',
		},
		{
			name: 'Content Updated',
			value: 'content.updated',
		},
		{
			name: 'Content Deleted',
			value: 'content.deleted',
		},
		{
			name: 'Content Published',
			value: 'content.published',
		},
		{
			name: 'Content Unpublished',
			value: 'content.unpublished',
		},
	],
	default: ['content.updated'],
	description: 'Events that should trigger the webhook',
},
{
  displayName: 'Model',
  name: 'model',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getContentAnalytics'] } },
  default: '',
  placeholder: 'page',
  description: 'Model name to get analytics for',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getContentAnalytics', 'getEvents'] } },
  default: '',
  description: 'Start date for analytics period',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getContentAnalytics', 'getEvents'] } },
  default: '',
  description: 'End date for analytics period',
},
{
  displayName: 'Event',
  name: 'event',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getEvents'] } },
  default: '',
  placeholder: 'click',
  description: 'Event name to get tracking data for',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'content':
        return [await executeContentOperations.call(this, items)];
      case 'models':
        return [await executeModelsOperations.call(this, items)];
      case 'assets':
        return [await executeAssetsOperations.call(this, items)];
      case 'webhooks':
        return [await executeWebhooksOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeContentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const model = this.getNodeParameter('model', i) as string;

      switch (operation) {
        case 'getAll': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const query = this.getNodeParameter('query', i, '') as string;

          let url = `https://cdn.builder.io/api/v1/content/${model}?apiKey=${credentials.apiKey}&limit=${limit}&offset=${offset}`;
          if (query) {
            url += `&query=${encodeURIComponent(query)}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const contentId = this.getNodeParameter('contentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://cdn.builder.io/api/v1/content/${model}/${contentId}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'create': {
          const data = this.getNodeParameter('data', i) as object;

          const options: any = {
            method: 'POST',
            url: `https://cdn.builder.io/api/v1/content/${model}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const contentId = this.getNodeParameter('contentId', i) as string;
          const data = this.getNodeParameter('data', i) as object;

          const options: any = {
            method: 'PATCH',
            url: `https://cdn.builder.io/api/v1/content/${model}/${contentId}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const contentId = this.getNodeParameter('contentId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `https://cdn.builder.io/api/v1/content/${model}/${contentId}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'publish': {
          const publishId = this.getNodeParameter('publishId', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://cdn.builder.io/api/v1/content/${model}/publish?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: { id: publishId },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeModelsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('builderioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAll': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/models`,
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'get': {
					const id = this.getNodeParameter('id', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/models/${id}`,
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'create': {
					const name = this.getNodeParameter('name', i) as string;
					const fieldsData = this.getNodeParameter('fields', i) as any;
					
					const fields: any[] = [];
					if (fieldsData.field) {
						for (const field of fieldsData.field) {
							fields.push({
								name: field.name,
								type: field.type,
								required: field.required,
							});
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/models`,
						qs: {
							apiKey: credentials.apiKey,
						},
						body: {
							name,
							fields,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'update': {
					const id = this.getNodeParameter('id', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const fieldsData = this.getNodeParameter('fields', i) as any;
					
					const fields: any[] = [];
					if (fieldsData.field) {
						for (const field of fieldsData.field) {
							fields.push({
								name: field.name,
								type: field.type,
								required: field.required,
							});
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/models/${id}`,
						qs: {
							apiKey: credentials.apiKey,
						},
						body: {
							name,
							fields,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'delete': {
					const id = this.getNodeParameter('id', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/models/${id}`,
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAssetsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('builderioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAll': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/assets`,
						qs: {
							apiKey: credentials.apiKey,
							limit,
							offset,
						},
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'create': {
					const file = this.getNodeParameter('file', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/upload`,
						qs: {
							apiKey: credentials.apiKey,
						},
						body: {
							file,
						},
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'delete': {
					const assetId = this.getNodeParameter('assetId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/assets/${assetId}`,
						qs: {
							apiKey: credentials.apiKey,
						},
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWebhooksOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('builderioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAll': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'create': {
					const url = this.getNodeParameter('url', i) as string;
					const events = this.getNodeParameter('events', i) as string[];

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							url,
							events,
						},
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'get': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'update': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const events = this.getNodeParameter('events', i) as string[];

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							url,
							events,
						},
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'delete': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							apiKey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getContentAnalytics': {
          const model = this.getNodeParameter('model', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const queryParams = new URLSearchParams({
            apiKey: credentials.apiKey,
            model,
            startDate,
            endDate,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/content?${queryParams.toString()}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEvents': {
          const event = this.getNodeParameter('event', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const queryParams = new URLSearchParams({
            apiKey: credentials.apiKey,
            event,
            startDate,
            endDate,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/events?${queryParams.toString()}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

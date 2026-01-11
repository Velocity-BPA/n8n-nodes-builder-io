/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { TARGETING_OPERATIONS, TARGETING_TYPE_OPTIONS } from '../../constants';
import { builderIoAdminApiRequest, builderIoContentApiRequest } from '../../transport';
import { parseUserAttributes } from '../../utils';

export const targetingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['targeting'],
			},
		},
		options: TARGETING_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAttributes',
	},
];

export const targetingFields: INodeProperties[] = [
	// Attribute Name
	{
		displayName: 'Attribute Name',
		name: 'attributeName',
		type: 'string',
		required: true,
		default: '',
		description: 'The targeting attribute name',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['createAttribute', 'updateAttribute', 'deleteAttribute'],
			},
		},
	},
	// Attribute Type
	{
		displayName: 'Attribute Type',
		name: 'attributeType',
		type: 'options',
		required: true,
		default: 'string',
		options: TARGETING_TYPE_OPTIONS.map((opt) => ({
			name: opt.name,
			value: opt.value,
		})),
		description: 'The data type of the attribute',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['createAttribute', 'updateAttribute'],
			},
		},
	},
	// Model name for evaluate
	{
		displayName: 'Model Name',
		name: 'model',
		type: 'string',
		required: true,
		default: 'page',
		description: 'The model name to evaluate targeting for',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['evaluate'],
			},
		},
	},
	// URL for evaluate
	{
		displayName: 'URL Path',
		name: 'urlPath',
		type: 'string',
		required: true,
		default: '/',
		description: 'The URL path to evaluate targeting for',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['evaluate'],
			},
		},
	},
	// User Attributes for evaluate
	{
		displayName: 'User Attributes',
		name: 'userAttributes',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Attribute',
		description: 'User attributes for targeting evaluation',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['evaluate'],
			},
		},
		options: [
			{
				name: 'attributeValues',
				displayName: 'Attribute',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Attribute name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Attribute value',
					},
				],
			},
		],
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
				resource: ['targeting'],
				operation: ['createAttribute', 'updateAttribute'],
			},
		},
		options: [
			{
				displayName: 'Enum Values',
				name: 'enum',
				type: 'string',
				default: '',
				placeholder: 'value1, value2, value3',
				description: 'Comma-separated list of allowed values (for string type)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the attribute',
			},
		],
	},
];

export async function executeTargetingOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getAttributes': {
			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/targeting-attributes') as IDataObject[];
			break;
		}

		case 'createAttribute': {
			const attributeName = this.getNodeParameter('attributeName', index) as string;
			const attributeType = this.getNodeParameter('attributeType', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				name: attributeName,
				type: attributeType,
			};

			if (additionalFields.enum) {
				body.enum = (additionalFields.enum as string).split(',').map((v) => v.trim());
			}
			if (additionalFields.description) {
				body.description = additionalFields.description;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/targeting-attributes', body);
			break;
		}

		case 'updateAttribute': {
			const attributeName = this.getNodeParameter('attributeName', index) as string;
			const attributeType = this.getNodeParameter('attributeType', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				type: attributeType,
			};

			if (additionalFields.enum) {
				body.enum = (additionalFields.enum as string).split(',').map((v) => v.trim());
			}
			if (additionalFields.description) {
				body.description = additionalFields.description;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/targeting-attributes/${attributeName}`, body);
			break;
		}

		case 'deleteAttribute': {
			const attributeName = this.getNodeParameter('attributeName', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/targeting-attributes/${attributeName}`);
			break;
		}

		case 'evaluate': {
			const model = this.getNodeParameter('model', index) as string;
			const urlPath = this.getNodeParameter('urlPath', index) as string;
			const userAttributesData = this.getNodeParameter('userAttributes', index) as IDataObject;

			// Parse user attributes from the collection
			const attributeValues = (userAttributesData.attributeValues as IDataObject[]) || [];
			const userAttributes: IDataObject = {};

			for (const attr of attributeValues) {
				userAttributes[attr.name as string] = attr.value;
			}

			const query: IDataObject = {
				url: urlPath,
				userAttributes: JSON.stringify(parseUserAttributes(userAttributes)),
			};

			const response = await builderIoContentApiRequest.call(this, 'GET', `/content/${model}`, query) as IDataObject;
			responseData = {
				url: urlPath,
				model,
				userAttributes,
				matchedContent: response.results || [],
				totalMatches: (response.results as IDataObject[])?.length || 0,
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

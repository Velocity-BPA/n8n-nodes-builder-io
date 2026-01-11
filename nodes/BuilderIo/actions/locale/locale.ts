/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { LOCALE_OPERATIONS } from '../../constants';
import { builderIoAdminApiRequest } from '../../transport';

export const localeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['locale'],
			},
		},
		options: LOCALE_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const localeFields: INodeProperties[] = [
	// Locale Code
	{
		displayName: 'Locale Code',
		name: 'localeCode',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'en-US',
		description: 'The locale code (e.g., "en-US", "fr-FR")',
		displayOptions: {
			show: {
				resource: ['locale'],
				operation: ['get', 'create', 'update', 'delete', 'setDefault'],
			},
		},
	},
	// Locale Name for create
	{
		displayName: 'Locale Name',
		name: 'localeName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'English (US)',
		description: 'The display name for the locale',
		displayOptions: {
			show: {
				resource: ['locale'],
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
				resource: ['locale'],
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
				resource: ['locale'],
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
				resource: ['locale'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Display Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the locale (for update)',
			},
			{
				displayName: 'Is Default',
				name: 'isDefault',
				type: 'boolean',
				default: false,
				description: 'Whether this should be the default locale',
			},
		],
	},
];

export async function executeLocaleOperation(
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

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/locales', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const localeCode = this.getNodeParameter('localeCode', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/locales/${localeCode}`);
			break;
		}

		case 'create': {
			const localeCode = this.getNodeParameter('localeCode', index) as string;
			const localeName = this.getNodeParameter('localeName', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				code: localeCode,
				name: localeName,
			};

			if (additionalFields.isDefault !== undefined) {
				body.isDefault = additionalFields.isDefault;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/locales', body);
			break;
		}

		case 'update': {
			const localeCode = this.getNodeParameter('localeCode', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {};

			if (additionalFields.name) {
				body.name = additionalFields.name;
			}
			if (additionalFields.isDefault !== undefined) {
				body.isDefault = additionalFields.isDefault;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/locales/${localeCode}`, body);
			break;
		}

		case 'delete': {
			const localeCode = this.getNodeParameter('localeCode', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/locales/${localeCode}`);
			break;
		}

		case 'setDefault': {
			const localeCode = this.getNodeParameter('localeCode', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/locales/${localeCode}`, {
				isDefault: true,
			});
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

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { USER_OPERATIONS, USER_ROLE_OPTIONS } from '../../constants';
import { builderIoAdminApiRequest } from '../../transport';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: USER_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getCurrent',
	},
];

export const userFields: INodeProperties[] = [
	// User ID
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'The user unique identifier',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'updateRole', 'remove'],
			},
		},
	},
	// Email for invite
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		description: 'The email address of the user to invite',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['invite'],
			},
		},
	},
	// Role
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		required: true,
		default: 'editor',
		options: USER_ROLE_OPTIONS.map((opt) => ({
			name: opt.name,
			value: opt.value,
		})),
		description: 'The role to assign to the user',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['invite', 'updateRole'],
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
				resource: ['user'],
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
				resource: ['user'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Additional fields for invite
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['invite'],
			},
		},
		options: [
			{
				displayName: 'Organization ID',
				name: 'organizationId',
				type: 'string',
				default: '',
				description: 'The organization to invite the user to',
			},
			{
				displayName: 'Space ID',
				name: 'spaceId',
				type: 'string',
				default: '',
				description: 'Specific space to grant access to',
			},
		],
	},
];

export async function executeUserOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCurrent': {
			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/user');
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const query: IDataObject = {};

			if (!returnAll) {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/users', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const userId = this.getNodeParameter('userId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/users/${userId}`);
			break;
		}

		case 'invite': {
			const email = this.getNodeParameter('email', index) as string;
			const role = this.getNodeParameter('role', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				email,
				role,
				...additionalFields,
			};

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/users/invite', body);
			break;
		}

		case 'updateRole': {
			const userId = this.getNodeParameter('userId', index) as string;
			const role = this.getNodeParameter('role', index) as string;

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/users/${userId}`, {
				role,
			});
			break;
		}

		case 'remove': {
			const userId = this.getNodeParameter('userId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/users/${userId}`);
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

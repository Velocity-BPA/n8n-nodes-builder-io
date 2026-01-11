/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ASSET_OPERATIONS } from '../../constants';
import { builderIoAdminApiRequest, builderIoUploadAsset } from '../../transport';
import { getMimeType } from '../../utils';

export const assetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asset'],
			},
		},
		options: ASSET_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getAll',
	},
];

export const assetFields: INodeProperties[] = [
	// Binary property for upload
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		description: 'Name of the binary property containing the file to upload',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload'],
			},
		},
	},
	// Asset ID
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		required: true,
		default: '',
		description: 'The asset unique identifier',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['get', 'delete', 'move'],
			},
		},
	},
	// Asset URL for getByUrl
	{
		displayName: 'Asset URL',
		name: 'assetUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'The asset URL to look up',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['getByUrl'],
			},
		},
	},
	// Folder name for createFolder
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the folder to create',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createFolder'],
			},
		},
	},
	// Target folder for move
	{
		displayName: 'Target Folder',
		name: 'targetFolder',
		type: 'string',
		required: true,
		default: '',
		description: 'The folder path to move the asset to',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['move'],
			},
		},
	},
	// Return All toggle for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['asset'],
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
				resource: ['asset'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Options for upload
	{
		displayName: 'Options',
		name: 'uploadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Custom Filename',
				name: 'filename',
				type: 'string',
				default: '',
				description: 'Custom filename for the uploaded asset',
			},
			{
				displayName: 'Folder',
				name: 'folder',
				type: 'string',
				default: '',
				description: 'Folder path to upload the asset to',
			},
		],
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
				resource: ['asset'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Folder',
				name: 'folder',
				type: 'string',
				default: '',
				description: 'Filter assets by folder path',
			},
		],
	},
	// Parent folder for createFolder
	{
		displayName: 'Parent Folder',
		name: 'parentFolder',
		type: 'string',
		default: '',
		description: 'Parent folder path (optional)',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['createFolder'],
			},
		},
	},
];

export async function executeAssetOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'upload': {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
			const uploadOptions = this.getNodeParameter('uploadOptions', index) as IDataObject;

			const items = this.getInputData();
			const binaryData = items[index].binary;

			if (!binaryData || !binaryData[binaryPropertyName]) {
				throw new Error(`No binary data found in property "${binaryPropertyName}"`);
			}

			const binaryItem = binaryData[binaryPropertyName];
			const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
			const filename = (uploadOptions.filename as string) || binaryItem.fileName || 'upload';
			const mimeType = binaryItem.mimeType || getMimeType(filename);

			responseData = await builderIoUploadAsset.call(this, buffer, filename, mimeType);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const options = this.getNodeParameter('options', index) as IDataObject;

			const query: IDataObject = {};
			if (options.folder) {
				query.folder = options.folder;
			}

			if (!returnAll) {
				const limit = this.getNodeParameter('limit', index) as number;
				query.limit = limit;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/assets', undefined, query) as IDataObject[];
			break;
		}

		case 'get': {
			const assetId = this.getNodeParameter('assetId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', `/assets/${assetId}`);
			break;
		}

		case 'delete': {
			const assetId = this.getNodeParameter('assetId', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'DELETE', `/assets/${assetId}`);
			break;
		}

		case 'getByUrl': {
			const assetUrl = this.getNodeParameter('assetUrl', index) as string;
			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/assets', undefined, { url: assetUrl });
			break;
		}

		case 'createFolder': {
			const folderName = this.getNodeParameter('folderName', index) as string;
			const parentFolder = this.getNodeParameter('parentFolder', index) as string;

			const body: IDataObject = {
				name: folderName,
				type: 'folder',
			};

			if (parentFolder) {
				body.parent = parentFolder;
			}

			responseData = await builderIoAdminApiRequest.call(this, 'POST', '/assets', body);
			break;
		}

		case 'move': {
			const assetId = this.getNodeParameter('assetId', index) as string;
			const targetFolder = this.getNodeParameter('targetFolder', index) as string;

			responseData = await builderIoAdminApiRequest.call(this, 'PATCH', `/assets/${assetId}`, {
				folder: targetFolder,
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

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { BUILDER_IO_LICENSE_WARNING, RESOURCES } from './constants';
import {
	contentOperations,
	contentFields,
	executeContentOperation,
	modelOperations,
	modelFields,
	executeModelOperation,
	assetOperations,
	assetFields,
	executeAssetOperation,
	symbolOperations,
	symbolFields,
	executeSymbolOperation,
	userOperations,
	userFields,
	executeUserOperation,
	spaceOperations,
	spaceFields,
	executeSpaceOperation,
	targetingOperations,
	targetingFields,
	executeTargetingOperation,
	webhookOperations,
	webhookFields,
	executeWebhookOperation,
	localeOperations,
	localeFields,
	executeLocaleOperation,
	analyticsOperations,
	analyticsFields,
	executeAnalyticsOperation,
} from './actions';

// Emit licensing notice once per node load
let licenseNoticeEmitted = false;

export class BuilderIo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Builder.io',
		name: 'builderIo',
		icon: 'file:builderIo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with Builder.io visual CMS and headless content platform',
		defaults: {
			name: 'Builder.io',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'builderIoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: RESOURCES.map((r) => ({
					name: r.name,
					value: r.value,
				})),
				default: 'content',
			},
			// Content operations and fields
			...contentOperations,
			...contentFields,
			// Model operations and fields
			...modelOperations,
			...modelFields,
			// Asset operations and fields
			...assetOperations,
			...assetFields,
			// Symbol operations and fields
			...symbolOperations,
			...symbolFields,
			// User operations and fields
			...userOperations,
			...userFields,
			// Space operations and fields
			...spaceOperations,
			...spaceFields,
			// Targeting operations and fields
			...targetingOperations,
			...targetingFields,
			// Webhook operations and fields
			...webhookOperations,
			...webhookFields,
			// Locale operations and fields
			...localeOperations,
			...localeFields,
			// Analytics operations and fields
			...analyticsOperations,
			...analyticsFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per node load
		if (!licenseNoticeEmitted) {
			this.logger.warn(BUILDER_IO_LICENSE_WARNING);
			licenseNoticeEmitted = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let executionData: INodeExecutionData[];

				switch (resource) {
					case 'content':
						executionData = await executeContentOperation.call(this, i);
						break;
					case 'model':
						executionData = await executeModelOperation.call(this, i);
						break;
					case 'asset':
						executionData = await executeAssetOperation.call(this, i);
						break;
					case 'symbol':
						executionData = await executeSymbolOperation.call(this, i);
						break;
					case 'user':
						executionData = await executeUserOperation.call(this, i);
						break;
					case 'space':
						executionData = await executeSpaceOperation.call(this, i);
						break;
					case 'targeting':
						executionData = await executeTargetingOperation.call(this, i);
						break;
					case 'webhook':
						executionData = await executeWebhookOperation.call(this, i);
						break;
					case 'locale':
						executionData = await executeLocaleOperation.call(this, i);
						break;
					case 'analytics':
						executionData = await executeAnalyticsOperation.call(this, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

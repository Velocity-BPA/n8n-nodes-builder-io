/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { ANALYTICS_OPERATIONS, GRANULARITY_OPTIONS } from '../../constants';
import { builderIoAdminApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export const analyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: ANALYTICS_OPERATIONS.map((op) => ({
			name: op.name,
			value: op.value,
			description: op.description,
			action: op.action,
		})),
		default: 'getImpressions',
	},
];

export const analyticsFields: INodeProperties[] = [
	// Content ID
	{
		displayName: 'Content ID',
		name: 'contentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The content entry ID to get analytics for',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getImpressions', 'getConversions', 'getABTestResults', 'getContentInsights'],
			},
		},
	},
	// Date Range
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		description: 'Start date for analytics data (ISO 8601)',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getImpressions', 'getConversions', 'getABTestResults', 'getContentInsights'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		description: 'End date for analytics data (ISO 8601)',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getImpressions', 'getConversions', 'getABTestResults', 'getContentInsights'],
			},
		},
	},
	// Granularity
	{
		displayName: 'Granularity',
		name: 'granularity',
		type: 'options',
		default: 'day',
		options: GRANULARITY_OPTIONS.map((opt) => ({
			name: opt.name,
			value: opt.value,
		})),
		description: 'Data granularity for analytics',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getImpressions', 'getConversions', 'getABTestResults'],
			},
		},
	},
	// Additional options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getImpressions', 'getConversions', 'getABTestResults', 'getContentInsights'],
			},
		},
		options: [
			{
				displayName: 'Include Variations',
				name: 'includeVariations',
				type: 'boolean',
				default: false,
				description: 'Whether to include analytics for content variations',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: '',
				description: 'Filter analytics by locale',
			},
		],
	},
];

export async function executeAnalyticsOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const contentId = this.getNodeParameter('contentId', index) as string;
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	let responseData: IDataObject | IDataObject[];

	const query: IDataObject = {
		contentId,
	};

	if (startDate) {
		query.startDate = formatDate(startDate);
	}
	if (endDate) {
		query.endDate = formatDate(endDate);
	}
	if (options.includeVariations) {
		query.includeVariations = true;
	}
	if (options.locale) {
		query.locale = options.locale;
	}

	switch (operation) {
		case 'getImpressions': {
			const granularity = this.getNodeParameter('granularity', index) as string;
			query.granularity = granularity;

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/analytics/impressions', undefined, query);
			break;
		}

		case 'getConversions': {
			const granularity = this.getNodeParameter('granularity', index) as string;
			query.granularity = granularity;

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/analytics/conversions', undefined, query);
			break;
		}

		case 'getABTestResults': {
			const granularity = this.getNodeParameter('granularity', index) as string;
			query.granularity = granularity;

			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/analytics/ab-tests', undefined, query);
			break;
		}

		case 'getContentInsights': {
			responseData = await builderIoAdminApiRequest.call(this, 'GET', '/analytics/insights', undefined, query);
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

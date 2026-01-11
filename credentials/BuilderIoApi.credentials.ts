/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BuilderIoApi implements ICredentialType {
	name = 'builderIoApi';
	displayName = 'Builder.io API';
	documentationUrl = 'https://www.builder.io/c/docs/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'Public API Key',
			name: 'publicApiKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Public API key for reading content. Find it in Account Settings.',
		},
		{
			displayName: 'Private API Key',
			name: 'privateApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private API key for write operations. Generate in Account Settings under Private keys.',
		},
		{
			displayName: 'Space ID',
			name: 'spaceId',
			type: 'string',
			default: '',
			description: 'Space ID for multi-space organizations. Leave blank for single-space accounts.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.privateApiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://cdn.builder.io/api/v2',
			url: '/content',
			qs: {
				apiKey: '={{$credentials.publicApiKey}}',
				limit: 1,
			},
		},
	};
}

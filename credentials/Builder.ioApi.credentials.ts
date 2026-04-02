import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BuilderioApi implements ICredentialType {
	name = 'builderioApi';
	displayName = 'Builder.io API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key from your Builder.io account settings. Use private keys for write operations and public keys for read operations.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://cdn.builder.io/api/v1',
			description: 'The base URL for the Builder.io API',
		},
	];
}
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const BUILDER_IO_LICENSE_WARNING = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

export const RESOURCES = [
	{ name: 'Content', value: 'content' },
	{ name: 'Model', value: 'model' },
	{ name: 'Asset', value: 'asset' },
	{ name: 'Symbol', value: 'symbol' },
	{ name: 'User', value: 'user' },
	{ name: 'Space', value: 'space' },
	{ name: 'Targeting', value: 'targeting' },
	{ name: 'Webhook', value: 'webhook' },
	{ name: 'Locale', value: 'locale' },
	{ name: 'Analytics', value: 'analytics' },
] as const;

export const CONTENT_OPERATIONS = [
	{ name: 'Get', value: 'get', description: 'Get a single content entry by ID', action: 'Get a content entry' },
	{ name: 'Get All', value: 'getAll', description: 'Get all content entries for a model', action: 'Get all content entries' },
	{ name: 'Get by URL', value: 'getByUrl', description: 'Get content entry matching a URL', action: 'Get content by URL' },
	{ name: 'Query', value: 'query', description: 'Query content with filters and targeting', action: 'Query content' },
	{ name: 'Create', value: 'create', description: 'Create a new content entry', action: 'Create a content entry' },
	{ name: 'Update', value: 'update', description: 'Update an existing content entry', action: 'Update a content entry' },
	{ name: 'Patch', value: 'patch', description: 'Partially update a content entry', action: 'Patch a content entry' },
	{ name: 'Delete', value: 'delete', description: 'Delete a content entry', action: 'Delete a content entry' },
	{ name: 'Publish', value: 'publish', description: 'Publish a draft content entry', action: 'Publish a content entry' },
	{ name: 'Unpublish', value: 'unpublish', description: 'Unpublish a content entry', action: 'Unpublish a content entry' },
	{ name: 'Archive', value: 'archive', description: 'Archive a content entry', action: 'Archive a content entry' },
	{ name: 'Duplicate', value: 'duplicate', description: 'Duplicate a content entry', action: 'Duplicate a content entry' },
] as const;

export const MODEL_OPERATIONS = [
	{ name: 'Get All', value: 'getAll', description: 'List all models in the space', action: 'Get all models' },
	{ name: 'Get', value: 'get', description: 'Get a specific model by name or ID', action: 'Get a model' },
	{ name: 'Get Schema', value: 'getSchema', description: 'Get the field schema for a model', action: 'Get model schema' },
	{ name: 'Get Entries', value: 'getEntries', description: 'Get all entries for a specific model', action: 'Get model entries' },
	{ name: 'Count', value: 'count', description: 'Count entries in a model', action: 'Count model entries' },
] as const;

export const ASSET_OPERATIONS = [
	{ name: 'Upload', value: 'upload', description: 'Upload a new asset', action: 'Upload an asset' },
	{ name: 'Get All', value: 'getAll', description: 'List all assets', action: 'Get all assets' },
	{ name: 'Get', value: 'get', description: 'Get asset by ID', action: 'Get an asset' },
	{ name: 'Delete', value: 'delete', description: 'Delete an asset', action: 'Delete an asset' },
	{ name: 'Get by URL', value: 'getByUrl', description: 'Get asset metadata by URL', action: 'Get asset by URL' },
	{ name: 'Create Folder', value: 'createFolder', description: 'Create an asset folder', action: 'Create asset folder' },
	{ name: 'Move', value: 'move', description: 'Move asset to a folder', action: 'Move asset' },
] as const;

export const SYMBOL_OPERATIONS = [
	{ name: 'Get All', value: 'getAll', description: 'List all symbols', action: 'Get all symbols' },
	{ name: 'Get', value: 'get', description: 'Get a symbol by ID or name', action: 'Get a symbol' },
	{ name: 'Create', value: 'create', description: 'Create a new symbol', action: 'Create a symbol' },
	{ name: 'Update', value: 'update', description: 'Update a symbol', action: 'Update a symbol' },
	{ name: 'Delete', value: 'delete', description: 'Delete a symbol', action: 'Delete a symbol' },
	{ name: 'Get Instances', value: 'getInstances', description: 'Get all content entries using a symbol', action: 'Get symbol instances' },
] as const;

export const USER_OPERATIONS = [
	{ name: 'Get Current', value: 'getCurrent', description: 'Get current authenticated user', action: 'Get current user' },
	{ name: 'Get All', value: 'getAll', description: 'List all users in the organization', action: 'Get all users' },
	{ name: 'Get', value: 'get', description: 'Get user by ID', action: 'Get a user' },
	{ name: 'Invite', value: 'invite', description: 'Invite a new user', action: 'Invite a user' },
	{ name: 'Update Role', value: 'updateRole', description: 'Update user role', action: 'Update user role' },
	{ name: 'Remove', value: 'remove', description: 'Remove user from organization', action: 'Remove a user' },
] as const;

export const SPACE_OPERATIONS = [
	{ name: 'Get All', value: 'getAll', description: 'List all spaces in the organization', action: 'Get all spaces' },
	{ name: 'Get', value: 'get', description: 'Get space details', action: 'Get a space' },
	{ name: 'Create', value: 'create', description: 'Create a new space', action: 'Create a space' },
	{ name: 'Update', value: 'update', description: 'Update space settings', action: 'Update a space' },
	{ name: 'Delete', value: 'delete', description: 'Delete a space', action: 'Delete a space' },
	{ name: 'Get API Keys', value: 'getApiKeys', description: 'Get API keys for a space', action: 'Get space API keys' },
] as const;

export const TARGETING_OPERATIONS = [
	{ name: 'Get Attributes', value: 'getAttributes', description: 'Get custom targeting attributes', action: 'Get targeting attributes' },
	{ name: 'Create Attribute', value: 'createAttribute', description: 'Create a custom targeting attribute', action: 'Create targeting attribute' },
	{ name: 'Update Attribute', value: 'updateAttribute', description: 'Update a targeting attribute', action: 'Update targeting attribute' },
	{ name: 'Delete Attribute', value: 'deleteAttribute', description: 'Delete a targeting attribute', action: 'Delete targeting attribute' },
	{ name: 'Evaluate', value: 'evaluate', description: 'Evaluate targeting rules for content', action: 'Evaluate targeting' },
] as const;

export const WEBHOOK_OPERATIONS = [
	{ name: 'Get All', value: 'getAll', description: 'List all webhooks', action: 'Get all webhooks' },
	{ name: 'Get', value: 'get', description: 'Get webhook by ID', action: 'Get a webhook' },
	{ name: 'Create', value: 'create', description: 'Create a new webhook', action: 'Create a webhook' },
	{ name: 'Update', value: 'update', description: 'Update a webhook', action: 'Update a webhook' },
	{ name: 'Delete', value: 'delete', description: 'Delete a webhook', action: 'Delete a webhook' },
	{ name: 'Test', value: 'test', description: 'Send test webhook payload', action: 'Test webhook' },
] as const;

export const LOCALE_OPERATIONS = [
	{ name: 'Get All', value: 'getAll', description: 'List all configured locales', action: 'Get all locales' },
	{ name: 'Get', value: 'get', description: 'Get locale details', action: 'Get a locale' },
	{ name: 'Create', value: 'create', description: 'Create a new locale', action: 'Create a locale' },
	{ name: 'Update', value: 'update', description: 'Update locale settings', action: 'Update a locale' },
	{ name: 'Delete', value: 'delete', description: 'Delete a locale', action: 'Delete a locale' },
	{ name: 'Set Default', value: 'setDefault', description: 'Set default locale', action: 'Set default locale' },
] as const;

export const ANALYTICS_OPERATIONS = [
	{ name: 'Get Impressions', value: 'getImpressions', description: 'Get content impression data', action: 'Get impressions' },
	{ name: 'Get Conversions', value: 'getConversions', description: 'Get conversion tracking data', action: 'Get conversions' },
	{ name: 'Get A/B Test Results', value: 'getABTestResults', description: 'Get A/B test performance data', action: 'Get A/B test results' },
	{ name: 'Get Content Insights', value: 'getContentInsights', description: 'Get content entry insights', action: 'Get content insights' },
] as const;

export const WEBHOOK_EVENTS = [
	'content.published',
	'content.unpublished',
	'content.updated',
	'content.deleted',
	'content.archived',
	'asset.uploaded',
	'asset.deleted',
] as const;

export const PUBLISHED_STATUS_OPTIONS = [
	{ name: 'All', value: '' },
	{ name: 'Published', value: 'published' },
	{ name: 'Draft', value: 'draft' },
	{ name: 'Archived', value: 'archived' },
] as const;

export const USER_ROLE_OPTIONS = [
	{ name: 'Admin', value: 'admin' },
	{ name: 'Editor', value: 'editor' },
	{ name: 'Viewer', value: 'viewer' },
] as const;

export const TARGETING_TYPE_OPTIONS = [
	{ name: 'String', value: 'string' },
	{ name: 'Number', value: 'number' },
	{ name: 'Boolean', value: 'boolean' },
] as const;

export const GRANULARITY_OPTIONS = [
	{ name: 'Hour', value: 'hour' },
	{ name: 'Day', value: 'day' },
	{ name: 'Week', value: 'week' },
	{ name: 'Month', value: 'month' },
] as const;

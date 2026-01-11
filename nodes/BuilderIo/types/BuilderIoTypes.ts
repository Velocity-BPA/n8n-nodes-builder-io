/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IBuilderIoCredentials {
	publicApiKey: string;
	privateApiKey?: string;
	spaceId?: string;
}

export interface IBuilderIoContentEntry {
	id: string;
	name: string;
	modelId: string;
	published: 'published' | 'draft' | 'archived';
	createdDate: number;
	lastUpdated: number;
	createdBy: string;
	query: IBuilderIoQuery[];
	data: IDataObject;
	variations: IDataObject;
	meta: IDataObject;
}

export interface IBuilderIoQuery {
	property: string;
	operator: string;
	value: string | number | boolean;
}

export interface IBuilderIoContentResponse {
	results: IBuilderIoContentEntry[];
}

export interface IBuilderIoModel {
	id: string;
	name: string;
	kind: string;
	schema: IBuilderIoModelField[];
	publicReadable: boolean;
	strictPrivateWrite: boolean;
	hideFromUI: boolean;
}

export interface IBuilderIoModelField {
	name: string;
	type: string;
	required?: boolean;
	subFields?: IBuilderIoModelField[];
	enum?: string[];
}

export interface IBuilderIoAsset {
	id: string;
	name: string;
	url: string;
	mimeType: string;
	size: number;
	createdDate: number;
	folder?: string;
}

export interface IBuilderIoSymbol {
	id: string;
	name: string;
	modelId: string;
	data: IDataObject;
	published: string;
}

export interface IBuilderIoUser {
	id: string;
	email: string;
	role: string;
	organizationId: string;
	createdDate: number;
}

export interface IBuilderIoSpace {
	id: string;
	name: string;
	settings: IDataObject;
	createdDate: number;
}

export interface IBuilderIoTargetingAttribute {
	name: string;
	type: 'string' | 'number' | 'boolean';
	enum?: string[];
}

export interface IBuilderIoWebhook {
	id: string;
	url: string;
	events: string[];
	secret?: string;
	modelId?: string;
	enabled: boolean;
}

export interface IBuilderIoLocale {
	code: string;
	name: string;
	isDefault: boolean;
}

export interface IBuilderIoAnalytics {
	impressions: number;
	conversions: number;
	conversionRate: number;
}

export interface IBuilderIoError {
	error: {
		message: string;
		code: string;
		status: number;
	};
}

export interface IBuilderIoValidationError {
	errors: Array<{
		field: string;
		message: string;
	}>;
}

export interface IBuilderIoWebhookPayload {
	operation: string;
	modelName: string;
	modelId: string;
	newValue?: IBuilderIoContentEntry;
	previousValue?: IBuilderIoContentEntry;
}

export type ResourceType =
	| 'content'
	| 'model'
	| 'asset'
	| 'symbol'
	| 'user'
	| 'space'
	| 'targeting'
	| 'webhook'
	| 'locale'
	| 'analytics';

export type ContentOperation =
	| 'get'
	| 'getAll'
	| 'getByUrl'
	| 'query'
	| 'create'
	| 'update'
	| 'patch'
	| 'delete'
	| 'publish'
	| 'unpublish'
	| 'archive'
	| 'duplicate';

export type ModelOperation =
	| 'getAll'
	| 'get'
	| 'getSchema'
	| 'getEntries'
	| 'count';

export type AssetOperation =
	| 'upload'
	| 'getAll'
	| 'get'
	| 'delete'
	| 'getByUrl'
	| 'createFolder'
	| 'move';

export type SymbolOperation =
	| 'getAll'
	| 'get'
	| 'create'
	| 'update'
	| 'delete'
	| 'getInstances';

export type UserOperation =
	| 'getCurrent'
	| 'getAll'
	| 'get'
	| 'invite'
	| 'updateRole'
	| 'remove';

export type SpaceOperation =
	| 'getAll'
	| 'get'
	| 'create'
	| 'update'
	| 'delete'
	| 'getApiKeys';

export type TargetingOperation =
	| 'getAttributes'
	| 'createAttribute'
	| 'updateAttribute'
	| 'deleteAttribute'
	| 'evaluate';

export type WebhookOperation =
	| 'getAll'
	| 'get'
	| 'create'
	| 'update'
	| 'delete'
	| 'test';

export type LocaleOperation =
	| 'getAll'
	| 'get'
	| 'create'
	| 'update'
	| 'delete'
	| 'setDefault';

export type AnalyticsOperation =
	| 'getImpressions'
	| 'getConversions'
	| 'getABTestResults'
	| 'getContentInsights';

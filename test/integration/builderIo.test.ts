/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Builder.io n8n node
 * 
 * These tests verify the node structure and exports.
 * For full API integration testing, configure Builder.io credentials
 * and run with: npm run test:integration
 */

describe('Builder.io Node Integration', () => {
	describe('Node Structure', () => {
		it('should export BuilderIo node class', () => {
			// Dynamic import to check exports
			const nodePath = '../../nodes/BuilderIo/BuilderIo.node';
			expect(() => require(nodePath)).not.toThrow();
		});

		it('should export BuilderIoTrigger node class', () => {
			const triggerPath = '../../nodes/BuilderIo/BuilderIoTrigger.node';
			expect(() => require(triggerPath)).not.toThrow();
		});

		it('should export credentials class', () => {
			const credentialsPath = '../../credentials/BuilderIoApi.credentials';
			expect(() => require(credentialsPath)).not.toThrow();
		});
	});

	describe('Node Metadata', () => {
		let BuilderIo: any;
		let BuilderIoTrigger: any;

		beforeAll(() => {
			BuilderIo = require('../../nodes/BuilderIo/BuilderIo.node').BuilderIo;
			BuilderIoTrigger = require('../../nodes/BuilderIo/BuilderIoTrigger.node').BuilderIoTrigger;
		});

		it('should have correct node name', () => {
			const node = new BuilderIo();
			expect(node.description.name).toBe('builderIo');
		});

		it('should have correct display name', () => {
			const node = new BuilderIo();
			expect(node.description.displayName).toBe('Builder.io');
		});

		it('should have correct trigger name', () => {
			const trigger = new BuilderIoTrigger();
			expect(trigger.description.name).toBe('builderIoTrigger');
		});

		it('should have correct trigger display name', () => {
			const trigger = new BuilderIoTrigger();
			expect(trigger.description.displayName).toBe('Builder.io Trigger');
		});

		it('should specify builderIoApi credentials', () => {
			const node = new BuilderIo();
			expect(node.description.credentials).toContainEqual(
				expect.objectContaining({ name: 'builderIoApi' })
			);
		});

		it('should have all 10 resources', () => {
			const node = new BuilderIo();
			const resourceProperty = node.description.properties.find(
				(p: any) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty.options.length).toBe(10);
		});
	});

	describe('Credentials Metadata', () => {
		let BuilderIoApi: any;

		beforeAll(() => {
			BuilderIoApi = require('../../credentials/BuilderIoApi.credentials').BuilderIoApi;
		});

		it('should have correct credential name', () => {
			const cred = new BuilderIoApi();
			expect(cred.name).toBe('builderIoApi');
		});

		it('should have correct display name', () => {
			const cred = new BuilderIoApi();
			expect(cred.displayName).toBe('Builder.io API');
		});

		it('should have publicApiKey property', () => {
			const cred = new BuilderIoApi();
			const publicKey = cred.properties.find((p: any) => p.name === 'publicApiKey');
			expect(publicKey).toBeDefined();
			expect(publicKey.required).toBe(true);
		});

		it('should have privateApiKey property', () => {
			const cred = new BuilderIoApi();
			const privateKey = cred.properties.find((p: any) => p.name === 'privateApiKey');
			expect(privateKey).toBeDefined();
		});

		it('should have spaceId property', () => {
			const cred = new BuilderIoApi();
			const spaceId = cred.properties.find((p: any) => p.name === 'spaceId');
			expect(spaceId).toBeDefined();
		});
	});

	describe('Resource Operations', () => {
		let BuilderIo: any;

		beforeAll(() => {
			BuilderIo = require('../../nodes/BuilderIo/BuilderIo.node').BuilderIo;
		});

		it('should have content operations', () => {
			const node = new BuilderIo();
			const contentOps = node.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'content'
			);
			expect(contentOps).toBeDefined();
			expect(contentOps.options.length).toBeGreaterThan(10);
		});

		it('should have model operations', () => {
			const node = new BuilderIo();
			const modelOps = node.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'model'
			);
			expect(modelOps).toBeDefined();
		});

		it('should have asset operations', () => {
			const node = new BuilderIo();
			const assetOps = node.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'asset'
			);
			expect(assetOps).toBeDefined();
		});

		it('should have webhook operations', () => {
			const node = new BuilderIo();
			const webhookOps = node.description.properties.find(
				(p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'webhook'
			);
			expect(webhookOps).toBeDefined();
		});
	});

	describe('Trigger Events', () => {
		let BuilderIoTrigger: any;

		beforeAll(() => {
			BuilderIoTrigger = require('../../nodes/BuilderIo/BuilderIoTrigger.node').BuilderIoTrigger;
		});

		it('should have event property', () => {
			const trigger = new BuilderIoTrigger();
			const eventProp = trigger.description.properties.find(
				(p: any) => p.name === 'events'
			);
			expect(eventProp).toBeDefined();
		});

		it('should support content.published event', () => {
			const trigger = new BuilderIoTrigger();
			const eventProp = trigger.description.properties.find(
				(p: any) => p.name === 'events'
			);
			const publishedOption = eventProp?.options?.find(
				(o: any) => o.value === 'content.published'
			);
			expect(publishedOption).toBeDefined();
		});

		it('should support content.updated event', () => {
			const trigger = new BuilderIoTrigger();
			const eventProp = trigger.description.properties.find(
				(p: any) => p.name === 'events'
			);
			const updatedOption = eventProp?.options?.find(
				(o: any) => o.value === 'content.updated'
			);
			expect(updatedOption).toBeDefined();
		});
	});
});

describe('Constants', () => {
	it('should export BUILDER_IO_LICENSE_WARNING', () => {
		const { BUILDER_IO_LICENSE_WARNING } = require('../../nodes/BuilderIo/constants/constants');
		expect(BUILDER_IO_LICENSE_WARNING).toBeDefined();
		expect(BUILDER_IO_LICENSE_WARNING).toContain('Business Source License 1.1');
		expect(BUILDER_IO_LICENSE_WARNING).toContain('Velocity BPA');
	});

	it('should export RESOURCES array', () => {
		const { RESOURCES } = require('../../nodes/BuilderIo/constants/constants');
		expect(RESOURCES).toBeDefined();
		expect(Array.isArray(RESOURCES)).toBe(true);
		expect(RESOURCES.length).toBe(10);
	});

	it('should export WEBHOOK_EVENTS array', () => {
		const { WEBHOOK_EVENTS } = require('../../nodes/BuilderIo/constants/constants');
		expect(WEBHOOK_EVENTS).toBeDefined();
		expect(Array.isArray(WEBHOOK_EVENTS)).toBe(true);
		expect(WEBHOOK_EVENTS.length).toBeGreaterThan(0);
	});
});

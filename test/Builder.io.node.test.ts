/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Builderio } from '../nodes/Builder.io/Builder.io.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Builderio Node', () => {
  let node: Builderio;

  beforeAll(() => {
    node = new Builderio();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Builder.io');
      expect(node.description.name).toBe('builderio');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Content Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://cdn.builder.io/api/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all content entries successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAll')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('');
      
      const mockResponse = { results: [{ id: '1', data: {} }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAll operation errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAll')
        .mockReturnValueOnce('page');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('get operation', () => {
    it('should get specific content entry successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('get')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('content-123');
      
      const mockResponse = { id: 'content-123', data: {} };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('create operation', () => {
    it('should create content entry successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce({ name: 'Test Page' });
      
      const mockResponse = { id: 'new-content-123', data: { name: 'Test Page' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('update operation', () => {
    it('should update content entry successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('update')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('content-123')
        .mockReturnValueOnce({ name: 'Updated Page' });
      
      const mockResponse = { id: 'content-123', data: { name: 'Updated Page' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('delete operation', () => {
    it('should delete content entry successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('delete')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('content-123');
      
      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('publish operation', () => {
    it('should publish content entry successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('publish')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('content-123');
      
      const mockResponse = { published: true, id: 'content-123' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Models Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://cdn.builder.io/api/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	it('should get all models successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ models: [] });

		const result = await executeModelsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://cdn.builder.io/api/v1/models',
			qs: { apiKey: 'test-key' },
			json: true,
		});
		expect(result).toEqual([{ json: { models: [] }, pairedItem: { item: 0 } }]);
	});

	it('should get a specific model successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('get')
			.mockReturnValueOnce('model123');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'model123' });

		const result = await executeModelsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://cdn.builder.io/api/v1/models/model123',
			qs: { apiKey: 'test-key' },
			json: true,
		});
		expect(result).toEqual([{ json: { id: 'model123' }, pairedItem: { item: 0 } }]);
	});

	it('should create a model successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('create')
			.mockReturnValueOnce('Test Model')
			.mockReturnValueOnce({ field: [{ name: 'title', type: 'string', required: true }] });
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'new-model' });

		const result = await executeModelsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://cdn.builder.io/api/v1/models',
			qs: { apiKey: 'test-key' },
			body: {
				name: 'Test Model',
				fields: [{ name: 'title', type: 'string', required: true }],
			},
			json: true,
		});
		expect(result).toEqual([{ json: { id: 'new-model' }, pairedItem: { item: 0 } }]);
	});

	it('should handle errors properly', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeModelsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});
});

describe('Assets Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://cdn.builder.io/api/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAll operation', () => {
		it('should get all assets successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0);

			const mockResponse = {
				results: [
					{ id: '1', name: 'asset1.jpg', url: 'https://example.com/asset1.jpg' },
					{ id: '2', name: 'asset2.png', url: 'https://example.com/asset2.png' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://cdn.builder.io/api/v1/assets',
				qs: {
					apiKey: 'test-key',
					limit: 100,
					offset: 0,
				},
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getAll operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('create operation', () => {
		it('should upload asset successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('test-file-data');

			const mockResponse = {
				id: 'asset123',
				url: 'https://example.com/uploaded-asset.jpg',
				name: 'uploaded-asset.jpg',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://cdn.builder.io/api/v1/upload',
				qs: {
					apiKey: 'test-key',
				},
				body: {
					file: 'test-file-data',
				},
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle create operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('test-file-data');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Upload failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Upload failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('delete operation', () => {
		it('should delete asset successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('asset123');

			const mockResponse = { success: true };

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://cdn.builder.io/api/v1/assets/asset123',
				qs: {
					apiKey: 'test-key',
				},
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle delete operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('asset123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Delete failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Delete failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Webhooks Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://cdn.builder.io/api/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAll operation', () => {
		it('should get all webhooks successfully', async () => {
			const mockWebhooks = [{ id: '1', url: 'https://example.com/webhook' }];
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhooks);

			const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockWebhooks);
		});

		it('should handle getAll operation errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('create operation', () => {
		it('should create webhook successfully', async () => {
			const mockWebhook = { id: '123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['content.updated']);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockWebhook);
		});

		it('should handle create operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['content.updated']);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Create failed'));

			await expect(
				executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Create failed');
		});
	});

	describe('get operation', () => {
		it('should get webhook successfully', async () => {
			const mockWebhook = { id: '123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockWebhook);
		});

		it('should handle get operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));

			await expect(
				executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Not found');
		});
	});

	describe('update operation', () => {
		it('should update webhook successfully', async () => {
			const mockWebhook = { id: '123', url: 'https://updated.com/webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('update')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('https://updated.com/webhook')
				.mockReturnValueOnce(['content.created']);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockWebhook);
		});

		it('should handle update operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('update')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('https://updated.com/webhook')
				.mockReturnValueOnce(['content.created']);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));

			await expect(
				executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Update failed');
		});
	});

	describe('delete operation', () => {
		it('should delete webhook successfully', async () => {
			const mockResult = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResult);

			const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResult);
		});

		it('should handle delete operation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Delete failed'));

			await expect(
				executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Delete failed');
		});
	});
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://cdn.builder.io/api/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getContentAnalytics', () => {
    it('should get content analytics successfully', async () => {
      const mockResponse = { views: 100, clicks: 50, conversions: 5 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContentAnalytics')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('2023-01-01')
        .mockReturnValueOnce('2023-01-31');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://cdn.builder.io/api/v1/analytics/content?apiKey=test-key&model=page&startDate=2023-01-01&endDate=2023-01-31',
        json: true,
      });
    });

    it('should handle errors when getting content analytics', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContentAnalytics')
        .mockReturnValueOnce('page')
        .mockReturnValueOnce('2023-01-01')
        .mockReturnValueOnce('2023-01-31');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getEvents', () => {
    it('should get events successfully', async () => {
      const mockResponse = { events: [{ type: 'click', timestamp: '2023-01-01T00:00:00Z' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEvents')
        .mockReturnValueOnce('click')
        .mockReturnValueOnce('2023-01-01')
        .mockReturnValueOnce('2023-01-31');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://cdn.builder.io/api/v1/analytics/events?apiKey=test-key&event=click&startDate=2023-01-01&endDate=2023-01-31',
        json: true,
      });
    });

    it('should handle errors when getting events', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEvents')
        .mockReturnValueOnce('click')
        .mockReturnValueOnce('2023-01-01')
        .mockReturnValueOnce('2023-01-31');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});
});

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { parseJsonOrDefault, buildQuery, buildSort, cleanObject, formatDate, parseUserAttributes, getMimeType, validateRequiredFields, truncate } from '../../nodes/BuilderIo/utils/utils';

describe('Builder.io Utils', () => {
	describe('parseJsonOrDefault', () => {
		it('should parse valid JSON string', () => {
			const result = parseJsonOrDefault('{"key": "value"}', {});
			expect(result).toEqual({ key: 'value' });
		});

		it('should return default for invalid JSON', () => {
			const result = parseJsonOrDefault('invalid json', { default: true });
			expect(result).toEqual({ default: true });
		});

		it('should handle empty string', () => {
			const result = parseJsonOrDefault('', []);
			expect(result).toEqual([]);
		});

		it('should handle null (returns null, not default)', () => {
			const result = parseJsonOrDefault(null as any, 'default');
			expect(result).toBeNull();
		});
	});

	describe('buildQuery', () => {
		it('should build simple equals query', () => {
			const filters = [
				{ field: 'title', operator: 'equals', value: 'Test' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.title': 'Test' });
		});

		it('should build not equals query', () => {
			const filters = [
				{ field: 'status', operator: 'notEquals', value: 'draft' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.status': { '$ne': 'draft' } });
		});

		it('should build contains query (regex)', () => {
			const filters = [
				{ field: 'content', operator: 'contains', value: 'hello' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.content': { '$regex': 'hello', '$options': 'i' } });
		});

		it('should build greaterThan query', () => {
			const filters = [
				{ field: 'count', operator: 'greaterThan', value: '10' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.count': { '$gt': '10' } });
		});

		it('should build in query with comma-separated values', () => {
			const filters = [
				{ field: 'category', operator: 'in', value: 'news,blog,article' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.category': { '$in': ['news', 'blog', 'article'] } });
		});

		it('should build exists query', () => {
			const filters = [
				{ field: 'image', operator: 'exists', value: '' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({ 'data.image': { '$exists': true } });
		});

		it('should handle multiple filters', () => {
			const filters = [
				{ field: 'title', operator: 'equals', value: 'Test' },
				{ field: 'published', operator: 'equals', value: 'true' }
			];
			const result = buildQuery(filters);
			expect(result).toEqual({
				'data.title': 'Test',
				'data.published': 'true'
			});
		});

		it('should handle empty filters', () => {
			const result = buildQuery([]);
			expect(result).toEqual({});
		});
	});

	describe('buildSort', () => {
		it('should build ascending sort', () => {
			const result = buildSort('createdDate', 'asc');
			expect(result).toEqual({ createdDate: 1 });
		});

		it('should build descending sort', () => {
			const result = buildSort('updatedDate', 'desc');
			expect(result).toEqual({ updatedDate: -1 });
		});

		it('should handle empty field (still creates object)', () => {
			const result = buildSort('', 'asc');
			expect(result).toEqual({ '': 1 });
		});
	});

	describe('cleanObject', () => {
		it('should remove undefined values', () => {
			const obj = { a: 1, b: undefined, c: 'test' };
			const result = cleanObject(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove null values', () => {
			const obj = { a: 1, b: null, c: 'test' };
			const result = cleanObject(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove empty string values', () => {
			const obj = { a: 1, b: '', c: 'test' };
			const result = cleanObject(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should keep falsy but valid values', () => {
			const obj = { a: 0, b: false, c: 'test' };
			const result = cleanObject(obj);
			expect(result).toEqual({ a: 0, b: false, c: 'test' });
		});
	});

	describe('formatDate', () => {
		it('should format date string to ISO', () => {
			const result = formatDate('2024-01-15');
			expect(result).toMatch(/2024-01-15/);
		});

		it('should format timestamp string to ISO', () => {
			const result = formatDate('2024-01-15T12:00:00Z');
			expect(result).toBe('2024-01-15T12:00:00.000Z');
		});

		it('should handle Date object', () => {
			const date = new Date('2024-01-15T00:00:00Z');
			const result = formatDate(date);
			expect(result).toBe('2024-01-15T00:00:00.000Z');
		});
	});

	describe('parseUserAttributes', () => {
		it('should keep string value as string', () => {
			const attrs = { country: 'US' };
			const result = parseUserAttributes(attrs);
			expect(result).toEqual({ country: 'US' });
		});

		it('should parse numeric string to number', () => {
			const attrs = { age: '25' };
			const result = parseUserAttributes(attrs);
			expect(result).toEqual({ age: 25 });
		});

		it('should parse boolean string to boolean', () => {
			const attrs = { premium: 'true' };
			const result = parseUserAttributes(attrs);
			expect(result).toEqual({ premium: true });
		});

		it('should handle multiple attributes', () => {
			const attrs = {
				country: 'US',
				age: '25',
				premium: 'true'
			};
			const result = parseUserAttributes(attrs);
			expect(result).toEqual({ country: 'US', age: 25, premium: true });
		});

		it('should handle empty object', () => {
			const result = parseUserAttributes({});
			expect(result).toEqual({});
		});
	});

	describe('getMimeType', () => {
		it('should return correct MIME type for jpg', () => {
			expect(getMimeType('photo.jpg')).toBe('image/jpeg');
			expect(getMimeType('photo.jpeg')).toBe('image/jpeg');
		});

		it('should return correct MIME type for png', () => {
			expect(getMimeType('image.png')).toBe('image/png');
		});

		it('should return correct MIME type for gif', () => {
			expect(getMimeType('animation.gif')).toBe('image/gif');
		});

		it('should return correct MIME type for webp', () => {
			expect(getMimeType('photo.webp')).toBe('image/webp');
		});

		it('should return correct MIME type for svg', () => {
			expect(getMimeType('icon.svg')).toBe('image/svg+xml');
		});

		it('should return correct MIME type for pdf', () => {
			expect(getMimeType('document.pdf')).toBe('application/pdf');
		});

		it('should return correct MIME type for mp4', () => {
			expect(getMimeType('video.mp4')).toBe('video/mp4');
		});

		it('should return octet-stream for unknown', () => {
			expect(getMimeType('file.xyz')).toBe('application/octet-stream');
		});

		it('should handle uppercase extensions', () => {
			expect(getMimeType('PHOTO.JPG')).toBe('image/jpeg');
		});
	});

	describe('validateRequiredFields', () => {
		it('should pass with all required fields', () => {
			const data = { name: 'Test', email: 'test@example.com' };
			expect(() => validateRequiredFields(data, ['name', 'email'])).not.toThrow();
		});

		it('should throw for missing field', () => {
			const data = { name: 'Test' };
			expect(() => validateRequiredFields(data, ['name', 'email'])).toThrow('Missing required fields: email');
		});

		it('should throw for empty string field', () => {
			const data = { name: 'Test', email: '' };
			expect(() => validateRequiredFields(data, ['name', 'email'])).toThrow('Missing required fields: email');
		});

		it('should treat zero as falsy (throws)', () => {
			const data = { name: 'Test', count: 0 };
			expect(() => validateRequiredFields(data, ['name', 'count'])).toThrow('Missing required fields: count');
		});

		it('should treat false as falsy (throws)', () => {
			const data = { name: 'Test', active: false };
			expect(() => validateRequiredFields(data, ['name', 'active'])).toThrow('Missing required fields: active');
		});
	});

	describe('truncate', () => {
		it('should not truncate short strings', () => {
			expect(truncate('Hello', 10)).toBe('Hello');
		});

		it('should truncate long strings with ellipsis', () => {
			expect(truncate('Hello World', 8)).toBe('Hello...');
		});

		it('should handle exact length', () => {
			expect(truncate('Hello', 5)).toBe('Hello');
		});

		it('should handle very short maxLength', () => {
			expect(truncate('Hello World', 3)).toBe('...');
		});

		it('should handle empty string', () => {
			expect(truncate('', 10)).toBe('');
		});
	});
});

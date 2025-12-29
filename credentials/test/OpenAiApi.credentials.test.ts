import type { ICredentialDataDecryptedObject, IHttpRequestOptions } from 'n8n-workflow';

import { OpenAiApi } from '../OpenAiApi.credentials';

describe('OpenAiApi Credential', () => {
	const openAiApi = new OpenAiApi();

	// it('should have correct properties', () => {
	// 	expect(openAiApi.name).toBe('openAiApi');
	// 	expect(openAiApi.displayName).toBe('OpenAi');
	// 	expect(openAiApi.documentationUrl).toBe('openai');
	// 	expect(openAiApi.properties).toHaveLength(4);
	// 	expect(openAiApi.test.request.baseURL).toBe('={{$credentials?.url}}');
	// 	expect(openAiApi.test.request.url).toBe('/models');
	// });

	describe('authenticate', () => {
		it('should add Authorization header with API key only', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				Authorization: 'Bearer sk-test123456789',
				'OpenAI-Organization': undefined,
			});
		});

		it('should add Authorization and Organization headers', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
				organizationId: 'org-123',
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				Authorization: 'Bearer sk-test123456789',
				'OpenAI-Organization': 'org-123',
			});
		});

		it('should add custom headers from credentials', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
				organizationId: 'org-123',
				headers: {
					values: [
						{ name: 'X-Custom-Header', value: 'custom-value-123' },
						{ name: 'X-Another-Header', value: 'another-value' },
					],
				},
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				Authorization: 'Bearer sk-test123456789',
				'OpenAI-Organization': 'org-123',
				'X-Custom-Header': 'custom-value-123',
				'X-Another-Header': 'another-value',
			});
		});

		it('should include gateway headers for a custom base URL', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'empty',
				headers: {
					values: [
						{ name: 'BCS-APIHub-RequestId', value: 'test-request-id' },
						{ name: 'X-CHJ-GWToken', value: 'test-token' },
					],
				},
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'http://api-hub.inner.chj.cloud/llm-gateway/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.baseURL).toBe('http://api-hub.inner.chj.cloud/llm-gateway/v1');
			expect(result.headers).toEqual({
				Authorization: 'Bearer empty',
				'OpenAI-Organization': undefined,
				'BCS-APIHub-RequestId': 'test-request-id',
				'X-CHJ-GWToken': 'test-token',
			});
		});

		it('should ignore empty custom header names', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
				headers: {
					values: [{ name: '', value: 'custom-value-123' }],
				},
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				Authorization: 'Bearer sk-test123456789',
				'OpenAI-Organization': undefined,
			});
		});

		it('should handle empty organization ID', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
				organizationId: '',
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {},
				url: '/models',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				Authorization: 'Bearer sk-test123456789',
				'OpenAI-Organization': '',
			});
		});

		it('should preserve existing headers when adding auth headers', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {
					'OpenAI-Beta': 'assistants=v2',
				},
				url: '/assistants',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				'OpenAI-Beta': 'assistants=v2',
				Authorization: 'Bearer sk-test123456789',
			});
		});

		it('should preserve existing headers even with custom headers set', async () => {
			const credentials: ICredentialDataDecryptedObject = {
				apiKey: 'sk-test123456789',
				headers: {
					values: [{ name: 'X-Additional-Header', value: 'additional-value' }],
				},
			};

			const requestOptions: IHttpRequestOptions = {
				headers: {
					'OpenAI-Beta': 'assistants=v2',
					'X-Existing-Header': 'existing-value',
				},
				url: '/assistants/asst_123',
				baseURL: 'https://api.openai.com/v1',
			};

			const result = await openAiApi.authenticate(credentials, requestOptions);

			expect(result.headers).toEqual({
				'OpenAI-Beta': 'assistants=v2',
				'X-Existing-Header': 'existing-value',
				Authorization: 'Bearer sk-test123456789',
				'X-Additional-Header': 'additional-value',
			});
		});
	});
});

import type { IHttpRequestOptions } from 'n8n-workflow';

export const getUrl = (options: IHttpRequestOptions | IHttpRequestOptions): string => {
	if (options.url) {
		return new URL(options.url, options.baseURL).toString();
	}
	if ('uri' in options && options.uri) {
		return String(options.uri);
	}
	throw new Error('No URL found in request options');
};

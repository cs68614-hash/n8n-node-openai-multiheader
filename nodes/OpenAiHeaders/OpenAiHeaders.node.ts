import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { chatFields, chatOperations } from './ChatDescription';
import { imageFields, imageOperations } from './ImageDescription';
import { textFields, textOperations } from './TextDescription';
export class OpenAiHeaders implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenAI Headers',
		name: 'openAiHeaders',
		icon: { light: 'file:openAi.svg', dark: 'file:openAi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume OpenAI',
		defaults: {
			name: 'OpenAI Headers',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'openAiHeadersApi',
				required: true,
			},
		],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL:
				'={{ $credentials.url?.split("/").slice(0,-1).join("/") ?? "https://api.openai.com" }}',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Text',
						value: 'text',
					},
				],
				default: 'text',
			},

			...chatOperations,
			...chatFields,

			...imageOperations,
			...imageFields,

			...textOperations,
			...textFields,
		],
		usableAsTool: true,
	};
}

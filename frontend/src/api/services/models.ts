import { apiFetch } from '../client';

export const modelService = {
  testInference: (modelId: string, threshold = 0.5) => apiFetch(`/ai-models/test/${encodeURIComponent(modelId)}`, {
    method: 'POST',
    body: JSON.stringify({ threshold }),
  }),
};

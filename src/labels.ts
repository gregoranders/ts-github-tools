/**
 * ts-github-tools
 *
 * @packageDocumentation
 */
import { Context, ClientType, create as commonCreate, ensure as commonEnsure } from './common';

export type Label = {
  name: string;
  description: string;
  color: string;
};

export const create = (client: ClientType, context: Context, label: Label): Promise<void> => {
  return commonCreate(context, label, 'label', async () => {
    const { owner, repo } = context;
    return client.issues.createLabel({ owner, repo, ...label });
  });
};

export const ensure = async (client: ClientType, context: Context, requested: Label[]): Promise<void> => {
  const { owner, repo } = context;
  const response = await client.issues.listLabelsForRepo({ owner, repo });
  const present = response.data.map((label: { name: string }) => label.name);
  return commonEnsure(client, context, { present, requested, create, label: 'Label' });
};

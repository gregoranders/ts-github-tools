/**
 * ts-github-tools
 *
 * @packageDocumentation
 */
import { Context, create as commonCreate, ensure as commonEnsure } from './common';

export type Label = {
  name: string;
  description: string;
  color: string;
};

export const create = (context: Context, label: Label): Promise<void> => {
  return commonCreate(context, label, 'label', async () => {
    const { client, owner, repo } = context;
    return client.issues.createLabel({ owner, repo, ...label });
  });
};

export const ensure = async (context: Context, requested: Label[]): Promise<void> => {
  const { client, owner, repo } = context;
  const response = await client.issues.listLabelsForRepo({ owner, repo });
  const present = response.data.map((label: { name: string }) => label.name);
  return commonEnsure(context, { present, requested, create, label: 'Label' });
};

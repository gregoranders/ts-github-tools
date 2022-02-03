/* eslint-disable unicorn/prefer-code-point */
/**
 * ts-github-tools
 *
 * @packageDocumentation
 */
import tweetsodium from 'tweetsodium';
import { ClientType, Context, create as commonCreate, ensure as commonEnsure } from './common';

export type Secret = {
  name: string;
  value: string;
};

// eslint-disable-next-line unicorn/prefer-spread
const string2uint8Array = (text: string) => Uint8Array.from(text.split('').map((ch) => ch.charCodeAt(0)));

export const create = (client: ClientType, context: Context, secret: Secret): Promise<void> => {
  const { owner, repo } = context;
  return commonCreate(context, secret, 'secret', async () => {
    const key = await client.rest.actions.getRepoPublicKey({ owner, repo });
    const messageBytes = string2uint8Array(secret.name);
    const keyBytes = new Uint8Array(Buffer.from(key.data.key, 'base64'));
    const encryptedBytes = tweetsodium.seal(messageBytes, keyBytes);
    const encrypted_value = Buffer.from(encryptedBytes).toString('base64');
    return client.rest.actions.createOrUpdateRepoSecret({
      owner,
      repo,
      key_id: key.data.key_id,
      secret_name: secret.name,
      encrypted_value,
    });
  });
};

export const ensure = async (client: ClientType, context: Context, requested: Secret[]): Promise<void> => {
  const { owner, repo } = context;
  const response = await client.rest.actions.listRepoSecrets({ owner, repo });
  const present = response.data.secrets.map((secret: { name: string }) => secret.name);
  return commonEnsure(client, context, { present, requested, create, label: 'Secret' });
};

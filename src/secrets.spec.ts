import { client, context, key, mockedLog } from './fixtures/test-utils';

import { create, ensure } from './secrets';

describe('ts-github-tools', () => {
  describe('secrets', () => {
    const { repo, owner } = context;
    const secret = {
      name: 'test',
      value: 'test',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('createSecret', () => {
      it('should invoke log.info on success', async () => {
        client.rest.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.rest.actions.createOrUpdateRepoSecret.mockResolvedValue({ status: 201 });
        await expect(create(client, context, secret)).resolves.toBeUndefined();
        expect(client.rest.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
        expect(mockedLog.info).toHaveBeenNthCalledWith(1, "Created secret 'test' in 'owner/repo'");
      });
      it('should invoke log.error on failure', async () => {
        client.rest.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.rest.actions.createOrUpdateRepoSecret.mockRejectedValue({ status: 500 });
        await expect(create(client, context, secret)).resolves.toBeUndefined();
        expect(client.rest.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
        expect(mockedLog.error).toHaveBeenNthCalledWith(1, "Unable to create secret 'test' in 'owner/repo'");
      });
    });

    describe('ensureSecrets', () => {
      it('should create secret if not present', async () => {
        client.rest.actions.listRepoSecrets.mockResolvedValue({ data: { secrets: [] } });
        client.rest.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.rest.actions.createOrUpdateRepoSecret.mockResolvedValue({ status: 201 });
        await expect(ensure(client, context, [secret])).resolves.toBeUndefined();
        expect(client.rest.actions.listRepoSecrets).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
      });

      it('should not create secret if present and invoke log.warn', async () => {
        client.rest.actions.listRepoSecrets.mockResolvedValue({
          data: { secrets: [secret] },
        });
        client.rest.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        await expect(ensure(client, context, [secret])).resolves.toBeUndefined();
        expect(client.rest.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(0);
        expect(mockedLog.warn).toHaveBeenNthCalledWith(1, "Secret 'test' already found in 'owner/repo'");
      });
    });
  });
});

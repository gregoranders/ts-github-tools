import { mockedLog, key, context, client } from './fixtures/testUtils';

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
      it('should invoke log.info on 201', async () => {
        client.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.actions.createOrUpdateRepoSecret.mockResolvedValue({ status: 201 });
        await expect(create(client, context, secret)).resolves.toBeUndefined();
        expect(client.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
        expect(mockedLog.info).toHaveBeenNthCalledWith(1, `Created secret 'test' in 'owner/repo'`);
      });

      it('should invoke log.error if not 201', async () => {
        client.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.actions.createOrUpdateRepoSecret.mockResolvedValue({ status: 200 });
        await expect(create(client, context, secret)).resolves.toBeUndefined();
        expect(client.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
        expect(mockedLog.error).toHaveBeenNthCalledWith(1, `Unable to create secret 'test' in 'owner/repo'`);
      });
    });

    describe('ensureSecrets', () => {
      it('should create secret if not present', async () => {
        client.actions.listRepoSecrets.mockResolvedValue({ data: { secrets: [] } });
        client.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        client.actions.createOrUpdateRepoSecret.mockResolvedValue({ status: 201 });
        await expect(ensure(client, context, [secret])).resolves.toBeUndefined();
        expect(client.actions.listRepoSecrets).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.actions.getRepoPublicKey).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(1);
      });

      it('should not create secret if present and invoke log.warn', async () => {
        client.actions.listRepoSecrets.mockResolvedValue({
          data: { secrets: [secret] },
        });
        client.actions.getRepoPublicKey.mockResolvedValue({
          data: key,
        });
        await expect(ensure(client, context, [secret])).resolves.toBeUndefined();
        expect(client.actions.createOrUpdateRepoSecret).toHaveBeenCalledTimes(0);
        expect(mockedLog.warn).toHaveBeenNthCalledWith(1, `Secret 'test' already found in 'owner/repo'`);
      });
    });
  });
});

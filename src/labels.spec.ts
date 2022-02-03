import { client, context, mockedLog } from './fixtures/test-utils';

import { create, ensure } from './labels';

describe('ts-github-tools', () => {
  describe('labels', () => {
    const { owner, repo } = context;
    const label = {
      name: 'test',
      description: 'description',
      color: 'ffffff',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('createLabel', () => {
      it('should invoke log.info on success', async () => {
        client.rest.issues.createLabel.mockResolvedValue({ status: 201 });
        await create(client, context, label);
        expect(client.rest.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.info).toHaveBeenNthCalledWith(1, "Created label 'test' in 'owner/repo'");
      });
      it('should invoke log.error on failure', async () => {
        client.rest.issues.createLabel.mockRejectedValue({ status: 500 });
        await create(client, context, label);
        expect(client.rest.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.error).toHaveBeenNthCalledWith(1, "Unable to create label 'test' in 'owner/repo'");
      });
    });

    describe('ensureLabels', () => {
      it('should create label if not present', async () => {
        client.rest.issues.createLabel.mockResolvedValue({ status: 201 });
        client.rest.issues.listLabelsForRepo.mockResolvedValue({ data: [] });
        await ensure(client, context, [label]);
        expect(client.rest.issues.listLabelsForRepo).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
      });

      it('should not create label if present', async () => {
        client.rest.issues.listLabelsForRepo.mockResolvedValue({
          data: [label],
        });
        await ensure(client, context, [label]);
        expect(client.rest.issues.listLabelsForRepo).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.rest.issues.createLabel).not.toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.warn).toHaveBeenNthCalledWith(1, "Label 'test' already found in 'owner/repo'");
      });
    });
  });
});

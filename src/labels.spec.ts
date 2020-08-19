import { context, mockedLog, client } from './fixtures/testUtils';

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
      it(`should invoke console.log on success`, async () => {
        client.issues.createLabel.mockResolvedValue({ status: 201 });
        await create(client, context, label);
        expect(client.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.info).toHaveBeenNthCalledWith(1, `Created label 'test' in 'owner/repo'`);
      });

      it(`should invoke console.error on error`, async () => {
        client.issues.createLabel.mockResolvedValue({ status: 200 });
        await create(client, context, label);
        expect(client.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.error).toHaveBeenNthCalledWith(1, `Unable to create label 'test' in 'owner/repo'`);
      });
    });

    describe('ensureLabels', () => {
      it(`should create label if not present`, async () => {
        client.issues.createLabel.mockResolvedValue({ status: 201 });
        client.issues.listLabelsForRepo.mockResolvedValue({ data: [] });
        await ensure(client, context, [label]);
        expect(client.issues.listLabelsForRepo).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.issues.createLabel).toHaveBeenNthCalledWith(1, { ...label, owner, repo });
      });

      it(`should not create label if present`, async () => {
        client.issues.listLabelsForRepo.mockResolvedValue({
          data: [label],
        });
        await ensure(client, context, [label]);
        expect(client.issues.listLabelsForRepo).toHaveBeenNthCalledWith(1, { owner, repo });
        expect(client.issues.createLabel).not.toHaveBeenNthCalledWith(1, { ...label, owner, repo });
        expect(mockedLog.warn).toHaveBeenNthCalledWith(1, `Label 'test' already found in 'owner/repo'`);
      });
    });
  });
});

import { client, context, mockedLog, mockedSetToken } from './fixtures/test-utils';

describe('ts-github-tools', () => {
  describe('index', () => {
    const { repo, owner } = context;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('main', () => {
      describe('should show help when', () => {
        it('GITHUB_TOKEN is missing', async () => {
          process.env = {};
          const testSubject = await import('./index');

          expect(mockedLog.warn).toHaveBeenNthCalledWith(1, testSubject.HELP);
        });

        it("second parameter does not contain a '/'", async () => {
          process.env = {
            GITHUB_TOKEN: 'token',
          };
          process.argv = ['', '', `${owner}${repo}`, '1223'];
          const testSubject = await import('./index');
          await testSubject.main(process);

          expect(mockedLog.warn).toHaveBeenNthCalledWith(1, testSubject.HELP);
        });
      });

      it('should do nothing when labels and secret exist', async () => {
        process.env = {
          GITHUB_TOKEN: 'token',
        };
        process.argv = ['', '', `${owner}/${repo}`, '1223'];

        const testSubject = await import('./index');

        client.rest.actions.listRepoSecrets.mockResolvedValue({
          data: {
            secrets: [
              { name: 'CC_TEST_REPORTER_ID', created_at: '', updated_at: '' },
              { name: 'CODACY_PROJECT_TOKEN', created_at: '', updated_at: '' },
            ],
            total_count: 1,
          },
        });

        client.rest.issues.listLabelsForRepo.mockResolvedValue({
          data: testSubject.CUSTOM_LABELS,
        });

        await testSubject.main(process);

        // eslint-disable-next-line unicorn/no-useless-undefined
        expect(mockedSetToken).toHaveBeenNthCalledWith(1, 'token', undefined);
        expect(mockedLog.warn).not.toHaveBeenNthCalledWith(1, 'Warn');
        expect(client.rest.actions.getRepoPublicKey).not.toHaveBeenCalled();
        expect(client.rest.actions.createOrUpdateRepoSecret).not.toHaveBeenCalled();
        expect(client.rest.issues.createLabel).not.toHaveBeenCalled();
      });

      it('should log error', async () => {
        process.env = {
          GITHUB_TOKEN: 'token',
        };
        process.argv = ['', '', `${owner}/${repo}`, '1223'];

        client.rest.actions.listRepoSecrets.mockRejectedValue(new Error('error'));

        const testSubject = await import('./index');

        await testSubject.main(process);
        expect(mockedLog.error).toHaveBeenNthCalledWith(1, new Error('error'));
      });
    });
  });
});

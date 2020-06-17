import { context, mockedLog, mockedSetToken, client } from './fixtures/testUtils';

describe('ts-github-tools', () => {
  describe('index', () => {
    const { repo, owner } = context;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('main', () => {
      describe('should show help when ', () => {
        it(`GITHUB_TOKEN is missing`, async () => {
          process.env = {};
          const testSubject = await import('./index');

          expect(mockedLog.warn).toHaveBeenNthCalledWith(1, testSubject.HELP);
        });

        it(`second parameter does not contain a '/'`, async () => {
          process.env = {
            GITHUB_TOKEN: 'token',
          };
          process.argv = ['', '', `${owner}${repo}`, '1223'];
          const testSubject = await import('./index');
          await testSubject.main(process);

          expect(mockedLog.warn).toHaveBeenNthCalledWith(1, testSubject.HELP);
        });
      });

      it(`should do nothing`, async () => {
        process.env = {
          GITHUB_TOKEN: 'token',
        };
        process.argv = ['', '', `${owner}/${repo}`, '1223'];

        const testSubject = await import('./index');

        client.actions.listRepoSecrets.mockResolvedValue({
          data: { secrets: [{ name: 'CC_TEST_REPORTER_ID', created_at: '', updated_at: '' }], total_count: 1 },
        });

        client.issues.listLabelsForRepo.mockResolvedValue({
          data: testSubject.CUSTOM_LABELS,
        });

        await testSubject.main(process);

        expect(mockedSetToken).toHaveBeenNthCalledWith(1, 'token', undefined);
        expect(mockedLog.warn).not.toHaveBeenNthCalledWith(1, 'Warn');
        expect(client.actions.getRepoPublicKey).not.toHaveBeenCalled();
        expect(client.actions.createOrUpdateRepoSecret).not.toHaveBeenCalled();
        expect(client.issues.createLabel).not.toHaveBeenCalled();
      });
    });
  });
});

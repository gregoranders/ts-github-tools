/**
 * ts-github-tools
 *
 * Tools used for setting up a `repository`.
 *
 * @remarks
 *   - labels
 *     - `npm dependencies`
 *     - `code quality`
 *   - secret
 *     - `CC_TEST_REPORTER_ID`
 *
 * @packageDocumentation
 */
import { default as getClient, log } from './common';

import { ensure as ensureLabels } from './labels';
import { ensure as ensureSecrets } from './secrets';

/**
 * @internal
 */
export const CUSTOM_LABELS = [
  {
    name: 'npm dependencies',
    description: 'Node dependencies',
    color: 'dd0000',
  },
  {
    name: 'code quality',
    description: 'Code Quality',
    color: '00dd00',
  },
];

/**
 * @internal
 */
export const HELP = `Usage: ${process.argv[1]} [owner]/[repo] [CC_TEST_REPORTER_ID]`;

/**
 * @internal
 */
export const main = async (proc: typeof process): Promise<void> => {
  if (!proc.env.GITHUB_TOKEN || !proc.argv || proc.argv.length < 4) {
    log.warn(HELP);
    return;
  }

  const [owner, repo] = proc.argv[2].split('/', 2);

  if (!owner || !repo) {
    log.warn(HELP);
    return;
  }

  const secrets = [{ name: 'CC_TEST_REPORTER_ID', value: proc.argv[3] }];

  const client = getClient(proc.env.GITHUB_TOKEN);
  const context = { client, owner, repo };

  await ensureLabels(client, context, CUSTOM_LABELS);
  await ensureSecrets(client, context, secrets);
};

main(process);

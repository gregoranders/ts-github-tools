import { getOctokit } from '@actions/github';
import tweetnacl from 'tweetnacl';

import { OctokitOptions } from '@actions/github/node_modules/@octokit/core/dist-types/types';

import { Endpoints } from '@octokit/types';

import { DeepPartial } from 'tsdef';

const keyPair = tweetnacl.box.keyPair();

const uint8Array2string = (buffer: Uint8Array) => Buffer.from(buffer).toString('base64');

export const key = { key_id: '123', key: uint8Array2string(keyPair.publicKey) };

export const mockedSetToken = jest.fn();

export const mockedLog = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const createMock = <
  K extends keyof Endpoints,
  R = Promise<DeepPartial<Endpoints[K]['response']>>,
  P = Endpoints[K]['parameters']
>(): jest.Mock<R, [P]> => {
  return jest.fn<R, [P]>();
};

const mockedOctokit = {
  issues: {
    createLabel: createMock<'POST /repos/:owner/:repo/labels'>(),
    listLabelsForRepo: createMock<'GET /repos/:owner/:repo/labels'>(),
  },
  actions: {
    getRepoPublicKey: createMock<'GET /repos/:owner/:repo/actions/secrets/public-key'>(),
    createOrUpdateRepoSecret: createMock<'PUT /repos/:owner/:repo/actions/secrets/:secret_name'>(),
    listRepoSecrets: createMock<'GET /repos/:owner/:repo/actions/secrets'>(),
  },
};

export const mockedGetOctokit = jest.fn<typeof mockedOctokit, Parameters<typeof getOctokit>>(
  (token: string, options?: OctokitOptions) => {
    mockedSetToken(token, options);
    return mockedOctokit;
  },
);

export const context = {
  // eslint-disable-next-line no-warning-comments
  // TODO: set to typeof mockedOctokit when working on tests otherwise any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: (mockedGetOctokit.getMockImplementation()('') as unknown) as jest.Mocked<ReturnType<typeof getOctokit>>,
  owner: 'owner',
  repo: 'repo',
};

jest.mock('@actions/github', () => ({
  getOctokit: mockedGetOctokit,
}));

jest.mock('fancy-log', () => mockedLog);

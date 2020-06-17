// import { getOctokit } from '@actions/github';
import tweetnacl from 'tweetnacl';

import { OctokitOptions } from '@actions/github/node_modules/@octokit/core/dist-types/types';

import { Endpoints } from '@octokit/types';

import { DeepPartial } from 'tsdef';

const keyPair = tweetnacl.box.keyPair();

const uint8Array2string = (buffer: Uint8Array) => Buffer.from(buffer).toString('base64');

export const key = { key_id: '123', key: uint8Array2string(keyPair.publicKey) };

export const mockedSetToken = jest.fn();

export const context = {
  owner: 'owner',
  repo: 'repo',
};

type MockedType<
  K extends keyof Endpoints,
  R = Promise<DeepPartial<Endpoints[K]['response']>>,
  P = Endpoints[K]['parameters']
> = jest.Mock<R, [P]>;

const createMock = <K extends keyof Endpoints>(): MockedType<K> => {
  return jest.fn();
};

jest.mock('@actions/github');

import * as Octokit from '@actions/github';

const octokit = Octokit as jest.Mocked<typeof Octokit>;

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

type MockedGetOctokit = (
  token: string,
  options?: OctokitOptions,
) => ReturnType<typeof Octokit.getOctokit> & typeof mockedOctokit;

export const getOctokit = octokit.getOctokit.mockImplementation((token, options?) => {
  mockedSetToken(token, options);
  return mockedOctokit as ReturnType<MockedGetOctokit>;
}) as jest.MockedFunction<jest.MockedFunction<MockedGetOctokit>>;

export const client = getOctokit('123');

export const mockedLog = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock('fancy-log', () => mockedLog);

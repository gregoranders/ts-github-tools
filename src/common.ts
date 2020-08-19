import log from 'fancy-log';

import * as Octokit from '@actions/github';

export { log };

type Request = {
  name: string;
};

type Response = {
  status: number;
};

export type ClientType = ReturnType<typeof Octokit.getOctokit>;

export type Context = {
  owner: string;
  repo: string;
};

export type CreateFunction<T extends Response> = () => Promise<T>;

export async function create<T extends Request, R extends Response>(
  context: Context,
  entry: T,
  label: string,
  createFunction: CreateFunction<R>,
): Promise<void> {
  const { owner, repo } = context;
  try {
    const response = await createFunction();
    if (response.status !== 201) throw Error;
    log.info(`Created ${label} '${entry.name}' in '${owner}/${repo}'`);
  } catch (error) {
    log.error(`Unable to create ${label} '${entry.name}' in '${owner}/${repo}'`);
  }
}

export type EnsureCreateFunction<T extends Request> = (client: ClientType, context: Context, entry: T) => Promise<void>;

export async function ensure<T extends Request>(
  client: ClientType,
  context: Context,
  ensureContext: {
    present: string[];
    requested: T[];
    create: EnsureCreateFunction<T>;
    label: string;
  },
): Promise<void> {
  const { owner, repo } = context;
  const { create, label, present, requested } = ensureContext;

  await Promise.all(
    requested
      .filter((temp) => {
        if (present.includes(temp.name)) {
          log.warn(`${label} '${temp.name}' already found in '${owner}/${repo}'`);
          return false;
        }
        return true;
      })
      .map((temp) => create(client, context, temp)),
  );
}

export default Octokit.getOctokit;

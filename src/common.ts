import log from 'fancy-log';

import * as Octokit from '@actions/github';

export { log };

type Request = {
  name: string;
};

type Response = {
  status: number;
};

// eslint-disable-next-line no-warning-comments
// TODO: set to ReturnType<typeof Octokit.getOctokit> when NOT working
//       on tests otherwise ReturnType<typeof Octokit.getOctokit> & any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClientType = ReturnType<typeof Octokit.getOctokit> & any;

export type Context<T = ClientType> = {
  client: T;
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

export type EnsureCreateFunction<T extends Request> = (context: Context, entry: T) => Promise<void>;

export async function ensure<T extends Request>(
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
      .map((temp) => create(context, temp)),
  );
}

export default Octokit.getOctokit;

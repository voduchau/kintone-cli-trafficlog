import { Octokit } from "@octokit/rest";
import { ERROR } from "../log/constant";
import { removeEmptyObject, printLog } from "../util";
import { createLog, getFileLogPath } from "../log";
import fetch from "node-fetch";

let Github: Octokit;
type PerType = "day" | "week";

export const setGithubConfig = (githubToken: string) => {
  Github = new Octokit({
    auth: githubToken,
    request: {
        fetch: fetch,
      },
  });
};

export const getTrafficLogsONGithub = async (
  lastday: string,
  owner: string,
  projectName: string
) => {
  const numberViewsOnGithub = getNumberViews(owner, projectName, 'week');
  const numberClonesOnGithub = getNumberClones(owner, projectName, 'week');
  const numberDownloadsOnGithub = await getNumberDownloads(owner, projectName);
  const [viewInfoResponses, cloneInfoResponses] = await Promise.all([
    numberViewsOnGithub,
    numberClonesOnGithub,
  ]);
  const timeLog = `viewInfoResponses: ${viewInfoResponses[0].count}`;
  const timeLog1 = `cloneInfoResponses: ${cloneInfoResponses[0].count}`;
  printLog(timeLog);
  printLog(timeLog1);
  const fileLogPath = getFileLogPath();

  createLog(fileLogPath, {
    date: lastday,
    response: "Respond from Github API",
    debug: {
      numberViewsOnGithub: viewInfoResponses,
      numberClonesOnGithub: cloneInfoResponses,
      numberDownloadsOnGithub,
    },
  });

  const viewInfos = viewInfoResponses.filter((views) => {
    return views.timestamp!.indexOf(lastday) >= 0;
  });
  const cloneInfos = cloneInfoResponses.filter((clones) => {
    return clones.timestamp!.indexOf(lastday) >= 0;
  });

  createLog(fileLogPath, {
    date: lastday,
    response: `Filter by last date: ${lastday}`,
    debug: {
      viewInfos,
      cloneInfos,
    },
  });

  return {
    view: viewInfos.length === 1 ? viewInfos[0] : {},
    clone: cloneInfos.length === 1 ? cloneInfos[0] : {},
    downloadCount: numberDownloadsOnGithub || [],
  };
};

const getNumberViews = (
  owner: string,
  projectName: string,
  per: PerType = "day"
) => {
  if (!Github) {
    throw new Error(ERROR.GITHUB.CONFIGURATION_INVALID);
  }

  return Github.repos
    .getViews({
      owner: owner,
      repo: projectName,
      per: per,
    })
    .then((resp) => {
        // const timeLog = `getNumberViews: ${resp.data.views}`;
        // printLog(timeLog);
      return resp.data.views as GithubResponseTraffic[];
    })
    .catch((error) => {
      throw error;
    });
};

const getNumberClones = (
  owner: string,
  projectName: string,
  per: PerType = "day"
) => {
  if (!Github) {
    throw new Error(ERROR.GITHUB.CONFIGURATION_INVALID);
  }

  return Github.repos
    .getClones({
      owner: owner,
      repo: projectName,
      per: per,
    })
    .then((resp) => {
        // const timeLog = `getNumberViews: ${resp.data.clones}`;
        // printLog(timeLog);
      return resp.data.clones as GithubResponseTraffic[];
    })
    .catch((error) => {
      throw error;
    });
};

const getNumberDownloads = async (owner: string, projectName: string) => {
  const result = await Github.request("GET /repos/{owner}/{repo}/releases", {
    owner: owner,
    repo: projectName,
  });
  const data = result.data;
  const newResult: GithubDowloadCount[] = parseDataNumberDownloads(data);

  return removeEmptyObject(newResult);
};

const parseDataNumberDownloads = (data: any[]) => {
  return data.map((item) => {
    const versionName = item.name;
    const assets = item.assets;

    const initialValue = {};
    return assets.reduce((_: any, asset: any) => {
      const assetDownloadCount = asset.download_count;
      return {
        name: versionName,
        count: assetDownloadCount,
      } as GithubDowloadCount;
    }, initialValue);
  });
};
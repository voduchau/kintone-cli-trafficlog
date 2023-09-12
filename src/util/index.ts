import path from "path";

export const getFilePath = (fileName: string) => {
  return path.resolve("./", fileName);
};

export const getURL = (domain: string) => {
  const urlFQDN = "https://" + domain;
  return typeof domain !== "undefined" && !domain.match(/https/)
    ? urlFQDN
    : domain;
};

export const getDayFromToDay = (customDate?: number, time?: boolean) => {
  const today = getToday();
  customDate && today.setDate(today.getDate() + customDate);

  const year = today.getFullYear();
  const month = `0${today.getMonth() + 1}`.slice(-2);
  const date = `0${today.getDate()}`.slice(-2);

  let lastday = `${year}-${month}-${date}`;

  if (time) {
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    lastday += ` ${hours}:${minutes}:${seconds}`;
  }

  return lastday;
};

export const mapTrafficLogsTokintoneRecords = (trafficLogs: TrafficLog[]) => {
  return trafficLogs.map((trafficLog) => {
    // const npmTrafficLog = trafficLog.npm;
    const githubCloneTrafficLog = trafficLog.clone as GithubResponseTraffic;
    const githubViewTrafficLog = trafficLog.view as GithubResponseTraffic;
    const githubDownloadCountLog = getGithubDownloadCountLog(
      trafficLog.dowloadCount
    );

    return {
      Project: {
        value: trafficLog.name,
      },
      // Download_Count_V0: {
      //   value: npmTrafficLog[0].downloads || 0,
      // },
      // Download_Count_V1: {
      //   value: npmTrafficLog[1].downloads || 0,
      // },
      Date: {
        value: trafficLog.date,
      },
      Clone_Count: {
        value: githubCloneTrafficLog.count || 0,
      },
      View_Count: {
        value: githubViewTrafficLog.count || 0,
      },
      Unique_Visitors: {
        value: githubViewTrafficLog.uniques || 0,
      },
      GH_Download_Count: {
        value: githubDownloadCountLog,
      },
    };
  });
};

export const printLog = (message: string) => {
  console.log("Log:", message);
};

export const getToday = () => {
  return new Date();
};

const getGithubDownloadCountLog = (
  githubDownloadCountLogs: GithubDowloadCount[]
) => {
  return githubDownloadCountLogs.map((item) => {
    const githubDownloadCountLog: GithubDowloadCountLog = {
      SUBTABLE_VERSION_NAME: { value: item.name },
      SUBTABLE_DOWNLOAD_COUNT: { value: item.count.toString() },
    };

    return { value: githubDownloadCountLog };
  });
};

export const removeEmptyObject = (array: any[]) => {
  return array.filter((item) => Object.keys(item).length);
};
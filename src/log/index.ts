import { unlinkSync } from "fs";
import { configure, getLogger, Logger, addLayout } from "log4js";
import { getDayFromToDay, printLog, getToday } from "../util/";
// import { getNumberDownloadsOfPackages } from "../service/npm";
import { setGithubConfig, getTrafficLogsONGithub } from "../service/github";

let fileLogPathGlobal = "";

export const getFileLogPath = () => {
  if (fileLogPathGlobal !== "") return fileLogPathGlobal;

  const today = getToday();
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(today);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
    today
  );
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(today);

  fileLogPathGlobal = `./log/system_${year}${month}${day}.log`;
  return fileLogPathGlobal;
};

export const refleshLog = (filePath: string) => {
  try {
    unlinkSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

export const createLog = (filePath: string, customError: CustomError) => {
  addLayout("custom", function () {
    return function (logEvent) {
      const logMessage = `[${formatDateTimeLog(logEvent.startTime)}] [${
        logEvent.level.levelStr
      }] ${logEvent.categoryName}:
${JSON.stringify(logEvent.data, undefined, 2)}`;
      return logMessage;
    };
  });

  configure({
    appenders: {
      system: {
        type: "file",
        filename: filePath,
        layout: { type: "custom" },
      },
    },
    categories: {
      default: { appenders: ["system"], level: "error" },
    },
  });

  const logger = getLogger("system");

  if (customError && typeof customError.response === "string") {
    logDebug(logger, customError);
    return;
  }

  fileLogPathGlobal = "";
  logger.error(customError);
  printLog(
    `There are errors. Please go to "${filePath}" to confirm. Thank you!`
  );
};

const formatDateTimeLog = (date: Date) => {
  const formatedDate = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return formatedDate;
};

export const closeLogs = (filePath: string) => {
  fileLogPathGlobal = "";
  printLog(`There are logs. Please go to "${filePath}" to confirm. Thank you!`);
};

const logDebug = (logger: Logger, customError: CustomError) => {
  logger.level = "debug";
  logger.debug(customError);
  printLog("Running...");
};

export const getTrafficLogs = (projects: ProjectsType, githubToken: string) => {
  const allPromise = [];
  for (const key in projects) {
    if (Object.prototype.hasOwnProperty.call(projects, key)) {
      const onwer = projects[key].GITHUB_OWNER;
      const projectName = projects[key].GITHUB_PROJECT_NAME;
    //   const npmPackages = projects[key].NPM_PACKAGES;

      setGithubConfig(githubToken);

      const promiseTrafficLogs = _getTrafficLogs(
        onwer,
        projectName,
        // npmPackages
      );

      allPromise.push(promiseTrafficLogs);
    }
  }

  return allPromise;
};

const _getTrafficLogs = async (
  owner: string,
  projectName: string,
//   npmPackages: string[]
) => {
  const dayForGettingData = getDayFromToDay(-1);

//   const numberDownloadsOfPackagesOnNPM = await getNumberDownloadsOfPackages(
//     dayForGettingData,
//     npmPackages
//   );


  const trafficLogOnGithub = await getTrafficLogsONGithub(
    dayForGettingData,
    owner,
    projectName
  );

  console.log(JSON.stringify(trafficLogOnGithub),'a')

  const trafficLog: TrafficLog = {
    name: projectName,
    date: dayForGettingData,
    // npm: numberDownloadsOfPackagesOnNPM,
    view: trafficLogOnGithub.view,
    clone: trafficLogOnGithub.clone,
    dowloadCount: trafficLogOnGithub.downloadCount,
  };

  return trafficLog;
};
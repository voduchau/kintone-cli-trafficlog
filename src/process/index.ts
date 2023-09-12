import {
    refleshLog,
    getTrafficLogs,
    createLog,
    getFileLogPath,
    closeLogs,
  } from "../log";
  import { PROJECTS } from "../config/constant";
  import { ERROR } from "../log/constant";
  import { kintoneClient } from "../service/kintone";
  import {
    getURL,
    getDayFromToDay,
    mapTrafficLogsTokintoneRecords,
    printLog,
  } from "../util";

  export const getProcess = (config: Config) => {
    const runningDay = getDayFromToDay(-1, true);
    const fileLogPath = getFileLogPath();

    return {
      run: () => {
        const timeLog = `Running on ${runningDay}`;
        printLog(timeLog);
        createLog(fileLogPath, {
          date: runningDay,
          response: timeLog,
        });

        if (!config.kintone || !config.githubToken) {
          createLog(fileLogPath, {
            date: runningDay,
            response: new Error(ERROR.CONFIG.CONFIGURATION_INVALID),
          });
          return;
        }
        const kintoneAuth = config.kintone;
        const githubToken = config.githubToken;
  
        refleshLog(fileLogPath);
  
        createLog(fileLogPath, {
          date: runningDay,
          response: "kintoneAuth",
          debug: kintoneAuth,
        });
        createLog(fileLogPath, {
          date: runningDay,
          response: "githubToken",
          debug: githubToken,
        });
  
        const trafficLogsPromises = getTrafficLogs(PROJECTS, githubToken);
  
        Promise.all(trafficLogsPromises)
          .then((resp) => {
            const records = mapTrafficLogsTokintoneRecords(resp);
            createLog(fileLogPath, {
              date: runningDay,
              response: "Map Traffic Logs to kintone app",
              debug: records,
            });
  
            return records;
          })
          .then(async (records) => {
            const domain = getURL(kintoneAuth.domain);
            const response = await kintoneClient(
              domain,
              kintoneAuth.apiToken,
              kintoneAuth.app
            ).addRecords(records);
  
            return response;
          })
          .then((response) => {
            createLog(fileLogPath, {
              date: runningDay,
              response: "kintone API Response",
              debug: response,
            });
            closeLogs(fileLogPath);
          })
          .catch((error) => {
            createLog(fileLogPath, {
              date: runningDay,
              response: error,
            });
          });
      },
    };
  };
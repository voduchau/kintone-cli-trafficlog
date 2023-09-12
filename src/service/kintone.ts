const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

export const kintoneClient = (
  domain: string,
  apiToken: string,
  app: string
) => {
  const client = new KintoneRestAPIClient({
    baseUrl: domain,
    auth: { apiToken: apiToken },
  });

  return {
    addRecords: (records: any[]) => {
      return client.record
        .addRecords({
          app: app,
          records: records,
        })
        .then((response: any) => {
          return response;
        })
        .catch((error: any) => {
          throw error;
        });
    },
  };
};
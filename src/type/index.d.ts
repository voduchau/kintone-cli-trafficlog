type Config = {
    kintone?: {
      app: string;
      domain: string;
      apiToken: string;
    };
    githubToken?: string;
  };
  
  type ProjectsType = {
    [project: string]: {
      GITHUB_OWNER: string;
      GITHUB_PROJECT_NAME: string;
    //   NPM_PACKAGES: string[];
    };
  };
  
  type GithubResponseTraffic = {
    timestamp?: string;
    uniques?: number;
    count?: number;
  };
  
  type NPMResponseTraffic = {
    downloads: number;
    start: string;
    end: string;
    package: string;
  };
  
  type GithubDowloadCount = {
    name: string;
    count: number;
  };
  
  type TrafficLog = {
    name: string;
    date: string;
    // npm: NPMResponseTraffic[];
    view: GithubResponseTraffic;
    clone: GithubResponseTraffic;
    dowloadCount: GithubDowloadCount[];
  };
  
  type CustomError = {
    date: string;
    response: Error | string;
    debug?: any;
  };
  
  type Option = {
    config: string;
  };
  
  type GithubDowloadCountLog = {
    SUBTABLE_VERSION_NAME: { value: string };
    SUBTABLE_DOWNLOAD_COUNT: { value: string };
  };
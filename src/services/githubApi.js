// @flow

class GithubRepositoryInfo {
  created_at: string;
  updated_at: string;
  watchers_count: number;
  topics: string[];

  constructor(data) {
    data = data || {};
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
    this.watchers_count = data.watchers_count || 0;
    this.topics = data.topics || [];
  }
}

// 1 day
const CACHE_INTERVAL = 24 * 60 * 60 * 1000;

const cacheResponse = (url, lastModified, data: GithubRepositoryInfo) => {
  let cachedItem = JSON.stringify({
    data: data,
    lastModified: lastModified,
    lastRequested: new Date().getTime()
  });
  localStorage.setItem(url, cachedItem);
};

const getRepositoryInfoFromCache = (url) => {
  let cache = localStorage.getItem(url);
  let info = JSON.parse(cache);
  return info.data;
};

const isLocalCacheStillValid = (lastRequested: number) => {
  return new Date().getTime() - new Date(lastRequested).getTime() < CACHE_INTERVAL;
};

const getFromAPIAndCacheResponse = (url, options, lastModified) => {
  options = options || {};
  if(!options.headers) {
    options.headers = new Headers();
  }

  if(lastModified) {
    options.headers.append('If-Modified-Since', lastModified);
  }

  return fetch(url, options || {})
    .then(response => {
      if(!response.ok) {
        return new GithubRepositoryInfo();
      }

      if(response.status === 200) {
        // Resource was changed, so update the cache
        let lastModified = response.headers.get('Last-Modified');
        return response.json().then((responseJson) => {
          cacheResponse(url, lastModified, responseJson);
          return responseJson;
        });
      }

      return getRepositoryInfoFromCache(url);
    })
    .catch((error) => {
      console.error(error);
    });
};

const getCachedResponse = (url, options) => {
  let cache = localStorage.getItem(url);
  if(!cache) {
    // If item isn't cached, call the API and cache it
    return getFromAPIAndCacheResponse(url, options);
  }

  // If item is already cached, check if we need to refresh
  let info = JSON.parse(cache);
  if(info.lastRequested && isLocalCacheStillValid(info.lastRequested)) {
    return getRepositoryInfoFromCache(url);
  }

  return getFromAPIAndCacheResponse(url, options, info.lastModified);
};

export default {

  /**
   * Retrieve Github project information (stargazers, date created etc)
   *
   * Send extra header to tell Github to also return "topics" for the repo
   * https://developer.github.com/v3/repos/#list-all-topics-for-a-repository
   * @param packageGithubRepo
   */
  getRepoDetails: (packageGithubRepo) => {
    return getCachedResponse(`https://api.github.com/repos/${packageGithubRepo}`, {
      headers: new Headers({
        "Accept": "application/vnd.github.mercy-preview+json"
      })
    });
  }
}
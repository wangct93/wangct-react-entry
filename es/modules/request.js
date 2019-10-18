import {message} from 'antd';
const {fetch} = window;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, options = {},alertError = true,validCode = true) {
  return requestBase(url,options)
    .then(parseJSON)
    .catch((error = {}) => {
      const message = error.message ? error.message : error;
      return {code:error.code || 500,message:message || '连接服务器失败！'};
    })
    .then(json => {
      if(!validCode){
        return json;
      }
      const isValidCode = isSuccess(json);
      if(!isValidCode && alertError){
        message.error(json.message);
      }
      return isValidCode ? Promise.resolve(json.data) : Promise.reject(json);
    });
}


export function requestBase(url,options){
  return fetch(url, formatOptions(options)).then(checkStatus);
}

function isSuccess(data){
  return data.code === 0;
}

function formatOptions(options){
  const {body} = options;
  if(body && !(body instanceof FormData)){
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      'content-type':'application/json'
    }
  }
  return options;
}

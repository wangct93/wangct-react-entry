const {fetch} = window;

/**
 * 请求方法
 * @param url
 * @param options
 * @returns {*}
 */
export default function request(url, options = {}) {
  options = formatOptions(options);
  const {json = true} = options;
  return fetch(url,options)
    .then(checkStatus)
    .then((res) => {
      return json ? res.json() : res;
    })
    .then(data => {
      const {validator = resValidator} = options;
      if(json && validator){
        return validator(data) ? resFormatter(data) : Promise.reject(data);
      }
      return data;
    });
}

let resValidator = data => data.code === 0;
let resFormatter = data => data.data;

/**
 * 设置返回成功响应
 * @param func
 */
export function setResValidator(func){
  resValidator = func;
}

/**
 * 设置返回成功数据格式化
 * @param func
 */
export function setResFormatter(func){
  resFormatter = func;
}

/**
 * 格式化选项
 * @param options
 * @returns {*}
 */
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

/**
 * 检测状态
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

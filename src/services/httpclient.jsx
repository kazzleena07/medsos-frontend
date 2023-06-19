import axios from 'axios'

export const BASE_URL = 'http://localhost:8080/api/';

const request = async function (options, isHeader = true, contentType, custom_url = BASE_URL) {
  let authToken = null
  let header = null
  if (isHeader) {
    authToken = localStorage.getItem("token")
    header = {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": contentType
    }
  } else {
    header = {
      "Content-Type": contentType
    }
    // header = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8; application/json;" }
  }

  let optDefault = {
    baseURL: custom_url,
    headers: header,
    timeout: 60000,
    maxContentLength: 150 * 1000 * 1000,
  }

  const client = axios.create(optDefault);

  const onSuccess = function (response) {
    return response.data
  }

  const onError = function (error) {
    return Promise.reject(error.response || error.message)
  }

  return client(options).then(onSuccess).catch(onError)

}

export default request
import request from './httpclient'

function callApi(isHeader = true, contentType, urlParam, methodParam, param, responseType = null) {
    if (responseType != null) {
        return request({
            url: urlParam,
            method: methodParam,
            data: param,
            responseType: responseType
        }, isHeader, contentType)
    }
    else {
        return request({
            url: urlParam,
            method: methodParam,
            data: param
        }, isHeader, contentType)
    }
}

const CommonServices = {
    callApi
}

export default CommonServices
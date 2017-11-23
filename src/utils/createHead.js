const CryptoJS = require("crypto-js");
import config from  "./../../config";
/*const {getTOKEN, getSTAMP} = require('./utils');*/


function create_AUTH_SIGN(stamp) {
  const _msg = [stamp,stamp].join(':');

  let _result = CryptoJS.HmacMD5(_msg, config.SecretKey);
  return _result.toString();
}
function create_TOKEN_SIGN(token,stamp) {
  const _msg = [token,stamp,stamp].join(':');
  let _result = CryptoJS.HmacMD5(_msg, config.SecretKey);
  return _result.toString();
}

function create_Head(type) {
  const stamp = new Date()*1;
  let _result = {
    'X-APP-KEY': config.AccessKey,
    'X-MSG-ID': [stamp,stamp].join(','),
  };
  let _sign =null;
  if(type === 'X-AUTH') {
    _sign = create_AUTH_SIGN(stamp);
    _result[type] = [_sign].join(','); // [_sign,'publisher'].join(',')
  } else {
    const token = config.accessToken(); //
    _sign = create_TOKEN_SIGN(token,stamp);
    _result[type] = [token,_sign].join(',');
  };
  return _result;
};

module.exports = create_Head;

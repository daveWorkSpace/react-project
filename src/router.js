/**
 * Created by dave 2017/4/19
 * router center
 *
 * */
import React, { PropTypes } from 'react';
import { Router, Route } from 'dva/router';
const routes = require('./routes/router');

// 路由中心
export default function ({ history }) {
  return (
    <Router routes={routes} history={history} />
  );
}


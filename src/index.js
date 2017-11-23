import dva from 'dva';
import { createHashHistory } from 'history';
import { browserHistory, hashHistory, useRouterHistory } from 'dva/router';
import createLoading from 'dva-loading';
import './index.html';
import './index.css';
import "antd/dist/antd.css";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 1. Initialize
const app = dva({
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  ...createLoading(),
  onError (error) {
    console.error('app onError', error);
  }
});

// 2. Plugins
app.use(createLoading({
  effects: true,
}));

// 3. Model
app.model(require('./models/login'));
app.model(require('./models/public'));
app.model(require('./models/business'));
app.model(require('./models/system'));
app.model(require('./models/upload'));
app.model(require('./models/employee'));
app.model(require('./models/stores'));
app.model(require('./models/finance'));
app.model(require('./models/salary'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

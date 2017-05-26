import './../src-common-wp/scripts-es6/common/constants/global';
import angularRoute from 'angular-route';
import angularSanitize from 'angular-sanitize';
import angularCookies from 'angular-cookies';
import angularAnimate from 'angular-animate';
import angularLoadingBar from 'angular-loading-bar';
import angularBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import angularFileUploadModule from 'angular-file-upload/src/config.json';
import ngCsv from 'ng-csv/src/ng-csv/ng-csv';
import highchartsNg from 'highcharts-ng';
import 'angular-file-upload/src/index';

import {tkgCommonModule} from './../src-common-wp/scripts-es6/common/common.index';
import './styles/index.scss';

export const app = 'app';

angular.module(app, [
  angularAnimate,
  angularRoute,
  angularSanitize,
  angularCookies,
  angularLoadingBar,
  angularBootstrap,
  angularFileUploadModule.name,
  toastr,
  ngCsv,
  highchartsNg,
  tkgCommonModule,
  ranger,
  scout,
  sentinalModule
]);

$(document).ready(() => {
  angular.bootstrap(document, [app]);
});

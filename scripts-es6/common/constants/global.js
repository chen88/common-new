// // import $ from 'jquery';
// import 'jquery';
// import _ from 'lodash';
// import moment from 'moment';
// import 'moment-timezone';
// import 'moment-business';
// import Highcharts from 'highcharts';

// _.extend(window, {
//   // $,
//   _,
//   moment,
//   Highcharts
// });

// // window.jQuery = $;

// import angular from 'angular';

// window.angular = angular;

import 'jquery';
import 'lodash';
import 'moment';
import 'moment-timezone';
import 'moment-business';
import highcharts from 'highstock-release/highstock';
import highchartsMore from 'highstock-release/highcharts-more';
import highchartExport from 'highstock-release/modules/exporting';
import 'angular';

highchartsMore(highcharts);
highchartExport(highcharts);

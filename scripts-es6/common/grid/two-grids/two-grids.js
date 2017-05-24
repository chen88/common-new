/**
 * A side grid that display info and additional single scrollable grid, that loads templates from $rootScope.gridTemplate
 */
export function tkgTwoGrids (tkgConfig) {
  return {
    restrict: 'E',
    template: require('./two-grids.jade'),
    link: function ($scope, element, attrs) {
      var templates = angular.copy(tkgConfig.getGridList());
      $scope.gridTemplate = templates.slice(1);
      $scope.gridTemplate.primaryLeftGrid = templates.slice(0, 1);
    }
  };
}

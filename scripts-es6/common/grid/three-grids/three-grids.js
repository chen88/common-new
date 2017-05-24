export function tkgThreeGrids (tkgConfig) {
  return {
    restrict: 'E',
    template: require('./three-grids.jade'),
    scope: false,
    link: function ($scope, element, attrs) {
      $scope.gridTemplate = tkgConfig.getThreeGrids();
    }
  };
}

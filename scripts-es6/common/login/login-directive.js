export function tkgStickyHeader () {
  return {
    restrict: 'E',
    transclude: true,
    template: require('./login-sticky-header.jade')
  };
}

export function tkgScrollBody () {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var delay = tkgConst.timeout.highchart;
      var watchDelay = attrs.noDelay ? 50 : delay;
      var watch = attrs.watch;
      var watchCollection = attrs.watchCollection;
      var counter;
      var parentElement = element.parents(attrs.tkgScrollBody);
      var subtractHeight = a.$interpolate(attrs.subtract)($scope) || 0;
      var omitElement = attrs.subtractElement;
      var ignoreHeight = attrs.tkgScrollBody === '.panel' ? tkgConst.size.panelHeading : 0;

      element.addClass('overflow');

      function setHeight (_delay) {
        if(_delay === undefined) {
          _delay = delay;
        }
        a.$timeout.cancel(counter);
        counter = a.$timeout(function () {
          setElementHeight();
        }, _delay);
      }

      function setElementHeight () {
        if(parentElement.height() < ignoreHeight) {
          return;
        }
        let additionalOmitHeight = 0
        if(omitElement) {
          additionalOmitHeight = $(omitElement).height();
        }
        let height = parentElement.height() - subtractHeight - additionalOmitHeight - (element.outerHeight() - element.height());
        element.height(height);
        if(element[0].scrollHeight > element.height()) {
          $scope.hasScrollbar = true;
        } else {
          $scope.hasScrollbar = false;
        }
      }

      // function init () {
      //   setHeight();
      // }
      setHeight();
      // window.setTimeout(init, delay);

      $scope.$on('manualResized', setHeight);
      tkgConst.bindEvent($(window), 'resize', setHeight, $scope);

      if(watch) {
        $scope.$watch(watch, function () {
          setHeight(watchDelay);
        });
      }
      if(watchCollection) {
        $scope.$watchCollection(watchCollection, function () {
          setHeight(watchDelay);
        });
      }
    }
  };
}

export let injector = angular.injector(['ng']);

// setTimeout(() => {
//   _.assign(injector, $('html').injector());
// }, 1000);

window.injector = injector;

setTimeout(() => {
  window.injector = $('body').injector();
}, 2000);

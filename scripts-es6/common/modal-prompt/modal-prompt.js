export class modalPrompt {
  constructor ($uibModal) {
    this.$uibModal = $uibModal;
  }
  open (msg, body) {
    return this.$uibModal.open({
      template: require('./modal-prompt.jade'),
      size: 'sm',
      controllerAs: 'vm',
      windowClass: 'fit-modal',
      controller: function ($scope, $uibModalInstance) {
        this.msg = msg;
        this.body = body;
        function confirm (e) {
          if(e.keyCode === 13) {
            $uibModalInstance.close();
          }
        }
        let docEle = $(document);
        docEle.on('keypress', confirm);
        $scope.$on('$destroy', function () {
          docEle.off('keypress', confirm);
        })

      }
    }).result;
  }
}

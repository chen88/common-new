export class RadioList {
  constructor (list) {
    this.list = [];
    this.addFromList(list);
  }
  add (name, flag) {
    let option = _.find(this.list, {name});
    if(option) {
      return option;
    }
    option = {
      name,
      value: name,
      isChecked: typeof flag === 'boolean' ? flag : true
    };
    this.checkedOption = option;
    this.checkedVal = name;
    this.list.push(option);
    return option;
  }
  addFromList (list) {
    this.list.length = 0;
    list = angular.copy(list);
    if(typeof _.first(list) === 'string') {
      list = _.map(list, (name) => {
        return this.add(name);
      });
    }
    this.list.push.apply(this.list, list);
    let checkedOption = _.find(this.list, {isChecked: true});
    if(checkedOption) {
      this.checkedVal = checkedOption.name;
      this.checkedOption = checkedOption;
    } else {
      this.checkedVal = null;
      this.checkedOption = null;
    }
  }
  selectFirst () {
    this.select(_.first(this.list));
  }
  select (option, skipDeselect) {
    if(!skipDeselect) {
      this.deselectAll(true);
    }
    option.isChecked = true;
    this.checkedOption = option;
    this.checkedVal = option.name;
  }
  selectByValue (value) {
    let foundOption = this.find(value);
    if(foundOption) {
      this.select(foundOption);
    }
  }
  selectBySafeValue (value) {
    let foundOption = this.findSafeValue(value) || this.find(value);
    if(foundOption) {
      this.select(foundOption);
    }
  }
  find (value) {
    return _.find(this.list, {value});
  }
  findSafeValue (value) {
    return _.find(this.list, {safeValue: value});
  }
  deselectAll (all) {
    _.forEach(this.list, (option) => {
      option.isChecked = false;
    });
    this.checkedVal = null;
    this.checkedOption = null;
    let firstOption = _.first(this.list);
    if(!all && firstOption && !firstOption.value) {
      this.select(firstOption, true);
    }
  }
  getCheckedOptionName () {
    return _.get(_.find(this.list, {name: this.checkedVal}), 'name');
  }
  getCheckedOptionVal () {
    return _.get(_.find(this.list, {name: this.checkedVal}), 'value');
  }
  getCheckedList () {
    return _.filter(this.list, (obj) => {
      return obj.isChecked && obj.value;
    });
  }
  getCheckedListValue () {
    let checkedListValue = _.map(this.getCheckedList(), 'value');
    return checkedListValue;
  }
  getSafeCheckedListValue () {
    let checkedListValue = this.getCheckedListValue();
    if(!_.isEmpty(checkedListValue)) {
      let firstOption = _.first(this.list);
      if(firstOption.safeValue) {
        return _.map(this.getCheckedList(), 'safeValue');
      }
    }
    return checkedListValue;
  }
  getCheckedListName () {
    return _.map(this.getCheckedList(), 'name');
  }
  getStringName () {
    return this.getCheckedListName().join(', ');
  }
  hasCheckedList () {
    return !_.isEmpty(this.getCheckedList());
  }
}

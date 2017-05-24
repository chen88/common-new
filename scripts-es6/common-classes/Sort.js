export class SortKey {
  constructor (value) {
    if(typeof value === 'string') {
      this.value = value;
      this.name = tkgFilter.filterCamelSplitString(value);
    } else {
      _.assign(this, value);
    }
    this.sortKey = value.sortKey || this.value;
    this.order = null;
    this.orderName = null;
    this.class = null;
  }
  deselect () {
    this.order = null;
  }
  clear () {
    this.order = null;
    this.orderName = null;
    this.class = null;
  }
  trigger () {
    let order = this.order || this.defaultSort;
    this.order = order === '+' ? '-' : '+';
    this.orderName = order === '+' ? 'asc' : 'desc';
  }
  asc () {
    this.order = '+';
    this.orderName = 'asc';
    this.class = 'fa-arrow-up';
  }
  desc () {
    this.order = '-';
    this.orderName = 'desc';
    this.class = 'fa-arrow-down';
  }
  isAsc () {
    return this.orderName === 'asc';
  }
  isDesc () {
    return this.orderName === 'desc';
  }
  getSort () {
    return this.order + this.sortKey;
  }
  getSortClass () {
    if(this.order === '-') {
      return 'fa-arrow-down';
    } else if(this.order === '+') {
      return 'fa-arrow-up';
    }
    return null;
  }
}

export class SortingList {
  constructor (list) {
    this.list = _.map(list, (sortKey) => {
      return new SortKey(sortKey);
    });

    this.sortingList = [];
    this.config = {
      containment: '.panel-body',
      helper: 'clone',
      axis: 'y',
      start: (e, ui) => {
        ui.helper.addClass('active sort-dragging');
      },
      update: () => {
        a.$rootScope.$broadcast('updateSort');
      }
    };
  }
  find (value) {
    return _.find(this.list, {value});
  }
  getCheckedListValue (copy) {
    return copy ? angular.copy(this.sortingList) : this.sortingList;
  }
  addSort (sortKey) {
    if(_.find(this.sortingList, {value: sortKey.value})) {
      _.remove(this.sortingList, {value: sortKey.value});
    }
    this.sortingList.push(sortKey);
  }
  removeSort (sortKey) {
    sortKey.clear();
    _.remove(this.sortingList, {value: sortKey.value});
  }
  deselectAll () {
    _.forEach(this.sortingList, (sortKey) => {
      sortKey.clear();
    });
    this.sortingList.length = 0;
  }
  setSort (sortKey) {
    let foundSortKey = _.find(this.list, {value: sortKey.value});
    if(foundSortKey) {
      _.merge(foundSortKey, sortKey);
      this.addSort(foundSortKey);
    }
  }
  sortSingle (sortKey) {
    _.forEach(this.sortingList, (_sortKey) => {
      if(_sortKey.value !== sortKey.value) {
        _sortKey.deselect();
      }
    });
    this.sortingList.length = 0;
    this.addSort(sortKey);
  }
  /**
   * [triggerSort description]
   * First click, asc
   * 2nd click, desc
   * 3rd click, remove
   */
  triggerSort (sortKey) {
    if(sortKey.isAsc()) {
      sortKey.desc();
    } else if(sortKey.isDesc()) {
      this.removeSort(sortKey);
    } else {
      sortKey.asc();
      this.addSort(sortKey);
    }
  }
  getSortingOrder () {
    let sort = [];
    if(_.isEmpty(this.sortingList)) {
      return sort;
    }
    _.forEach(this.sortingList, (sortKey) => {
      sort.push(sortKey.getSort());
    });
    return sort;
  }
  getExpandClass () {
    if(!this.sortingList.length) {
      return 'hide';
    }
    let count = this.sortingList.length > 5 ? 5 : this.sortingList.length;
    return `expand expand-${count}`;
  }
  getCompressedClass () {
    let count = this.sortingList.length > 5 ? 5 : this.sortingList.length;
    return `compressed-${count}`;
  }
  getStringName () {
    return _.map(this.sortingList, 'name').join(', ');
  }
}

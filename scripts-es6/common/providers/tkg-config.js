let _gridTemplates = {
  primaryLeftGrid: '',
  primaryRightGrid: '', //optional
  secondaryTopGrid: '',
  tiertaryLeftGrid: '',
  tiertaryRightGrid: ''
};

let _threeGrid = {
  top: '',
  bottomLeft: '',
  bottomRight: ''
};

let _gridList = [];

let _gridListObj = {};

let _hGridList = [];

let _hParallelGridList = {};

let _hGridListObj = {};

let _oneGrid = '';

let _url = {
  apiUrl: '',
  ranger: '',
  sentinel: '',
};

let convertStringToObj = (list) => {
  list = _.map(list, (template) => {
    return typeof template === 'string' ? {template: template} : template;
  });
  return list;
};

let setGridListObj = (gridListObj, gridList, overwrite) => {
  if(overwrite) {
    _.forEach(gridList, (list, key) => {
      list = convertStringToObj(list);
      gridListObj[key] = list;
    });
  } else {
    _.merge(gridListObj, gridList);
    _.forEach(gridListObj,  (list, key) => {
      list = _.uniq(list);
      list = convertStringToObj(list);
      gridListObj[key] = list;
    });
  }
}

export class tkgConfig {
  setGridTemplate (gridTemplate) {
    _gridTemplates = gridTemplate;
  }
  setGridList (gridList) {
    _gridList = convertStringToObj(gridList);
  }
  setGridListObj (gridList, overwrite) {
    setGridListObj(_gridListObj, gridList, overwrite);
  }
  setHGridList (gridList) {
    _hGridList = gridList;
  }
  setHParallelGridList (gridList) {
    _hParallelGridList = gridList;
  }
  setHGridListObj (gridList, overwrite) {
    setGridListObj(_hGridListObj, gridList, overwrite);
  }
  setOneGrid (gridTemplate) {
    _oneGrid = gridTemplate;
  }

  setThreeGrids (gridTemplate) {
    _threeGrid = gridTemplate;
  };

  setApiUrl (apiUrl) {
    _url.apiUrl = apiUrl;
  }
  setRangerApiUrl (apiUrl) {
    _url.ranger = apiUrl;
  }

  setSentinelApiUrl (apiUrl) {
    _url.sentinel = apiUrl;
  }

  getGridTemplate () {
    return _gridTemplates;
  }
  getGridList () {
    return _gridList;
  }
  getGridListObj () {
    return _gridListObj;
  }
  setGridListSize (grid) {
    _.find(_gridList, {id: grid.id}).height = grid.height;
  }

  getHGridList () {
    return _hGridList;
  }

  getHParallelGridList () {
    return _hParallelGridList
  }

  getHGridListObj () {
    return _hGridListObj;
  }

  setHGridSize (grid) {
    _.find(_hGridListObj[grid.position], {id: grid.id}).width = grid.width;
  }

  getOneGrid () {
    return _oneGrid;
  }

  getThreeGrids () {
    return _threeGrid;
  }

  setApiUrl (apiUrl) {
    _url.apiUrl = apiUrl;
  }
  setRangerApiUrl (apiUrl) {
    _url.ranger = apiUrl;
  }

  setSentinelApiUrl (apiUrl) {
    _url.sentinel = apiUrl;
  }

  getApiUrl () {
    return _url.apiUrl;
  }
  getRangerApiUrl () {
    return _url.ranger;
  }
  getSentinelApiUrl () {
    return _url.sentinel;
  }
  $get () {
    return new tkgConfig();
  }
}

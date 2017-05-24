import {ScrolableTableBody} from './scrollable-table-body';
import {ScrollableTableResize} from './scrollable-table-resize';

/**
 * table(
 *  scrollable-table-s
 *  head-data="headData"
 *  body-data="bodyData"
 *  parent=".panel"
 *  subtract="15")
 */
let tkgConst = window.tkgConst;
let bindEvent = tkgConst.bindEvent;
let delay = tkgConst.timeout.scrollableTable;
let hPadding = tkgConst.size.horizontalCellPadding * 2;
let borderSize = tkgConst.size.cellBorder;
let scrollbarSize = tkgConst.size.defaultScrollbar;
let thWidth = tkgConst.size.thWidth;
let _prepareWindowEvents;
let numberOfRows = tkgConst.numberOfRows;
let _$compile;

class ScrollableTableCtrl extends ScrollableTableResize {
  constructor () {
    super();
    this.table = null;
    this.headData = null;
    this.tableHeaderRow = null;
    this.tableBody = null;
    this.bodyData = [];
    this.tableBodyClass = new ScrolableTableBody();
    this.headerCells = [];
    this.nonFixedHeaderCells = [];
    this.nonFixedCellLength = 0;
  }
  tableScroll () {
    this.tableHeaderRow.css({
      left: -1 * this.tableBody.scrollLeft() + 'px'
    });
  }
  initializeTable ($scope, table, attrs) {
    this.$scope = $scope;
    this.tableBodyClass.setScope($scope);
    this.table = table;
    this.tableAttrs = attrs;
    this.bodyReduction = tkgConst.size.panelHeading + tkgConst.size.tableHead + (attrs.subtract || 0);
    this.parent = attrs.parent ? table.parents(attrs.parent) : table.parents('.panel');
    this.numberOfRows = attrs.numberOfRows || numberOfRows;
    table.addClass('scrollable-table stripe');
    let headData = $scope.$eval(attrs.headData);
    this.initBody();
    this.initHead(headData);
    this.tableChildren = table.children();
  }
  /**
   *
   * @param {Object} headData
   *  @property {string} name
   *  @property {*} value
   *  @property {Object} style
   */
  initHead (headData) {
    this.tableHeaderRow = $('<tr></tr>');
    let tableHeader = $('<thead></thead>');
    tableHeader.append(this.tableHeaderRow);
    this.table.prepend(tableHeader);
    this.initializeHeaderCells(headData);
  }
  getCellContentWidth (h) {
    let style = h.style || {};
    let minWidth = style.minWidth || style.width;
    if(!minWidth) {
      style.width = thWidth;
      style.minWidth = thWidth;
      h.style = style;
    }
    let cellContentWidth = parseInt(minWidth) - hPadding;
    return cellContentWidth;
  }
  initializeHeaderCells (headData) {
    this.headData = [];
    let tableHeaderRow = this.tableHeaderRow;

    this.headNgAttrs = {};
     _.forEach(this.tableAttrs, (attr, attrKey) => {
      if(/^headNg/.test(attrKey)) {
        this.headNgAttrs[attrKey] = attr;
      }
    });
    this.changeHead(headData);
  }
  changeHead (headData) {
    // // filter out removed columns
    // headData = _.filter(headData, (col) => {
    //   return !col.unchecked;
    // });
    let currentHeadLength = this.headData.length;
    let newHeadLength = headData.length;
    let difference = currentHeadLength - newHeadLength;
    if(currentHeadLength > newHeadLength) {
      let headerCells = this.tableHeaderRow.find(`td:gt(${currentHeadLength})`);
      let bodyCells = this.table.find(`tr td:gt(${currentHeadLength})`);
      headerCells.remove();
      bodyCells.remove();
    } else if(currentHeadLength < newHeadLength) {
      difference = Math.abs(difference);
      for(let i = 0; i < difference; i++) {
        this.insertColumn(currentHeadLength + i);
      }
    }
    this.headData = headData;
    let headerCells = this.headerCells = this.tableHeaderRow.children();
    let bodyRows = this.tableBody.children();

    _.forEach(headData, (h, i) => {
      // set header
      let cellContentWidth = this.getCellContentWidth(h);
      let style = h.style;
      let headerCell = headerCells.eq(i);
      let headerCellScope = headerCell.scope();
      headerCellScope.columnData = h;
      let headerCellContent = headerCell.children().first();
      headerCellContent
        .css({
          width: cellContentWidth,
          minWidth: cellContentWidth
        })
        .empty()
        .append(h.name)
      headerCell
        .removeAttr('style')
        .attr('title', h.name)
        .css(style);

      // set sorting
      if(h.sortKey) {
        headerCellContent.append(`<i class="fa" ng-class="columnData.sortKey.getSortClass()"></i>`);
      } else if(h.sortClass) {
        headerCellContent.append(`<i class="fa" ng-class="${h.sortClass}"></i>`);
      }

      // set column resizer
      this.addColumnResizer(headerCell);
      // set column swapper
      if(this.tableAttrs.hasOwnProperty('swappableColumn')) {
        this.addColumnSwapper(headerCell);
      }
      // // set column remover
      // if(this.tableAttrs.hasOwnProperty('removeableColumn')) {
      //   this.addColumnRemover(headerCell);
      // }

      _$compile(headerCellContent)(headerCellScope);

      // set body
      _.forEach(bodyRows, (row, j) => {
        let bodyCell = $(row).children().eq(i);
        let bodyCellContent = bodyCell.children().first();
        bodyCellContent
          .css({
            width: cellContentWidth,
            minWidth: cellContentWidth
          });
      });
    });

    this.updateNonFixedHeaderCells(headData);
  }
  updateNonFixedHeaderCells (headData) {
    let nonFixedCellLength = 0;
    let leastMinWidth = 0;
    this.nonFixedHeaderCells = _.map(this.headerCells, (cell, i) => {
      let isNotFixed = _.isEmpty(_.get(headData[i], 'style.maxWidth'));
      let minWidth = _.get(headData[i], 'style.minWidth');
      leastMinWidth += parseInt(minWidth);
      if(isNotFixed) {
        nonFixedCellLength ++;
        return this.headerCells[i];
      }
      return null;
    });
    this.nonFixedCellLength = nonFixedCellLength;
    this.leastMinWidth = leastMinWidth;
  }
  initBody () {
    let tableBody = this.tableBody = $('<tbody></tbody>');
    let $scope = this.$scope;
    let tableAttrs = this.tableAttrs;
    this.table.append(tableBody);
    let tableRow;
    this.rowNgAttrs = {};
     _.forEach(tableAttrs, (attr, attrKey) => {
      if(/^rowNg/.test(attrKey)) {
        this.rowNgAttrs[attrKey] = attr;
      }
    });
    for(let i = 0; i < this.numberOfRows; i++) {
      let rowNum = i;
      tableRow = this.createTableRow(i);
      _.forEach(this.headData, (h) => {
        let style = h.style;
        let width = parseInt(style.width);
        let cellContentWidth = width - hPadding;
        let cellContent = $('<div></div>');
        cellContent.css({
          width: cellContentWidth,
          minWidth: cellContentWidth
        });
        let bodyCell = $('<td></td');
        bodyCell.append(cellContent);
        tableRow.append(bodyCell);
      });
      tableBody.append(tableRow);
    }
    this.tableBodyClass.initTableBody(tableBody);

  }
  createTableRow (i) {
    let tableRow = $('<tr class="hide"></tr>');
    let tableAttrs = this.tableAttrs;
    _.forEach(this.rowNgAttrs, (ngAttr, ngAttrKey) => {
      let rowAttrKey = tableAttrs.$attr[ngAttrKey].replace('row-', '');
      tableRow.attr(rowAttrKey, ngAttr);
    });
    let tableRowClick = (e) => {
      this.selectedRow = this.bodyData[i];
      this.selectedRowIndex = i;
    };
    let $tableRowScope = this.$scope.$new();
    tkgConst.bindEvent(tableRow, 'click', tableRowClick, $tableRowScope);
    _$compile(tableRow)($tableRowScope);
    return tableRow;
  }
  insertColumn (i) {
    let head = $('<th><div></div></th>');
    let tableAttrs = this.tableAttrs;
    _.forEach(this.headNgAttrs, (ngAttr, ngAttrKey) => {
      let headAttrKey = tableAttrs.$attr[ngAttrKey].replace('head-', '');
      head.attr(headAttrKey, ngAttr);
    });
    let tableHeadClick = (e) => {
      this.selectedHead = this.headData[i];
    };
    let $tableHeadScope = this.$scope.$new();
    tkgConst.bindEvent(head, 'click', tableHeadClick, $tableHeadScope);
    _$compile(head)($tableHeadScope);

    this.tableHeaderRow.append(head);
    this.tableBody.children().each(function () {
      $(this).append('<td><div></div></td>');
    });
  }

  setBodyCells (bodyData) {
    let tableBodyClass = this.tableBodyClass;
    if(_.isEmpty(bodyData)) {
      tableBodyClass.hideRows(0, this.bodyData.length);
    } else if(this.bodyData.length > bodyData.length) {
      tableBodyClass.hideRows(bodyData.length, this.bodyData.length);
    } else if (this.bodyData.length < bodyData.length) {
      tableBodyClass.showRows(this.bodyData.length, bodyData.length);
    }
    if(_.get(bodyData, 'length')) {
      let headData = this.headData;
      _.forEach(bodyData, (data, row) => {
        tableBodyClass.setRow(headData, data, row);
      });
    }

    this.resizeTable();
    this.bodyData = angular.copy(bodyData);
  }
  clearHeaderRow () {
    this.tableHeaderRow.empty();
  }
  tableScroll () {
    this.tableHeaderRow.css({
      left: -1 * this.tableBody.scrollLeft() + 'px'
    });
  }
}

export function ScrollableTableS (prepareWindowEvents, $compile) {
  _$compile = $compile
  _prepareWindowEvents = prepareWindowEvents;
  return {
    restrict: 'A',
    scope: true,
    controller: ScrollableTableCtrl,
    controllerAs: 'tableCtrl',
    link: ($scope, element, attrs, tableCtrl) => {
      tableCtrl.initializeTable($scope, element, attrs);

      tkgConst.bindEvent(tableCtrl.tableBody, 'scroll', () => {
        tableCtrl.tableScroll();
      }, $scope);

      let resizeTable = () => {
        tableCtrl.resizeTable();
      }
      resizeTable();
      prepareWindowEvents($scope, resizeTable);
      $scope.$on('manualResized', resizeTable);

      $scope.$watch(attrs.headData, (headData, prev) => {
        if(prev) {
          tableCtrl.changeHead(headData);
        }
      });

      $scope.$watch(
        attrs.bodyData,
        function (bodyData, prevBodyData) {
        if(bodyData) {
          tableCtrl.setBodyCells(bodyData);
        }
      }, true);

      $scope.$on('$destroy', () => {
        tableCtrl.clearHeaderCells();
      });
    }
  }
}

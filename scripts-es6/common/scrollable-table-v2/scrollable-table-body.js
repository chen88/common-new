let $compile;
export class ScrolableTableBody {
  constructor () {
    $compile = a.$compile;
    this.tableBody = null;
    this.tableBodyRows =  null;
    this.tableChildren = null;
  }
  setScope ($tableScope) {
    this.$tableScope = $tableScope;
  }
  initTableBody (tableBody, isolatedRow) {
    this.tableBody = tableBody;
    this.isolatedRow = isolatedRow;
    this.tableBodyRows = this.tableChildren =  tableBody.children();
  }
  hideRows (from, to) {
    this.tableBodyRows.slice(from, to).addClass('hide');
  }
  showRows (from, to) {
    this.tableBodyRows.slice(from, to).removeClass('hide');
  }
  setRow (headData, rowData, row) {
    let tableRow = $(this.tableBodyRows[row]);
    let tableRowScope = tableRow.scope();
    tableRowScope.rowData = rowData;
    tableRow.children().each((i, cell) => {
      cell = $(cell);
      cell.removeClass();
      let cellContent = cell.children().first().empty();
      let head = headData[i];
      let cellData = _.get(rowData, head.value);

      // formatting cell displayed content
      if(head.filter) {
        cellData = head.filter(cellData);
      } else if (head.percent) {
        cellData = tkgFilter.filterPercentage(val, head.decimal || 2);
      } else if(head.decimal !== undefined) {
        cellData = tkgFilter.filterFormatNumber(cellData, head.decimal);
      }

      // adding cell classes
      if(isNaN(cellData) || head.textRight === false) {
        cellContent.removeClass('text-right');
      } else if(!isNaN(cellData) || head.textRight === true) {
        cellContent.addClass('text-right');
      }
      if(head.cellClasses) {
        head.cellClasses(cell, cellData);
      }
      if(head.defaultClasses) {
        cell.addClass(head.defaultClasses);
      }
      cellContent.html(cellData);
      $compile(cellContent)(tableRowScope);
    });

    // tableRow.off(click, this.rowClick)
  }
}

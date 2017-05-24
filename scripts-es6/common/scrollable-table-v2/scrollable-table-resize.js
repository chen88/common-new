import {ScrollableTableColumnResize} from './scrollable-table-column-resize';

let tkgConst = window.tkgConst;
let bindEvent = tkgConst.bindEvent;
let delay = tkgConst.timeout.scrollableTable;
let hPadding = tkgConst.size.horizontalCellPadding * 2;
let borderSize = tkgConst.size.cellBorder;
let scrollbarSize = tkgConst.size.defaultScrollbar;
let thWidth = tkgConst.size.thWidth;
let _prepareWindowEvents;
let numberOfRows = tkgConst.numberOfRows;

export class ScrollableTableResize extends ScrollableTableColumnResize {
  constructor () {
    super();
    this.tableCounter = null;
    this.headerCounter = null;
  }
  resizeTable () {
    clearTimeout(this.tableCounter);
    clearTimeout(this.headerCounter);
    this.tableCounter = setTimeout(() => {
      // this.hasScrollbar = this.bodyData.length * 25 > this.tableBody.height() && this.tableBody[0].scrollWidth !== this.tableBody.width();
      this.hasScrollbar = this.bodyData.length * 25 > this.tableBody.height();
      let tableWidth = this.table.width();
      let tableBodyHeight = this.parent.height() - this.bodyReduction;
      this.tableChildren.width(tableWidth);
      this.tableBody.height(tableBodyHeight);

      this.headerCounter = setTimeout(() => {
        this.resizeCells();
      }, delay);
    }, delay);
  }
  resizeCells () {
    let headerCells = this.headerCells;
    let totalHeaderCellWidth = 0;
    let individualHeaderCellWidth = [];

    headerCells.children('.col-resize').css('left', 'auto');
    headerCells.each((i, headerCell) => {
      headerCell = $(headerCell);
      let width = headerCell.outerWidth();
      totalHeaderCellWidth += width;
      individualHeaderCellWidth.push(width);
    });

    let tableWidth = this.table.width();
    let widthDifference = tableWidth - totalHeaderCellWidth;
    let additionalLength = widthDifference;
    let nonFixedCellLength = this.nonFixedCellLength;

    this.hasScrollbar = this.hasScrollbar && totalHeaderCellWidth > this.leastMinWidth;

    if(this.hasScrollbar) {
      additionalLength -= scrollbarSize;
    }

    let splitAdditionalLength = additionalLength / nonFixedCellLength;
    let decimal = splitAdditionalLength % 1;
    let skip = Math.ceil(1 / decimal);
    if(skip > nonFixedCellLength) {
      skip = 0;
    }

    if(Math.abs(additionalLength) < 1) {
      splitAdditionalLength = 0;
      skip = 0;
    }

    let step = 0;
    _.forEach(this.nonFixedHeaderCells, (headerCell, i) => {
      if(!headerCell) {
        return;
      }
      step ++;
      let currentSplitAdditionalLength = Math.floor(splitAdditionalLength);
      if(skip > 0 && (step / skip) % 1 === 0) {
        currentSplitAdditionalLength = Math.ceil(splitAdditionalLength);
      }
      let isFirstCell = i === 0;
      let newWidth = individualHeaderCellWidth[i] + currentSplitAdditionalLength;
      if(!isFirstCell) {
        newWidth -= borderSize;
      }
      let restrictedWidth = this.resizeColumn(i, newWidth);
    });
    // this.resizeLastNonFixedColumn();
  }
  resizeLastNonFixedColumn () {
    let rowWidth = this.tableBodyClass.tableBodyRows.eq(0).width();
    if(!rowWidth) {
      return;
    }
    let bodyWidth = this.tableBody.width();
    let additionalSubtraction = this.hasScrollbar ? scrollbarSize : 0;
    let difference = bodyWidth - rowWidth - additionalSubtraction;
    if(difference > 0) {
      let lastHeaderCellIndex = _.findLastIndex(this.nonFixedHeaderCells, (headerCell) => {
        return Boolean(headerCell);
      });
      let width = this.headerCells.eq(lastHeaderCellIndex).outerWidth() + difference
      this.resizeColumn(lastHeaderCellIndex, width);
    }
  }
  resizeColumn (index, width, manual) {
    let newWidth = this.resizeHeaderColumnCell(index, width, manual);
    this.resizeBodyColumnCell(index, newWidth, manual);
    return newWidth;
  }
  resizeHeaderColumnCell (index, width, manual) {
    let headerCell = this.headerCells.eq(index);
    let content = headerCell.children().first(); // div
    let currentHeadData = this.headData[index];
    let absoluteMinWidth = parseFloat(this.headData[index].style.minWidth);
    let absoluteMaxWidth = parseFloat(this.headData[index].style.maxWidth) || null;

    if(manual) {
      absoluteMaxWidth = null;
    } else if(absoluteMaxWidth && width > absoluteMaxWidth) {
      width = absoluteMaxWidth;
      if(absoluteMaxWidth === absoluteMinWidth) {
        absoluteMaxWidth += 1;
      }
    } else if(width < absoluteMinWidth) {
      width = absoluteMinWidth;
    }


    width = parseInt(width);

    headerCell.css({
      width: width,
      minWidth: width,
      maxWidth: absoluteMaxWidth
    });

    content.css({
      width: width - hPadding,
      minWidth: width - hPadding,
      maxWidth: width - hPadding
    });

    if(manual) {
      headerCell.css({
        maxWidth: width
      });
      content.css({
        maxWidth: width - hPadding
      });
      currentHeadData.style.minWidth = currentHeadData.style.width = `${width}px`;
      currentHeadData.style.maxWidth = `${width + 1}px`;
    }

    return width;
  }
  resizeBodyColumnCell (index, width, manual) {
    this.tableBodyClass.tableBodyRows.each((rowIndex, row) => {
      let bodyCell = $(row).children().eq(index);
      let content = bodyCell.children().first(); // div
      bodyCell.css({
        width: width,
        minWidth: width
      });
      content.css({
        width: width - hPadding,
        minWidth: width - hPadding
      });

      if(manual) {
        bodyCell.css({
          maxWidth: width
        });
        content.css({
          maxWidth: width - hPadding
        });
      }
    });
  }
}

import {ScrollableTableSwappableColumn} from './swappable-column';

let delay;
let _minWidth;
let borderSize;
let hPadding;
let isNotLeftClick;
let resizerWidth;
let tableHeadHeight;

export class ScrollableTableColumnResize extends ScrollableTableSwappableColumn {
  constructor () {
    super();
    delay = tkgConst.timeout.scrollabable;
    _minWidth = tkgConst.size.minCellWidth;
    borderSize = tkgConst.size.cellBorder;
    hPadding = tkgConst.size.horizontalCellPadding * 2;
    isNotLeftClick = tkgConst.isNotLeftClick;
    resizerWidth = tkgConst.size.resizerWidth;
    tableHeadHeight = tkgConst.size.tableHead;
  }
  addColumnResizer (headerCell) {
    if(headerCell.children('.col-resizer').length) {
      return;
    }
    let headerResizer = $('<div class="col-resizer"></div>');
    let headerCellIndex = headerCell.index();
    let resizer = $('<div id="col-resizer"></div>');
    let body = $('body');
    let currentResizer = body.find('#col-resizer');
    let documentEle = $(document);
    let tableBody = this.tableBody;
    let prevX = null;

    if(currentResizer.length) {
      resizer = currentResizer;
    } else {
      body.append(resizer);
    }

    let locateResizer = (evt) => {
      resizer.addClass('on').css({
        top: headerResizer.offset().top,
        height: tableBody.height(),
        left: evt.clientX
      });
      body.addClass('resizing ew').on('mousemove', mousemove);
      documentEle.on('mouseup', mouseup);
    };
    let moveResizer = (evt) => {
      resizer.css({
        left: evt.clientX
      });
    };
    let turnOffResizer = (evt) => {
      resizer.removeClass('on');
      body.removeClass('resizing ew').off('mousemove', mousemove);
      documentEle.off('mouseup', mouseup);
    };
    let mousedown = (evt) => {
      if(isNotLeftClick(evt)) {
        return;
      }
      // setVar();
      evt.stopPropagation();
      prevX = evt.pageX;
      headerResizer.css({
        left: headerResizer.position().left + 'px'
      });
      locateResizer(evt);
    };
    let mouseup = (evt) => {
      evt.stopPropagation();
      let width = adjustWidth();
      headerResizer.css({
        left: 'auto'
      });
      turnOffResizer(evt);

      this.$scope.$emit('resizedCol', {
        headerResizer: headerCell,
        width: width + 'px',
        index: headerCellIndex
      });
    };
    let mousemove = (evt) => {
      evt.stopPropagation();
      if(calculateCellWidth() < _minWidth && evt.pageX < prevX) {
        return;
      }
      headerResizer.css({
        left: (parseInt(headerResizer.css('left')) || 0) + evt.pageX - prevX + 'px'
      });
      moveResizer(evt);
      prevX = evt.pageX;
    };
    let calculateCellWidth = () => {
      try {
        return headerResizer.offset().left - headerCell.offset().left - resizerWidth/2;
      } catch (e) {
        console.log(e);
        return _minWidth;
      }
    };
    let adjustWidth = () => {
      let width = calculateCellWidth();
      width = width < _minWidth ? _minWidth : width;
      let minWidth = width + hPadding;
      this.resizeColumn(headerCellIndex, minWidth, true);
      return minWidth;
    };

    headerResizer.on('mousedown', mousedown);
    headerCell.append(headerResizer);
  }
  clearHeaderCells () {
    this.headerCells.each((i, headerCell) => {
      $(headerCell).empty();
    });
  }
}

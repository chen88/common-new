import {ScrollableTableRemoveableColumn} from './removeable-column';

let initialized = false;
let prevX;
let body;
let documentEle;
let clonedHeaderContent = null;
let swapper = $('<div id="col-swapper"></div>');
let borderSize;
let swapperWidth;

let createShadowClone = (headerCell) => {
  removeShadowClone();
  let content = headerCell.children().first();
  clonedHeaderContent = content.clone()
                          .addClass('dragging-element')
                          .css({
                            left: content.offset().left + 'px',
                            top: content.offset().top - documentEle.scrollTop() + content.height() + borderSize + 'px'
                          });
  body.append(clonedHeaderContent);
};

let removeShadowClone = () => {
  if(!clonedHeaderContent) {
    return;
  }
  clonedHeaderContent.remove();
  clonedHeaderContent = null;
};

let moveShadowClone = (evt) => {
  var currentX = evt.pageX;
  clonedHeaderContent.css({left: clonedHeaderContent.offset().left + currentX - prevX});
  prevX = currentX;
};

export class ScrollableTableSwappableColumn {
  constructor () {
    // super();
    if(!initialized) {
      initialized = true;
      body = $('body');
      body.append(swapper);
      documentEle = $(document);
      borderSize = tkgConst.size.cellBorder;
      swapperWidth = tkgConst.size.resizerWidth;
    }
  }
  addColumnSwapper (headerCell) {
    if(headerCell.hasClass('has-swapper')) {
      return;
    }
    headerCell.addClass('has-swapper');
    let headerCellOffsets = [];
    let locateSwapper = () => {
      swapper.addClass('on').css({
        top: headerCell.offset().top,
        height: this.tableBody.height(),
        left: headerCell.offset().left - swapperWidth/2
      });
    };

    let moveSwapper = (evt) => {
      let stoppedIndex = getStoppedCellIndex(evt);
      swapper.css({
        left: headerCellOffsets[stoppedIndex] - swapperWidth/2
      });
    };

    let getStoppedCellIndex = (evt) => {
      let currentX = evt.clientX;
      let cellIndex = _.findIndex(headerCellOffsets, (offset) => {
        return offset > currentX;
      });
      cellIndex = cellIndex === 0 ? 0 : cellIndex - 1;
      return cellIndex;
    };

    let swapColumn = (evt) => {
      swapper.removeClass('on');
      let toIndex = getStoppedCellIndex(evt);
      let currentIndex = headerCell.index();
      if(toIndex === currentIndex) {
        return;
      }
      let fromHeaderElement = this.headerCells.eq(currentIndex);
      let toHeaderElement = this.headerCells.eq(toIndex);

      fromHeaderElement.detach().insertBefore(toHeaderElement);

      let fromElement;
      let toElement;
      this.tableBody.children().each((i, tr) => {
        tr = $(tr);
        fromElement = tr.find(`td:eq(${currentIndex})`);
        toElement = tr.find(`td:eq(${toIndex})`);
        fromElement.detach().insertBefore(toElement);
      });

      a.$timeout(() => {
        let headData = this.headData;
        let temp = headData[currentIndex];
        headData.splice(currentIndex, 1, null);
        headData.splice(toIndex, 0, temp);
        _.pull(headData, null);
        this.headerCells = this.tableHeaderRow.children();

        this.$scope.$emit('swappedCol');
      });
    };

    let mousedown = (evt) => {
      if(evt.which === 2 || evt.which == 3) {
        return;
      }
      prevX = evt.pageX;
      this.headerCells.each((i, _headerCell) => {
        headerCellOffsets[i] = _headerCell.getBoundingClientRect().left;
      });
      createShadowClone(headerCell);
      locateSwapper();
      body
        .addClass('dragging')
        .off('mouseup', mouseup)
        .on('mouseup', mouseup)
        .off('mousemove', mousemove)
        .on('mousemove', mousemove);
    };

    let mousemove = (evt) => {
      moveShadowClone(evt);
      moveSwapper(evt);
    };

    let mouseup = (evt) => {
      body
        .removeClass('dragging')
        .off('mouseup', mouseup)
        .off('mousemove', mousemove);
      removeShadowClone();
      swapColumn(evt);
    };

    tkgConst.bindEvent(headerCell, 'mousedown', mousedown, headerCell.scope());
  }
}

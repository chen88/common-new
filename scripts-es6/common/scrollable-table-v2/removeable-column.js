let popoverHtml = require('./removeable-column-popover.jade');
let initialized = false;
let popover;
let popoverScope;
let currentColumn;
let body;
let documentEle;

export class ScrollableTableRemoveableColumn {
  constructor () {
    if(!initialized) {
      initialized = true;
      body = $('body');
      body.append(popoverHtml);
      popover = $('#removeable-column-popover');
      documentEle = $(document);
    }
  }
  addColumnRemover (headerCell) {
    if(headerCell.hasClass('has-remover')) {
      return;
    }
    headerCell.addClass('has-remover');

    let locatePopover = (evt) => {
      popover.remove();
      body.append(popoverHtml);
      popover = $('#removeable-column-popover');
      popoverScope = headerCell.scope();
      popover
        .removeClass('hide')
        .css({
          top: evt.pageY + 5,
          left: evt.pageX - (popover.width() / 2)
        });
      a.$compile(popover)(popoverScope);
      currentColumn = headerCell.index();
    };

    let onContextMenu = (evt) => {
      evt.preventDefault();
      locatePopover(evt);
    };

    tkgConst.bindEvent(headerCell, 'contextmenu', onContextMenu, headerCell.scope());
  }
  removeColumn () {
    this.tableHeaderRow.find(`th:eq(${currentColumn})`).remove();
    this.tableBodyClass.tableBodyRows.each(() => {
      $(this).find(`td:eq(${currentColumn})`).remove();
    });
    popoverScope.columnData.unchecked = true;
  }
}

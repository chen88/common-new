```
 table(
  scrollable-table-s
  swappable-column // allow columns to be swapped
  head-data="{headData}"
  body-data="{bodyData}"
  head-ng-* // head-ng-click, events that attah to the header cells 
  head-ng-click="doSomething(columnData)"
  row-ng-* // row-ng-click, row-ng-class, events that attach to the rows
  row-ng-click="doSomething(rowData)"
  parent=".panel"
  subtract="15"
  number-of-rows="50") // default to 50
```
```
headData = [
	name: {attr.title},
	value: {<th>value<th>},
	style: {<th style="style"></th>},
  percent: {boolean},
  decimal: 4, // not needed when percent is true,
  filter: (val) => {
    return someFilter(val);
  }
  defaultSort: '-' // desc
  textRight: false, // disable auto text-right when number detected
	sortClass: `ctrl.sort.getClass(${this.value})`,
  defaultClasses: 'text-right', // classes for cell td.defaultClasses
	cellClasses: (cell, value) => {
		if(value) {
			cell.addClass('blue-text')	
		} else {
			cell.removeClass('blue-text')	
		}
	}
```

#### row-click
- $scope.tableCtrl.rowClicked = rowIndex

#### scope variables
- bodyData - collection of body data
- headData - collection of head data
- rowData - bodyData[index] that live in tr 
- columnData - headData[index] that lives in th
- tableCtrl.selectedRow - data of clicked row
- tableCtrl.selectedHead - data of clicked column

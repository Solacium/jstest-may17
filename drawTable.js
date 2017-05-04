(function() {

    const predefined = {
        rows: null,
        cols: null
    };

    const elems = {
        tableWrapper: null,
        table: null
    };

    const tableFrame = [];

    function getCellValue(trNumber, tdNumber, dataTree) {
        const labelsInDataTree = [];
        let dataSource = dataTree;
        let cellUnitsCollection;
        let i;
        for (i = 1; i <= predefined.rows.length; i++) {
            let label = tableFrame[i][tdNumber].innerText;
            labelsInDataTree.unshift(label);
        }
        for (i = 1; i <= predefined.cols.length; i++) {
            let label = tableFrame[trNumber][i].innerText;
            labelsInDataTree.unshift(label);
        }
        do {
            let nextLabel = labelsInDataTree.pop();
            if (!dataSource.hasOwnProperty(nextLabel)) {
                cellUnitsCollection = [];
                break;
            }
            dataSource = cellUnitsCollection = dataSource[nextLabel];
        } while (labelsInDataTree.length > 0);

        return getCollectionValue(cellUnitsCollection);
    }

    function newCell(parameters) {
        const cell = document.createElement('td');
        if (parameters) {
            if (parameters.hasOwnProperty('rowSpan')) {
                cell.rowSpan = parameters.rowSpan;
            }
            if (parameters.hasOwnProperty('colSpan')) {
                cell.colSpan = parameters.colSpan;
            }
            if (parameters.hasOwnProperty('innerHTML')) {
                cell.innerHTML = parameters.innerHTML;
            }
            if (parameters.hasOwnProperty('trNumber') &&
                parameters.hasOwnProperty('tdNumber')) {
                cell._trNumber = parameters.trNumber;
                cell._tdNumber = parameters.tdNumber;
                for (let i = parameters.trNumber; i <= parameters.trNumber + cell.rowSpan - 1; i++) {
                    for (let j = parameters.tdNumber; j <= parameters.tdNumber + cell.colSpan - 1; j++) {
                        if (!tableFrame.hasOwnProperty(i)) {
                            tableFrame[i] = [];
                        }
                        tableFrame[i][j] = cell;
                    }
                }

            }
        }
        return cell;
    }

    function getSettints() {
        predefined.rows = settings.getRows();
        predefined.cols = settings.getCols();
    }

    function initElems() {
        elems.tableWrapper = document.getElementById('tableWrapper');
        elems.table = document.createElement('table');
    }

    function drawStatic() {
        elems.tableWrapper.appendChild(elems.table);
    }

    function drawHeader(dataFormatted) {
        const headersRowCount = predefined.rows.length + 1;
        const rowsCopy = _.clone(predefined.rows);
        for (let i = 1; i <= headersRowCount; i++) {
            const row = document.createElement('tr');
            if (i === 1) {
                row.appendChild(newCell({
                    rowSpan: predefined.rows.length,
                    colSpan: predefined.cols.length,
                    trNumber: 1,
                    tdNumber: 1
                }));
            }
            if (i === headersRowCount) {
                for (let j = 0; j < predefined.cols.length; j++) {
                    (function(l, k) {
                        row.appendChild(newCell({
                            innerHTML: predefined.cols[j],
                            trNumber: l,
                            tdNumber: k
                        }));
                    })(i, j+1);
                }
                row.appendChild(newCell({
                    trNumber: i,
                    tdNumber: predefined.cols.length + 1
                }));
            }
            if (i !== headersRowCount) {
                row.appendChild(newCell({
                    innerHTML: rowsCopy.shift(),
                    trNumber: i,
                    tdNumber: predefined.cols.length + 1
                }))
            }
            elems.table.appendChild(row);
        }

        (function drawRightHeaders(dataRows, rowIndex, lastRowIndex) {
            if (Array.isArray(dataRows)) {
                return;
            }
            for (let label in dataRows) {
                if (!dataRows.hasOwnProperty(label) || label === '_endPoints') {continue;}
                elems.table.rows[rowIndex].appendChild(newCell({
                    innerHTML: label,
                    trNumber: rowIndex+1,
                    tdNumber: tableFrame[rowIndex+1].length,
                    colSpan: dataRows[label]._endPoints,
                    rowSpan: (rowIndex === lastRowIndex-1) ? 2 : 1
                }));
                drawRightHeaders(dataRows[label], rowIndex+1, lastRowIndex);
            }
        })(dataFormatted.rows, 0, predefined.rows.length);
    }

    function drawBody(dataFormatted) {
        (function predrawRows(quantity) {
            while (quantity--) {
                elems.table.appendChild(document.createElement('tr'));
            }
        })(dataFormatted.cols._endPoints);

        (function drawLeftHeaders(dataCols, colIndex, initialRowIndex, lastColIndex) {
            if (Array.isArray(dataCols)) {
                return;
            }
            let currentRowIndex = initialRowIndex;
            for (let label in dataCols) {
                if (!dataCols.hasOwnProperty(label) || label === '_endPoints') {continue;}
                elems.table.rows[currentRowIndex].appendChild(newCell({
                    innerHTML: label,
                    trNumber: currentRowIndex+1,
                    tdNumber: colIndex+1,
                    colSpan: (colIndex === lastColIndex-1) ? 2 : 1 ,
                    rowSpan: dataCols[label]._endPoints
                }));
                if (dataCols[label]._endPoints) {
                    drawLeftHeaders(dataCols[label], colIndex+1, currentRowIndex, lastColIndex);
                    currentRowIndex += dataCols[label]._endPoints;
                } else {
                    (function drawContentCells(){
                        for (let i = 1; i <= dataFormatted.rows._endPoints; i++) {
                            const trNumber = currentRowIndex+1;
                            const tdNumber = colIndex+2+i;
                            elems.table.rows[currentRowIndex].appendChild(newCell({
                                innerHTML: getCellValue(trNumber, tdNumber, dataFormatted.all),
                                trNumber: trNumber,
                                tdNumber: tdNumber
                            }));
                        }
                    })();
                    currentRowIndex++;
                }
            }
        })(dataFormatted.cols, 0, predefined.rows.length+1, predefined.cols.length);
    }

    function drawTable(dataFormatted) {
        getSettints();
        initElems();
        drawStatic();
        drawHeader(dataFormatted);
        drawBody(dataFormatted);
    }

    window.drawTable = drawTable;
})();
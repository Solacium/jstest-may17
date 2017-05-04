(function() {

    const predefined = {
        rows: null,
        cols: null,
        calcMethod: null
    };

    const elems = {
        tableWrapper: null,
        table: null
    };

    const tableFrame = [];

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
            if (parameters.hasOwnProperty('aClass')) {
                cell.className = parameters.aClass;
            }
        }
        return cell;
    }

    function getSettints() {
        predefined.rows = settings.getRows();
        predefined.cols = settings.getCols();
        predefined.calcMethod = settings.getCalcMethod();
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
        const rowRemained = dataFormatted.cols._endPoints;
        const lastRowNumber = elems.table.rows.length-1;

        function drawRow(dataCols, lastRowNumber, currentColNr, currentRow, leftOffset) {
            const row = currentRow ? currentRow : document.createElement('tr');
            leftOffset = leftOffset ? leftOffset : 0;

            if (!Array.isArray(dataCols)) {
                for (let label in dataCols) {
                    if (!dataCols.hasOwnProperty(label) || label === '_endPoints') {continue;}
                    row.appendChild(newCell({
                        innerHTML: label,
                        trNumber: lastRowNumber+2,
                        tdNumber: leftOffset + elems.table.rows[lastRowNumber].length ? elems.table.rows[lastRowNumber].length+1 : 1,
                        colSpan: (currentColNr === predefined.cols.length+1) ? 2 : 1,
                        rowSpan: dataCols[label]._endPoints ? dataCols[label]._endPoints : 1
                    }));
                    if (dataCols[label]._endPoints) {
                        drawRow(dataCols[label], lastRowNumber, currentColNr+1, null, dataCols[label]._endPoints);
                    } else {
                        drawRow(dataCols[label], lastRowNumber, currentColNr+1, row);
                    }
                }
                for (let i = 0; i < dataFormatted.rows._endPoints; i++) {
                    row.appendChild(newCell({
                        innerHTML: '-',
                        trNumber: lastRowNumber+2,
                        tdNumber: leftOffset + predefined.cols.length+1+i,
                        aClass: 'dataCells'
                    }));
                }
                elems.table.appendChild(row);
            }
        }

        drawRow(dataFormatted.cols, lastRowNumber, 1);
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
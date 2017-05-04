(function() {

    function format(dataFormatted, properties) {
        if (properties.length === 0) {
            return;
        }
        for (let label in dataFormatted) {
            if (!dataFormatted.hasOwnProperty(label) || label === '_endPoints') {continue;}
            dataFormatted[label] = _.groupBy(dataFormatted[label], properties[0]);
            format(dataFormatted[label], properties.slice(1));
        }
    }

    function countEndPoints(dataTree) {
        let currentIterationEndPoints = 0;
        for (let label in dataTree) {
            if (!dataTree.hasOwnProperty(label) || label === '_endPoints') {continue;}
            if (Array.isArray(dataTree[label])) {
                currentIterationEndPoints += 1;
            } else {
                let currentLabelEndPoints = countEndPoints(dataTree[label]);
                dataTree[label]['_endPoints'] = currentLabelEndPoints;
                currentIterationEndPoints += currentLabelEndPoints;
            }
        }
        return currentIterationEndPoints;
    }

    function formatData(dataArray) {
        const rowsSettings = settings.getRows();
        const colsSettings = settings.getCols();
        const dataFormatted = {
            all: {},
            rows: {},
            cols: {}
        };

        dataFormatted.all = (function() {
            const firstRow = rowsSettings[0];
            const data = _.groupBy(dataArray, firstRow);
            format(data, rowsSettings.slice(1).concat(colsSettings));
            return data;
        })();

        dataFormatted.rows = (function() {
            const firstRow = rowsSettings[0];
            const data = _.groupBy(dataArray, firstRow);
            format(data, rowsSettings.slice(1));
            data['_endPoints'] = countEndPoints(data);
            return data;
        })();

        dataFormatted.cols = (function() {
            const firstRow = colsSettings[0];
            const data = _.groupBy(dataArray, firstRow);
            format(data, colsSettings.slice(1));
            data['_endPoints'] = countEndPoints(data);
            return data;
        })();

        return dataFormatted;
    }

    window.formatData = formatData;
})();
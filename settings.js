(function() {
    const predefined = {
        // values accepted: 'brand', 'model', 'type', 'year', 'department'
        rows: ['brand', 'department'],
        // values accepted: 'brand', 'model', 'type', 'year', 'department'
        cols: ['model', 'type', 'year'],
        // values accepted: 'sum', 'avg', 'count'
        calcMethod: 'count'
    };

    const settings = {
        getRows: function() {
            return _.clone(predefined.rows);
        },
        getCols: function() {
            return _.clone(predefined.cols);
        },
        getCalcMethod: function() {
            return predefined.calcMethod;
        }
    };

    window.settings = settings;
})();
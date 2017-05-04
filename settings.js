(function() {
    const predefined = {
        rows: ['brand', 'model', 'type'],
        cols: ['department', 'year'],
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
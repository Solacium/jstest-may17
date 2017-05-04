(function() {
    const predefined = {
        rows: ['brand', 'type', 'model'],
        cols: ['year', 'department'],
        calcMethod: ''
    };

    const settings = {
        getRows: function() {
            return _.clone(predefined.rows);
        },
        getCols: function() {
            return _.clone(predefined.cols);
        },
        getCalcMethod: function() {
            return _.clone(predefined.calcMethod);
        }
    };

    window.settings = settings;
})();
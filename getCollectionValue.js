(function() {

    function getCountValue(unitsCollection) {
        return unitsCollection.length;
    }

    function getSumValue(unitsCollection) {
        return unitsCollection.reduce(function(accumulator, currentUnit) {
            return (accumulator += Number(currentUnit.price));
        }, 0)
    }

    function getAverageValue(unitsCollection) {
        let average;
        if (unitsCollection.length > 0) {
            average = getSumValue(unitsCollection) / unitsCollection.length;
        } else {
            average = 0;
        }
        return average;
    }

    function getCollectionValue(unitsCollection) {
        switch (settings.getCalcMethod()) {
            case 'count':
                return getCountValue(unitsCollection);
            case 'avg':
                return getAverageValue(unitsCollection);
            default: // falls-through
            case 'sum':
                return getSumValue(unitsCollection);
        }
    }

    window.getCollectionValue = getCollectionValue;
})();
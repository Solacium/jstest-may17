(function() {

    function starter() {
        const dataArray = repository.getData();
        const dataFormatted = formatData(dataArray);

        drawTable(dataFormatted);
    }

    window.onload = starter;
})();
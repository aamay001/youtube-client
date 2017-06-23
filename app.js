var YTC_SEARCH_SUBMIT_BUTTON = '.js-ytc-search-button';

$(onReady);

function onReady()
{
    bindUserInput();
}

function bindUserInput()
{
    $(YTC_SEARCH_SUBMIT_BUTTON).on('click', onSearchSubmitClick);
}

function onSearchSubmitClick(event)
{
    alert('Buton was clicked.');
}
var YTC_SEARCH_SUBMIT_BUTTON = '.js-ytc-search-button';
var YTC_API_KEY = 'AIzaSyDQMrY_PWD1wjWMpZotRPqdNbmgX-J_jlg';
var TYC_YOUTUBE_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
var YTC_USER_INPUT = '#ytc-search-input';

$(onReady);

function onReady()
{
    bindUserInput();
}

function bindUserInput()
{
    $(YTC_USER_INPUT).keydown(onUserInputKeyDown);
    $(YTC_SEARCH_SUBMIT_BUTTON).on('click', onSearchSubmitClick);
}

function onUserInputKeyDown(event)
{
    if ( event.which == 13 )
        onSearchSubmitClick();
}

function onSearchSubmitClick()
{
    var userInput = $(YTC_USER_INPUT).val();
    searchYouTube(userInput);
}

function searchYouTube(searchText)
{
    var params = {
                    part : 'snippet',
                    resultsPerPage: 10,
                    q : searchText,
                    type : 'video',
                    key : YTC_API_KEY
                 };

    $.getJSON(TYC_YOUTUBE_SEARCH_ENDPOINT, params, processSearchResults);
}

function processSearchResults(results)
{
    $.each( results, 
        function(key, value)
        { 
            console.log(key + " : " + value);
        });
}

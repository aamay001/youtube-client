'use strict';

var YTC_SEARCH_SUBMIT_BUTTON = '.js-ytc-search-button';
var YTC_API_KEY = 'AIzaSyDQMrY_PWD1wjWMpZotRPqdNbmgX-J_jlg';
var YTC_YOUTUBE_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
var YTC_USER_INPUT = '#ytc-search-input';
var YTC_FORM_INPUT_GROUP = '.js-ytc-form-group';
var YTC_RESULTS_PER_ROW = 1;
var YTC_SEARCH_RESTULS_CONTAINER = '.ytc-search-results-container';
var YTC_LOAD_ANIMATION = '.jt-ytc-loading-animation-container';

var ytcWaitOnLoad = true;
var ytcNextPageToken = '';
var ytcSearchText = '';
var ytcSearchParams = {
                        part : 'snippet',
                        pageToken : ytcNextPageToken,
                        q : '',
                        type : 'video',
                        key : YTC_API_KEY
                      };

$(onReady);

function onReady()
{
    bindUserInput();
}

function bindUserInput()
{
    $(YTC_USER_INPUT).keydown(onUserInputKeyDown);
    $(YTC_SEARCH_SUBMIT_BUTTON).on('click', onSearchSubmitClick);
    $(window).scroll(onUserScoll);
}

function onUserInputKeyDown(event)
{
    if ( event.which == 13 )
        onSearchSubmitClick();
}

function onSearchSubmitClick()
{
    $(YTC_FORM_INPUT_GROUP).removeClass('has-error');
    ytcSearchText = $(YTC_USER_INPUT).val();

    if ( ytcSearchText == '')
    {
        $(YTC_FORM_INPUT_GROUP).toggleClass('has-error');
        alert("Enter Text!");
        return;
    }

    ytcWaitOnLoad = true;
    $(YTC_SEARCH_RESTULS_CONTAINER).text(''); 
    $(YTC_LOAD_ANIMATION).show();    
    ytcNextPageToken = '';
    $(YTC_USER_INPUT).val('');
    searchYouTube(ytcSearchText);
}

function searchYouTube(searchText)
{       
    ytcSearchParams.q = searchText;    
    $.getJSON(YTC_YOUTUBE_SEARCH_ENDPOINT, ytcSearchParams, populateVideosArray);
}

function populateVideosArray(results)
{
    updateNextPageToken(results);    
    processSearchResults(results.items.map(getVideoPanel));    
}

function processSearchResults(videoPanelArray)
{    
    var countRows = Math.ceil(videoPanelArray.length / YTC_RESULTS_PER_ROW);     
    $(YTC_SEARCH_RESTULS_CONTAINER).append(getSearchResultsHTML(countRows,videoPanelArray));
    $(YTC_LOAD_ANIMATION).hide();
    ytcWaitOnLoad = false;
}

function getVideoPanel(videoItem)
{
    var newPanel = $('<div class="panel panel-primary ytc-panel"></div>');
    newPanel.append('<div class="panel-heading ytc-primary-panel-heading">' + videoItem.snippet.title + '</div>');
    newPanel.append('<div class="panel-body"><a href="https://www.youtube.com/watch?v=' + 
                    videoItem.id.videoId + '" target="_new"><img width="' + 
                    videoItem.snippet.thumbnails.medium.width + '" height="' + 
                    videoItem.snippet.thumbnails.medium.height + '" src="' + 
                    videoItem.snippet.thumbnails.medium.url + '" alt="Video thumbnail." /></a></div>');
    return newPanel;
}

function getSearchResultsHTML( rows, videoPanels )
{
    var rowHTML = $('<div class="row"></div>');
    var colHTML = $('<div class="col-md-' +  12 / YTC_RESULTS_PER_ROW + '"></div>');
    var resultsHTML = $('<p></p>');
    var rowsArr = [];
    var thisRow;

    for ( var i = 0; i < rows; i++ )
    {
        thisRow = rowHTML.clone();
        
        for ( var j = 0; j < YTC_RESULTS_PER_ROW; j++ )
        {
            var vResult = colHTML.clone();
            vResult.html(videoPanels[j + (i * YTC_RESULTS_PER_ROW)]);
            thisRow.append(vResult);
        }

        rowsArr.push(thisRow);
    }

    rowsArr.map(function(item){resultsHTML.append(item);});
    return resultsHTML.html();
}

function updateNextPageToken(results)
{
    ytcNextPageToken = results.nextPageToken;
    ytcSearchParams.pageToken = ytcNextPageToken;    
    return ytcNextPageToken;
}


function onUserScoll()
{
    if($(window).scrollTop() == $(document).height() - $(window).height() && !ytcWaitOnLoad) 
    {
        ytcWaitOnLoad = true;
        $(YTC_LOAD_ANIMATION).show();
        searchYouTube(ytcSearchText);
    }
}
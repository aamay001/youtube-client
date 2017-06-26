'use strict';

/* API KEY is restricted to single IP Address. Request more access. */
var YTC_API_KEY = 'AIzaSyDQMrY_PWD1wjWMpZotRPqdNbmgX-J_jlg';
var YTC_SEARCH_SUBMIT_BUTTON = '.js-ytc-search-button';
var YTC_YOUTUBE_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
var YTC_USER_INPUT = '#ytc-search-input';
var YTC_FORM_INPUT_GROUP = '.js-ytc-form-group';
var YTC_RESULTS_PER_ROW = 1;
var YTC_LOAD_MORE_BUTTON = '.js-ytc-load-more-button';
var YTC_SEARCH_RESTULS_CONTAINER = '.ytc-search-results-container';
var YTC_LOAD_ANIMATION = '.jt-ytc-loading-animation-container';
var YTC_LOAD_WATCH_VIDEO_MODAL = '.js-ytc-watch-video-modal';
var YTC_MODAL_CLOSE = '.js-ytc-modal-close';
var YTC_MODAL_BODY = '.js-modal-body';
var YTC_ERROR_ALERT = '.ytc-error-alert';

var ytcFirstSearchInitiated = false;
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
    $(YTC_LOAD_MORE_BUTTON).on('click', onLoadMoreButtonClick);
    $(YTC_SEARCH_RESTULS_CONTAINER).on('click', YTC_LOAD_WATCH_VIDEO_MODAL, watchVideoInModal);
    $(YTC_MODAL_CLOSE).on('click', onModalCloseClick);
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
    toggleLoadImage(true);        
    ytcNextPageToken = '';
    $(YTC_USER_INPUT).val('');
    searchYouTube(ytcSearchText);
}

function searchYouTube(searchText)
{       
    ytcSearchParams.q = searchText;
    $.getJSON(YTC_YOUTUBE_SEARCH_ENDPOINT, ytcSearchParams, populateVideosArray)
    .fail(onFailGetResults);
}

function onFailGetResults()
{
    toggleLoadImage(false, true);
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
    toggleLoadImage(false);
    ytcWaitOnLoad = false;    
}

function getVideoPanel(videoItem)
{
    var newPanel = $('<div class="panel panel-primary ytc-panel"></div>');
    newPanel.append('<div class="panel-heading ytc-primary-panel-heading"><h2>' + videoItem.snippet.title + '</h2></div>');
    newPanel.append('<div class="panel-body"><a href="https://www.youtube.com/watch?v=' + 
                    videoItem.id.videoId + '" target="_new"><img src="' + 
                    videoItem.snippet.thumbnails.medium.url + '" alt="Video thumbnail." /></a> \
                    <div class="ytc-video-meta-ops"><p>Date Published: ' + 
                    videoItem.snippet.publishedAt + '</p><p>Description:<br>' + 
                    videoItem.snippet.description  + '</p><a href="https://www.youtube.com/channel/' + 
                    videoItem.snippet.channelId + '" class="btn btn-default btn-sm" target="_new" >Go to Channel</a> \
                    <a data="https://www.youtube.com/watch?v=' + 
                    videoItem.id.videoId + '" class="btn btn-default btn-sm js-ytc-watch-video-modal" data-toggle="modal" data-target="#ytc-video-modal" >Watch</a></div></div>');
                    
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

function onLoadMoreButtonClick()
{
    ytcWaitOnLoad = true;
    toggleLoadImage(true);
    searchYouTube(ytcSearchText);    
}


function onUserScoll()
{
    if($(window).scrollTop() == $(document).height() - $(window).height() && !ytcWaitOnLoad) 
    {
        ytcWaitOnLoad = true;
        toggleLoadImage(true);
        searchYouTube(ytcSearchText);
    }
}

function toggleLoadImage(onOff, err)
{
    $(YTC_ERROR_ALERT).hide();

    if (  onOff )
    {
        $(YTC_LOAD_ANIMATION).show();
        $(YTC_LOAD_MORE_BUTTON).hide();        
    }

    else if ( err || false )
    {
        $(YTC_LOAD_ANIMATION).hide();
        $(YTC_ERROR_ALERT).fadeIn('fast');   
    }

    else
    {
        $(YTC_LOAD_ANIMATION).hide();
        if ( !ytcFirstSearchInitiated )
        {
            ytcFirstSearchInitiated = true;
            $(YTC_LOAD_MORE_BUTTON).css('display', 'block');
        }
        else
        {
            $(YTC_LOAD_MORE_BUTTON).show();        
        }
    }
}

function watchVideoInModal(event)
{
    $(YTC_MODAL_BODY).html('<iframe width="560" height="315" src="' + 
                           this.getAttribute("data").replace('watch?v=', 'embed/') + 
                           '" frameborder="0" allowfullscreen></iframe>');    
}

function onModalCloseClick()
{
    $(YTC_MODAL_BODY).html('');    
}
/*Hacker News API*/
const HNUrl = 'https://hacker-news.firebaseio.com/v0/';
const HNNewStories = 'newstories.json';
const HNTopStories = 'topstories.json';
const HNAsk = 'askstories.json';
const HNShow = 'showstories.json';

/*Globals*/
var StoryMax = 25;
var LastStory = StoryMax;
var StoryIdList = [];

/*Get Initial set of Stories*/
getStoryIds(HNNewStories);

/*Get List of HN Story IDs*/
function getStoryIds(category){
    $.getJSON(HNUrl + category).then(function(data) {
        StoryIdList = data;
        getStories();
    });;
}

/*Create Story Elements*/
function getStories() {
    for(let i = LastStory - StoryMax; i < LastStory; i++) {
        $story = $('<div></div>').attr('id', StoryIdList[i]);
        $('#root').append($story);
        $.getJSON(HNUrl + 'item/' + StoryIdList[i] + '.json', function(data) {
                addStoryData(data, i + 1);
        });
    }
    LastStory += StoryMax;
}

/*Populate Story Element*/
function addStoryData(item, storyNum) {
    $title = $('<a class="story-title"></a>').text(storyNum + '.' + item.title);
    $title.attr("href", item.url);
    $author = $('<span class="story-author"></span>').text('By:' + item.by);
    $date = $('<span class="story-date"></span>').text(convertDate(item.time));
    $score = $('<span class="story-score"></span>').text('Score:' + item.score);
    $comments = $('<button class="story-comments">0 comments</button>').data('storyId', item.id);
    if(item.kids) {
        $sfx = ' comments';
        if(item.kids.length == 1) {
            $sfx = ' comment';
        }
        $comments.text(item.kids.length + $sfx);
    }
    $('#' + item.id).addClass('story-panel');
    $('#' + item.id).append($title, '<br>', $author, $date, '<hr>', $score, $comments);
}

/*Populate comments*/
function getComments(storyId) {
    $.getJSON(HNUrl + 'item/' + storyId + '.json', function(item) {
        for(let i = 0; i < item.kids.length; i++) {
            $.getJSON(HNUrl + 'item/' + item.kids[i] + '.json', function(data) {
                
            });;
        }
    });;
}

/*Clear root element*/
function clearStories() {
    LastStory = StoryMax;
    $('#root').html('');
}

/*Add stories after scrolling to bottom*/
$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() >= $(document).height() - 1 && LastStory <= StoryIdList.length) {
        getStories();
    }
});

/*Convert Unix Time into readable format*/
function convertDate(unixTime) {
    var date = new Date(unixTime * 1000);
    var hours = date.getHours();
    var ampm = 'am';
    if(hours >= 13) {
        hours -= 12;
        ampm = 'pm';
    } else if(hours == 0) {
        hours = 12;
    }
    var minutes = "0" + date.getMinutes();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return ( hours + ':' + minutes.substr(-2) + ':' + ampm + ' ' +
            month + '/' + day + '/' + year);
}

/*Click evemts*/
$(document).on('click', '.story-comments', (function() {
    $storyId = $(this).data('storyId');
    $comments = $('<p class="comment-pane"></p>').text(getComments($storyId));
    $('#' + $storyId).children('hr').after($comments);
}));

$(document).on('click', '#top-stories', (function() {
    clearStories();
    getStoryIds(HNTopStories);
}));

$(document).on('click', '#ask-hn', (function() {
    clearStories();
    getStoryIds(HNAsk);
}));

$(document).on('click', '#show-hn', (function() {
    clearStories();
    getStoryIds(HNShow);
}));
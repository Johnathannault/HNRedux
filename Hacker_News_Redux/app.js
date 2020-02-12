/*Hacker News API*/
const HNUrl = 'https://hacker-news.firebaseio.com/v0/';
const HNNewStories = 'newstories.json';

/*Globals*/
var StoryMax = 25;
var LastStory = StoryMax;
var StoryIdList = [];

/*Get List of HN Story IDs*/
$.getJSON(HNUrl + HNNewStories).then(function(data) {
    StoryIdList = data;
    getStories();
});;

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
    $('#' + item.id).addClass('story-panel');
    $('#' + item.id).append($title, '<br>', $author, $date);
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
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return ( hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' +
            month + '/' + day + '/' + year);
}
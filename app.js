let youtube_URL = "https://www.googleapis.com/youtube/v3/search?callback=?";

let state = {
    search: null,
    nextPage: null,
    prevPage: null
};

const assignNewPageTokens = (data) => {
    state = Object.assign({}, state, {
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken
  })
};

const getDataFromApi = (searchFor, callback, page) => {
    let query = {
        part: "snippet",
        key: "AIzaSyARf9WqTP8LDmnUhPWkdqLc0YuYBVVOk2M",
        q: searchFor,
        pageToken: page,
        maxResults: 10
    };

    $.getJSON(youtube_URL, query, callback);
};


const displayYoutubeSearchData = data => {
    let resultElement = '';
    if (data.items) {
        data.items.forEach(ele => {
           resultElement += `<img class="thumbs" src="${ele.snippet.thumbnails.medium.url}"><div class="iFrame hide"><iframe width="640" height="350" src="http://www.youtube.com/embed/${ele.id.videoId}"  frameborder="0" allowfullscreen></iframe><br><button type="button" class="back">Back</button></div><p class="channel"><a href="https://www.youtube.com/channel/${ele.snippet.channelId}">Watch More Videos from the Channel ${ele.snippet.channelTitle}</a></p>`;
        });
    }
    else {
        resultElement += '<p>No results</p>';
    }

  $('.results').html(resultElement);
  assignNewPageTokens(data)
  $(".search-field").val("");
};

const watchForSubmit = () => {
    $('.js-search-form').submit(event => {
    event.preventDefault();

    $(".results-page").removeClass("hide");
    $(".page-logo").addClass("hide");

    state.search = $(".search-field").val();
    getDataFromApi(state.search, displayYoutubeSearchData);

  });
}

const watchForNextClick = callback => {
    $("body").on("click", ".next-button", event => {
        const page = state.nextPageToken
        const searchTerm = state.search

        getDataFromApi(searchTerm, callback, page);

        $(window).scrollTop(0);
    });
};

const watchForPrevClick = callback => {
    $("body").on("click", ".prev-button", event => {
        const page = state.prevPageToken;
        const searchTerm = state.search

        getDataFromApi(searchTerm, callback, page);

        $(window).scrollTop(0);
    });
};

const watchForEmbedClicks = () => {
    $(".results").on("click", ".thumbs", event => {
        ($(event.target).next(".iFrame").removeClass("hide"))
        $(".thumbs").addClass("hide");
        $(".channel").addClass("hide");
        $(".prev-next").addClass("hide");
    })
    $(".results").on("click", ".back", event => {
        $(".thumbs").removeClass("hide");
        $(".channel").removeClass("hide");
        $(".prev-next").removeClass("hide");
        $(".iFrame").addClass("hide");

    })
}

const init = () => {
    watchForSubmit();
    watchForNextClick(displayYoutubeSearchData)
    watchForPrevClick(displayYoutubeSearchData)
    watchForEmbedClicks();
}
$(init)

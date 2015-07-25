
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var $streetName = $('#street').val();
    var $cityName = $('#city').val();
    var address = $streetName + ", " + $cityName;
    address = address.replace(/\s+/g, '');
    var url = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address;
    //var imageURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=18centercourt,walnutcreek"; ---> for testing
    $body.append('<img class="bgimg" src= ' + url + '>');


    //NYT section
    var $cityCaps = $cityName.toUpperCase();
    $nytHeaderElem.text("New York Times Articles About " + $cityCaps);
    
    //AJAX request
    var myKey = "8bfb57ea49317cb1c0fb00df4919da07:18:70270174";
    var nytURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + $cityName + "&api-key=" + myKey;
    $.getJSON( nytURL, function( data ) {
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class ="article">'+'<a href="article.web_url+">'+article.headline.main+'</a>+ ;<p>' + article.snippet + '</p>' + '</li>');
        }
    }).error(function() {
        $nytElem.append("<h3>NYT is currently ignoring our requests</h3>");
    });



    //Wikipedia section
    //error handling
    var wikiRequestTimeout = setTimeout (function() {
        $wikiElem.text("failed to return wikipedia resources");
    }, 8000);

    //AJAX request for wiki info
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $cityName + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiURL,
        dataType: "jsonp", 
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org.wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });


    return false;
};

$('#form-container').submit(loadData);

//loadData();

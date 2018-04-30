$(document).ready(function() {
    var topics = ["burgers", "donuts", "fries", "pasta", "pizza", "ramen", "sushi", "taco"];

    var API_KEY = "dkmUWicXaTG4H8R9Ozeadr42wal9PGs0";
    var requestURL = "https://api.giphy.com/v1/gifs/search?api_key=" + API_KEY + "&g=&limit=25&q=";
    // query string followed by ? and key=value

    function emptyDiv() {
        $("#buttons").empty(); // empties out div before adding new topic
    };

    function makeTopicButtons() {
        for (var i = 0; i < topics.length; i++) {
            var button = $("<button>"); // create buttons in html
            button.addClass("btn btn-info topic"); // add bootstrap classes to button
            button.text(topics[i]); // add texts from the topics array to buttons
            $("#buttons").append(button); // append to display onto screen

        }
    }
    makeTopicButtons();

    function createImageDiv(response, i) {
        var img = $("<img class='giphy-img'>");
        // set the src of the element
        img.attr("src", response.data[i].images.downsized.url);
        img.attr("data-animated", response.data[i].images.downsized.url);
        img.attr("data-still", response.data[i].images.downsized_still.url);
        img.attr("data-state", "animated");

        return img;
    }

    // event delegation: document is recipient of the click function, anything with class=topic is delegated
    $(document).on("click", ".topic", function() {
        var buttonText = $(this).text();
        $("body").css("background-image", "url('./assets/images/" + buttonText + "bg.jpg')"); // changes bg for the buttons
        $("body").css("background-attachment", "fixed"); // fixes background image

        $("#gifs").empty(); // every time you click a button, clean the page out to get new gifs of new button
        $.ajax({
            url: requestURL + buttonText,
            method: "GET"
        }).then(function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var imgDiv = createImageDiv(response, i); // createImage function below
                $("#gifs").append(imgDiv);

                var ratings = $("#ratings");
                var p = $("<p>");
                p.addClass("badge badge-info");
                p.text("rating: " + response.data[i].rating); // display the rating for each gif

                $("#gifs").append(p);
            }       
        });
    });

    $(document).on("click", ".giphy-img", function() {
        var state = $(this).attr("data-state");
        // if the data-state is animated
        if (state === "animated") {
            // change data-state to still
            $(this).attr("data-state", "still");
            // change the src from animated to the still version
            $(this).attr("src", $(this).attr("data-still"));
        } else {
            // else change the state to animated
            $(this).attr("data-state", "animated");
            // change the src to still version
            $(this).attr("src", $(this).attr("data-animated"));
        } 
    });

    $(".add-new").on("click", function() {
        var newTopic = $("#new-topic").val();
        topics.push(newTopic);
        $("#new-topic").val("");
        emptyDiv();
        makeTopicButtons();
    });
});

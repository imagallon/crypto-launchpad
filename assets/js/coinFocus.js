//Fetches link specific to coin
function fetchCoin(link) {
    fetch(link)
    .then(function(response){
        console.log(response.status);
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                appendData(data)

                $("#searchedCoin").text(" " + data.name);
                var randomColor = ["rgb(252,250,100)", "rgb(79,167,230)", "rgb(176,23,41)", "rgb(24,159,118)", "rgb(162,118,255)"];
			    var ctx = document.getElementById("focusChart");
			    var myChart = new Chart(ctx,{
				
				type: 'bar',
				data: {
					labels: [data.name],
					datasets: [
						{
							label: 'Market Cap',
							data: [data.market_data.market_cap.usd],
							backgroundColor:"rgb(252,250,100)",
							borderColor: "rgb(252,250,100)",
							borderDash: [5, 5],
						

						}, {
							label: 'Total Volume',
							data: [data.market_data.total_volume.usd],
							backgroundColor: "rgb(79,167,230)",
							borderColor: "rgb(79,167,230)", 
							borderWidth: 4
						}

					]
				},			
			});
        })
        } else {
            UIkit.modal('#modal-center').show();
        }
    })

}
//when the modal close button is clicked it will send you back to the homepage
$('#modalClose').on('click', function() {
    window.location.replace('./index.html');
})

//appends all coin specific items, including description and image
function appendData(data) {
    var coinName = data.name;
    var description = data.description.en.split('.')[0];
    var price = data.market_data.current_price.usd;
    var high24 = data.market_data.high_24h.usd;
    var low24 = data.market_data.low_24h.usd;
    var marketCap = data.market_data.market_cap.usd;
    var priceChange1h = data.market_data.price_change_percentage_1h_in_currency.usd;
    var ath = data.market_data.ath.usd;
    var atl = data.market_data.atl.usd;
    var athChange = data.market_data.ath_change_percentage.usd;
    var atlChange = data.market_data.atl_change_percentage.usd;
    var imageSource = data.image.large;
    var priceChange1y = data.market_data.price_change_percentage_1y_in_currency.usd;
    $('#coinImage').attr('src', imageSource);
    $('#coin-name').text(coinName);
    $('#description').text(description);
    $('#price').text("Current Price: $" + price);
    $('#high24').text("Highest in the last 24 hours: $" + high24);
    $('#low24').text("Lowest in the last 24 hours: $" + low24);
    $('#marketCap').text("Market Cap: " + marketCap);
    $('#priceChange1h').text("Price Change in the last hour: " + priceChange1h + '%');
    $('#ath').text("All time high: $" + ath);
    $('#atl').text("All time low: $" + atl);
    $('#athChange').text("All time high change: " + athChange + "%");
    $('#atlChange').text("All time low change: " + atlChange + "%");
    $('#priceChange1y').text("Price Change in one year: " + priceChange1y + "%");
}

//this retrieves the user search from the query string generated by the home page
// and calls the fetch function
function getSearch() {
    var queryString = document.location.search;
    var userSearch = queryString.split('=')[1];
    console.log(userSearch)
    console.log(userSearch)
    var cryptoAPI = "https://api.coingecko.com/api/v3/coins/" + userSearch + "?localization=false&tickers=true&market_data=true&community_data=true&developer_data=false&sparkline=false"
    fetchCoin(cryptoAPI);
    getNews(userSearch);
}

var newsKEY = "FsNfuAVsAFoZ1i8vqo2WS22juPus8BzV"

function getNews(search){

var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&api-key="+ newsKEY;

    //NY Times Fetch
    fetch(queryURL)
    .then(function(response){
        console.log(response.status);
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                appendNews(data);
        })
        } else {
            var appendBlock = 
            `
            <div class="uk-alert-danger" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <p>It looks like we couldn't find any news related to this coin.</p>
</div>`;
        $("#news").append(appendBlock);
        }
    })

}

function appendNews (data) {
    var headline = data.response.docs[0].headline.main
    var abstract = data.response.docs[0].abstract
    var newsLink = data.response.docs[0].web_url
    $('#heading').text(headline)
    $('#abstract').text(abstract)
    $('#newsLink').text(newsLink)
    $('#newsLink').attr('href', newsLink);
}

// runs the function to start the cascade of 
// retrieving, creating, requesting, receiving, and appending
getSearch();
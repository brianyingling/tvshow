app.controller("mainController", function($scope, $http){

	$scope.apiKey 	  	   = "5a206b198d54ed30e1be014dd4ebff92";
	$scope.results 	  	   = [];
	$scope.filterText 	   = null;
	$scope.availableGenres = [];
	$scope.genreFilter 	   = null;
	$scope.orderFields	   = ['Air Date', 'Rating'];
	$scope.orderDirections = ['Descending', 'Ascending'];
	$scope.orderReverse	   = false;

	$scope.setGenreFilter = function(genre) {
		$scope.genreFilter = genre;
	};

	$scope.customOrder = function(tvshow) {
		switch($scope.orderField) {
			case 'Air Date':
				return tvshow.episode.first_aired;
				break;
			case 'Rating':
				return tvshow.episode.ratings.percentage;
				break;
		}
	};

    $scope.init = function() {
    	var today, apiDate, url;

    	today 	= new Date();
    	apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
    	url 	= 'http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 10 + '/?callback=JSON_CALLBACK'
    	
    	$http.jsonp(url).success(function(data) {

            angular.forEach(data, function(value, index) {
                var date = value.date;
                angular.forEach(value.episodes, function(tvshow, index) {
                    tvshow.date = date;
                    $scope.results.push(tvshow);

                    angular.forEach(tvshow.show.genres, function(genre, index) {
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index) {
                            if (avGenre == genre) 
                                exists = true;
                        });
                        if (!exists)
                            $scope.availableGenres.push(genre);
                    });

                });
            });

            console.log($scope.results);

            }).error(function(error) {
                console.error("error:", error);
            });
        };
});

app.filter('isGenre', function() {
	return function(input, genre) {
		if (typeof genre == 'undefined' || genre == null) {
			return input;
		} else {
			var out = [];
			for (var a = 0; a < input.length; a++) {
				for (var b = 0; b < input[a].show.genres.length; b++) {
					if (input[a].show.genres[b] == genre) {
						out.push(input[a]);
					}
				}
			}
			return out;
		}
	};
});


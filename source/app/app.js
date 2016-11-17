(function () {
	"use strict";

	var app = angular.module("mpk.codechallange", [
			"ui.router"
		]);

	app.config(["$urlRouterProvider", "$stateProvider",
		function($urlRouterProvider, $stateProvider) {

			$stateProvider.state("start", {
				url: "/start",
				templateUrl: "app/start.html",
				controller: "StartCtrl"
			}).state("play", {
				url: "/play",
				templateUrl: "app/play.html",
				controller: "PlayCtrl",
				params: {
					players: null
				}
			});

			$urlRouterProvider.otherwise("/start");
		}
	]);

	app.controller("StartCtrl", [
		"$scope",
		"$state",
		function(
			$scope,
			$state
		) {
			$scope.start = function(form) {
				if (form.$valid) {
					$state.go("play", {players: $scope.data});
				}
			};
		}
	]);

	app.controller("PlayCtrl", [
		"$scope",
		"$state",
		"$stateParams",
		"$document",
		function(
			$scope,
			$state,
			$stateParams,
			$document
		) {

			$scope.title = "Tic-tac-toe";
			$scope.players = [
				{
					id: 0,
					name: "",
					color: "cadetblue",
					symbol: "X",
					wins: 0,
					streak: 0
				},
				{
					id: 1,
					name: "",
					color: "goldenrod",
					symbol: "O",
					wins: 0,
					streak: 0
				}
			];

			// Check if player namers are available. Otherwise return to 'start' state
			if ($stateParams.players === null) {
				$state.go("start");
			} else {
				init(0);
			}

			function init(firstPlayerId) {
				$scope.board = [
					{rowNumber: 0, data: [0, 1, 2]},
					{rowNumber: 1, data: [0, 1, 2]},
					{rowNumber: 2, data: [0, 1, 2]}
				];

				$scope.currentPlayer = null;
				$scope.players[0].name = $stateParams.players.player1;
				$scope.players[1].name = $stateParams.players.player2;

				setCurrentPlayer(firstPlayerId);

				$scope.commentary = [
					$scope.players[0].name + " and " + $scope.players[1].name + " joined the game.",
					$scope.currentPlayer.name + " plays first!"
				];
			}

			function setCurrentPlayer(id) {
				$scope.currentPlayer = $scope.players[id];
			}

			function nextPlayer(id) {
				var nextPlayer = $scope.currentPlayer.id === 0 ? $scope.players[1] : $scope.players[0];
				setCurrentPlayer(nextPlayer.id);
			}

			$scope.assignTile = function(row, col) {
				if ($scope.gameover) {
					return;
				}
				if ($scope.isFree(row, col)) {
					$("#" + row + col).css("background-color", $scope.currentPlayer.color).addClass("taken");
					$scope.board[row].data[col] = $scope.currentPlayer.symbol;

					if (isWinningMove(row, col)) {
						$scope.gameover = true;
						$scope.commentary.push($scope.currentPlayer.name + " won the game!");

						// Increase current player's score
						$scope.currentPlayer.wins++;
						$scope.currentPlayer.streak++;

						// Update scoreboard
						$scope.lastWinner = $scope.currentPlayer.name;
						if ($scope.players[0].streak > $scope.players[1].streak) {
							$scope.longestStreak = $scope.players[0].streak;
							$scope.longestStreakName = $scope.players[0].name;
						} else if ($scope.players[0].streak < $scope.players[1].streak) {
							$scope.longestStreak = $scope.players[1].streak;
							$scope.longestStreakName = $scope.players[1].name;
						} else {
							$scope.longestStreak = $scope.players[1].streak;
							$scope.longestStreakName = "both players";
						}
					} else {
						$scope.commentary.push($scope.currentPlayer.name + " took a tile!");
						nextPlayer($scope.currentPlayer.id);
						$scope.commentary.push($scope.currentPlayer.name + "'s turn");
					}
				} else {
					$scope.commentary.push($scope.currentPlayer.name + " tried to take an already marked tile... duh!");
				}
			};

			$scope.isFree = function(row, col) {
				return $scope.isNumber($scope.board[row].data[col]);
			};

			$scope.isNumber = function(val) {
				return angular.isNumber(val);
			};

			$scope.reset = function() {
				// Get next player id and reset his or her streak
				var nextPlayerId = $scope.currentPlayer.id === 0 ? 1 : 0;
				$scope.players[nextPlayerId].streak = 0;
				$scope.gameover = false;

				// Reinitialises the game and lets next player start
				init(nextPlayerId);
			};

			function isWinningMove(row, col) {
				var b = [];
				b[0] = $scope.board[0].data;
				b[1] = $scope.board[1].data;
				b[2] = $scope.board[2].data;

				var i = 0;
				for (i = 0; i < b.length; i++) {
		      if (b[i][0] == b[i][1] && b[i][0] == b[i][2] && !$scope.isNumber(b[i][0])){
		        return true;
		      }
			  }
			  for (i = 0; i < b.length; i++) {
		      if (b[0][i] == b[1][i] && b[0][i] == b[2][i]  && !$scope.isNumber(b[0][i])){
		        return true;
		      }
			  }
			  if (b[0][0]==b[1][1] && b[0][0] == b[2][2]  && !$scope.isNumber(b[0][0])){
	        return true;
			  }
			  if (b[0][2]==b[1][1] && b[0][2] == b[2][0]  && !$scope.isNumber(b[2][0])){
	        return true;
			  }
				return false;
			}
		}
	]).filter("reverse", function() {
	  return function(arr) {
	    return arr.slice().reverse();
	  };
	});
}());

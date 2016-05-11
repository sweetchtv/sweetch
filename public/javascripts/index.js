var app = angular.module('phozly', []);

app.controller('photogallery', function($scope, $http){


  var PhotoFetcher = function($http){
    this.lastCreatedAt = undefined;
    this.finished = false;
    this.chains = [];
    this.running = false;
    this.finish = function(){
      this.running = false;
    }
    this.run = function(){
      if(!this.running && this.chains.length !== 0){
        var runnable = this.chains.shift()
        this.running = true;
        runnable.func.apply(this, runnable.args)
      }
    }
    this.addRunnable = function(runnable){
      this.chains.push(runnable);
      this.run();
    }
    this._fetch = function(num, callback){
      var accesor = this;
      $http({
        method: 'get',
        url: '/photos/fetch',
        params: {limit: num, lastCreatedAt: accesor.lastCreatedAt},
        headers: {accept: 'application/json'}
      }).then(function(res){
        if(res.data.length === 0) accesor.finished = true;
        accesor.lastCreatedAt = res.data[res.data.length-1] && res.data[res.data.length-1].createdAt || accesor.lastCreatedAt;
        callback(undefined, res.data);
        accesor.finish();
      }, function(){
        callback(new Error('fetch failed'));
        this.finish();
      });
    }
    this.fetch = function(){
      this.addRunnable({func: this._fetch, args: arguments});
    }
  }

  var photoFetcher = new PhotoFetcher($http);

  $scope.photos = [];
  $scope.fetch = function(num){
    if(photoFetcher.finished) return;
    photoFetcher.fetch(num, function(err, photos){
      if(err){
        console.error(err.stack);
        return;
      }
      Array.prototype.push.apply($scope.photos, photos);
    });
  };

  $scope.fetch(10);
  $(window).scroll(function(){
    if($(window).scrollTop()*1.1 >= $(document).height() - $(window).height()){
      $scope.fetch(10);
    }
  });

  $scope.like = function(index){
    $.ajax({
      method: 'post',
      url: '/photos/'+$scope.photos[index]._id+'/like'
    }).done(function(incresed){
      if(incresed){
        $scope.$apply(function(){
          $scope.photos[index].likes++;
        })
      }
    }).error(function(){
      console.dir(arguments);
      if(arguments[2] === 'Unauthorized'){
        window.location.href = '/login';
      }
    })
  }

});

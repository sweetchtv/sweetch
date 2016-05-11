
$('#imageUploaderAlias')
.click(function(){
  $('#imageUploader').click();
});


var app = angular.module('phozly', []);

app.controller('newPhoto', function($scope, $http){

  var imageReader = new FileReader();
  var imageUploader = document.querySelector('#imageUploader');

  $scope.tags = [];
  $scope.exif = {};

  imageUploader.addEventListener('change', function(event){
    imageReader.readAsDataURL(event.target.files[0]);
    EXIF.getData(event.target.files[0], function() {
      var accesor = this
      $scope.$apply(function(){
        $scope.exif = EXIF.getAllTags(accesor);
      });
    });
  });
  imageReader.addEventListener('load', function(){
    var file = this.result;
    $scope.$apply(function(){
      $scope.file = file;
      $('div.underlay').css('display', 'none');
      $('div.overlay').css('display', 'flex');
    })
  });

  $('form').keydown(function(event){
    if(event.which === 13){
      event.preventDefault();
    }
  });

  $('#tag-factory').keydown(function(event){
    if(event.which === 13 || event.which === 188){
      event.preventDefault();
      var tagValue = $('#tag-factory').val().trim();
      if(tagValue.indexOf(',') === -1 && $scope.tags.indexOf(tagValue) === -1){
        $scope.$apply(function(){
          $scope.tags.push(tagValue);
        });
      }else{
      }
      $('#tag-factory').val('');
    }
  });

  $('#tags #next-button').click(function(event){
    $('#tags, #exif, #location').removeClass('active');
    $('#exif').addClass('active');
  });
  $('#exif #next-button').click(function(event){
    $('#tags, #exif, #location').removeClass('active');
    $('#location').addClass('active');
  });

});

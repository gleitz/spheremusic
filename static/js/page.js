/*global $*/
var satellites =

$.get('/ajax/satellites', function(data) {
    satellites = data;
});
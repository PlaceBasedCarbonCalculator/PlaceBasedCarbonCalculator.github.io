var ladata;
var oacdata;

get_json = function(){
  $.getJSON("/legacy/data/la_averages.json", function (json) {
    console.log( "downloaded la json" );
    ladata = json;
})
  .done(function() {
    $('#loader').hide();
  })
  .fail(function() {
    alert("Failed to LA get JSON");
  });


$.getJSON("/legacy/data/oac_averages.json", function (json) {
    console.log( "downloaded oac json" );
    oacdata = json;
})
  .done(function() {
    $('#loader').hide();
  })
  .fail(function() {
    alert("Failed to OAC get JSON");
  });
};

document.getElementById('jquery').addEventListener('load', function () {
  jQuery.ajaxSetup({
    beforeSend: function() {
       $('#loader').show();
    },
    success: function() {}
  });
  get_json();
});









var ImageLibrary = {};

//Create shorthand variable name for lazier people
var IL = ImageLibrary;

//Default setup variable
ImageLibrary.setup = null;

//Load the data from the setup.json file
$.getJSON("setup.json", function(data) {
    ImageLibrary.setup = data;
    $(document).trigger('setupLoaded');
});

ImageLibrary.create = function(element) {
    var ele = $(element);

    //Add event listener on setupLoaded so that we know the setup file has been loaded
    $(document).on('setupLoaded', function() {
        
    });
};

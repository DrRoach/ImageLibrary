var ImageLibrary = {};

//Create shorthand variable name for lazier people
var IL = ImageLibrary;

//Default setup variable
ImageLibrary.setup = null;

//Load the data from the setup.json file
$.getJSON("setup.json", function(data) {
    ImageLibrary.setup = data;
    //Trigger event so that we know the data has been loaded
    $(document).trigger('setupLoaded');
});

//Create new HTML object to store all HTML templates
ImageLibrary.HTML = {};
//Individual image HTML
ImageLibrary.HTML.image = "<img class='{IMAGE_WIDTH}' height='{IMAGE_HEIGHT}' src='{IMAGE_SRC}'/>";
//Button HTML
ImageLibrary.HTML.button = "<button id='ilBrowseButton' data-toggle='modal' data-target='#ilModal'>Browse</button>";
//Image modal HTML
ImageLibrary.HTML.modal = "<div class='modal fade' tabindex='-1' role='dialog' id='ilModal'>" +
                            "<div class='modal-dialog modal-lg'>" +
                                "<div class='modal-content'>" +
                                    "<div class='modal-header'>" + 
                                        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                                        "<h4 class='modal-title'>Image Library</h4>" +
                                    "</div>" +
                                    "<div class='modal-body'>" +
                                    "</div>" +
                                    "<div class='modal-footer'>" +
                                        "<button type='button' class='btn btn-primary'>Upload</button>" +
                                        "<button type='button' class='btn btn-success' data-dismiss='modal'>Select</button>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>";

ImageLibrary.create = function(element) {
    //Store the selector for the image library
    var ele = $(element);

    //Add event listener on setupLoaded so that we know the setup file has been loaded
    $(document).on('setupLoaded', function() {
        ele.html(ImageLibrary.HTML.button + ImageLibrary.HTML.modal);

        ImageLibrary.loadImages(ele);
    });
};

ImageLibrary.loadImages = function(ele) {
    //Send post request to get all of the images
    $.post('/ImageLibrary.php', {
        function: 'getImages',
        setup: ImageLibrary.setup
    }, function(data) {
        //Check to see if the POST request was a success
        if (data.success == true) {
            //Start building the HTML to display the images
            var imageHtml = '<div class="row">';
            //Loop through all of the images and continue to build the HTML
            $.each(data.images, function(index, value) {
                //Get the HTML for the image and replace all of the placeholder data
                var image = ImageLibrary.HTML.image;
                image = image.replace('{IMAGE_SRC}', (ImageLibrary.setup.ImageDirectory ? ImageLibrary.setup.ImageDirectory + '/' + value : '/images'));
                image = image.replace('{IMAGE_WIDTH}', (ImageLibrary.setup.ImageSize.width ? ImageLibrary.setup.ImageSize.width : 'col-xs-3'));
                image = image.replace('{IMAGE_HEIGHT}', (ImageLibrary.setup.ImageSize.height ? ImageLibrary.setup.ImageSize.height : '100'));

                //Add the built image HTML to the HTML we have already generated
                imageHtml += image;
            });
            //Finish off the HTML ready to be added to the modal
            imageHtml += '</div>';

            //Display the images in the modal
            ele.find('.modal-body').append(imageHtml);
        } else {
            alert(data.message);
        }
    });
};

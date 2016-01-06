var ImageLibrary = {};

//Create shorthand variable name for lazier people
var IL = ImageLibrary;

//Default setup variable
ImageLibrary.setup = null;

//Images array to hold all of the selected images
ImageLibrary.selected = [];

//Library element selector
ImageLibrary.selector = null;

//Load the data from the setup.json file
$.getJSON("setup.json", function(data) {
    ImageLibrary.setup = data;
    //Trigger event so that we know the data has been loaded
    $(document).trigger('setupLoaded');
});

//Create new HTML object to store all HTML templates
ImageLibrary.HTML = {};
//Individual image HTML
ImageLibrary.HTML.image = "<div class='{IMAGE_WIDTH}'><img class='col-xs-12 ilImage' data-ilID='{IL_ID}' height='{IMAGE_HEIGHT}' src='{IMAGE_SRC}'/><span class='fa fa-times iLdeleteImage' data-iLimageId='{IL_ID}'></span></div>";
//Button HTML
ImageLibrary.HTML.button = "<button type='button' id='ilBrowseButton' class='btn btn-primary' data-toggle='modal' data-target='#ilModal'>Browse</button>";
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
                                        "<button type='button' class='btn btn-primary' id='ilUpload'>Upload</button>" +
                                        "<button type='button' class='btn btn-success' data-dismiss='modal' id='ilSelectButton'>Done</button>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>";
//Form input HTML
ImageLibrary.HTML.input = "<input type='hidden' name='ImageLibrary' value='' id='ilInput'>";
//Upload image modal
ImageLibrary.HTML.uploadModal = "<div class='modal fade' tabindex='-1' role='dialog' id='ilUploadModal'>" +
                                    "<div class='modal-dialog modal-lg'>" +
                                        "<div class='modal-content'>" +
                                            "<div class='modal-header'>" +
                                                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                                                "<h4 class='modal-title'>Upload Image</h4>" +
                                            "</div>" +
                                            "<div class='modal-body' style='text-align: center;'>" +
                                                "<button type='button' class='btn btn-primary' onclick='$(\"#ilUploadImageInput\").click()'>Select Image</button>" +
                                                "<div class='row'><span id='ilUploadPreview' class='col-xs-12'></span></div>" +
                                                "<form action='' method='post' enctype='multipart/form-data' id='ilUploadForm'><input type='file' id='ilUploadImageInput' name='ilFile' style='display: none;'></form>" +
                                            "</div>" +
                                            "<div class='modal-footer'>" +
                                                "<button type='button' class='btn btn-primary' data-dismiss='modal' id='ilUpload'>Close</button>" +
                                                "<button type='button' class='btn btn-success' id='ilUploadImageButton'>Upload</button>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>";

ImageLibrary.create = function(element) {
    //Store the selector for the image library
    var ele = $(element);
    ImageLibrary.selector = ele;

    //Add event listener on setupLoaded so that we know the setup file has been loaded
    $(document).on('setupLoaded', function() {
        //Add click listener to both select and deselect image
        ele.on('click', '.ilImage', function() {
            ImageLibrary.selectImage($(this));
        });

        //Add upload button click listener
        ele.on('click', '#ilUpload', function() {
            ImageLibrary.uploadImage();
        });

        //Add delete button click listener
        ele.on('click', '.iLdeleteImage', function() {
            ImageLibrary.deleteImage($(this));
        });

        ele.html(ImageLibrary.HTML.button + ImageLibrary.HTML.modal + ImageLibrary.HTML.input);
        ele.parent('form').parent().append(ImageLibrary.HTML.uploadModal);

        ImageLibrary.loadImages(ele);
    });
};

ImageLibrary.loadImages = function(ele) {
    //Send post request to get all of the images
    $.post('ImageLibrary.php', {
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
                //Do this step twice, once for image, once for delete
                image = image.replace('{IL_ID}', value);
                image = image.replace('{IL_ID}', value);

                //Add a row div every 4 images
                if (index % 4 == 0 && index != 0) {
                    //If this is the 4th image, close the first div
                    if (index == 4) {
                        imageHtml += '</div>';
                    }
                    imageHtml += '<div class="row">';
                }

                //Add the built image HTML to the HTML we have already generated
                imageHtml += image;

                //Add a row div every 4 images
                if (index % 4 == 0 && index != 0) {
                    imageHtml += '</div>';
                }
            });

            //Display the images in the modal
            ele.find('#ilModal .modal-body').html(imageHtml);
        } else {
            alert(data.message);
        }
    });
};

ImageLibrary.selectImage = function(image) {
    //Get the ID of the image that has been selected
    var ilID = image.attr('data-ilid');

    //Image is already selected so deselect it
    if (ImageLibrary.selected.indexOf(ilID) >= 0) {
        //Image is selected so remove the class
        image.removeClass('selected');
        //Remove the image from the selected images array
        ImageLibrary.selected.splice(ImageLibrary.selected.indexOf(ilID), 1);
    } else {
        //Image isn't selected so add the class
        image.addClass('selected');
        //Add the image to the selected images array
        ImageLibrary.selected.push(ilID);
    }

    //Change the text of the select button to show the number of selected images
    if (ImageLibrary.selected.length == 0) {
        $('#ilSelectButton').text('Done');
        $('#ilBrowseButton').text('Browse');
    } else {
        $('#ilSelectButton').text((ImageLibrary.selected.length == 1 ? 'Select 1 image' : 'Select ' + ImageLibrary.selected.length + ' images'));
        $('#ilBrowseButton').text((ImageLibrary.selected.length == 1 ? '1 image selected' : ImageLibrary.selected.length + ' images selected'));
    }

    //Update the selected images input
    $('#ilInput').val(JSON.stringify(ImageLibrary.selected));
};

//Variable to make sure that the upload listener is only added once
var uploadListenerLoaded = false;
ImageLibrary.uploadImage = function() {
    //Add listener to upload button
    if (uploadListenerLoaded == false) {
        $('body').on('click', '#ilUploadImageButton', function () {
            //Code to be ran when the form is submitted
            $('#ilUploadForm').off('submit').on('submit', (function (e) {
                //Create the formdata object
                var formdata = new FormData(this);

                //Send ajax request to upload the new image
                $.ajax({
                    url: "ImageLibrary.php",
                    type: "POST",
                    data: formdata,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function (data) {
                        //If there was an error, display an error message
                        if (data.success == false) {
                            alert(data.message);
                        } else {
                            //Reload all of the images in the image library
                            /**
                             * TODO: Find a better way to do this where all of the images don't need to be reloaded repeatedly
                             */
                            ImageLibrary.loadImages(ImageLibrary.selector);

                            //Hide the upload modal and show the library modal
                            $('#ilModal').modal('show');
                            $('#ilUploadModal').modal('hide');
                        }
                    }
                });

                //Don't reload the page
                e.preventDefault();
            }));

            //Submit the form so the above AJAX request is sent
            $('#ilUploadForm').submit();
        });
        uploadListenerLoaded = true;
    }

    //Hide the library modal and show the upload modal
    $('#ilModal').modal('hide');
    $('#ilUploadModal').modal('show');

    //Add a change listener to the file input to display the file name on the upload page
    $('#ilUploadImageInput').on('change', function() {
        //Create a file reader and display a preview of the image
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#ilUploadPreview').html('<img src="' + e.target.result + '" class="col-xs-offset-4 col-xs-4" height="' + (ImageLibrary.setup.PreviewImageHeight ? ImageLibrary.setup.PreviewImageHeight : '200') + '">');
        };
        reader.readAsDataURL(this.files[0]);
    });
};

ImageLibrary.deleteImage = function(self) {
    //Make sure that the user wants to delete the image
    if(confirm('Are you sure that you want to delete this image?')) {
        //Send AJAX request to delete image
        $.post('ImageLibrary.php', {
            function: 'delete',
            //Combine the setup json obj to pass the image ID
            setup: $.extend(ImageLibrary.setup, {'imageId': self.attr('data-iLimageId')})
        }, function(data) {
            //If there was an error, display an error message
            if (data.success == false) {
                alert(data.message);
            } else {
                //Reload all of the images in the image library
                /**
                 * TODO: Find a better way to do this where all of the images don't need to be reloaded repeatedly
                 */
                ImageLibrary.loadImages(ImageLibrary.selector);
            }
        });
    }
}
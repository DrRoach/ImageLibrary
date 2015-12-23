<?php

header('Content-Type: application/json');

//Get the name of the function being called
if (empty($_POST['function'])) {
    $function = 'upload';
} else {
    $function = htmlentities($_POST['function']);
}
//Get all of the setup data passed
if (empty($_POST['setup'])) {
    $setup = $_FILES['ilFile'];
} else {
    $setup = $_POST['setup'];
}

//Call the required function
$function($setup);

function getImages($setup) {
    //Get the directory to get the images from
    $dir = getDir($setup);

    //Make sure that it is actually a directory
    if (!is_dir($dir)) {
        echo json_encode([
            'success' => false,
            'message' => 'The Image Directory doesn\'t exist. Please create it.'
        ]);
        exit;
    }

    //Get all of the files from the given directory
    $files = scandir($dir);

    //Get all PNG and JPG images
    $images = [];
    foreach($files as &$file) {
        //Get the file extension
        $extension = strtolower(substr($file, strrpos($file, '.'), strlen($file)));

        switch($extension) {
            case '.png':
            case '.jpg':
            case '.jpeg':
                $images[] = $file;
                break;
        }
    }

    echo json_encode([
        'success' => true,
        'images' => $images
    ]);
    exit;
}

function upload($data) {
    //Check to make sure that the image has a valid extension
    switch ($data['type']) {
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
            break;
        default:
            echo json_encode([
                'success' => false,
                'message' => 'The image you tried to upload isn\'t valid. It must be either JPG or PNG.'
            ]);
            exit;
    }

    //Get the max file size, default is 250kb
    $fileSize = json_decode(file_get_contents('setup.json'))->FileSize ? : 250000;

    //Make sure the image is under the max file size, if not give error
    if ($data['size'] > $fileSize) {
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, the max file size is ' . $fileSize . ' bytes.'
        ]);
        exit;
    }

    $imageDirectory = (!empty(json_decode(file_get_contents('setup.json'))->ImageDirectory) ? json_decode(file_get_contents('setup.json'))->ImageDirectory : '');

    //Get the image directory
    $dir = getDir(['ImageDirectory' => $imageDirectory]);

    //Check to make sure that the file doesn't exist before trying to upload it
    if (file_exists($dir . '/' . $data['name'])) {
        echo json_encode([
            'success' => false,
            'message' => 'An image with that name already exists.'
        ]);
        exit;
    }

    //Upload the image
    move_uploaded_file($data['tmp_name'], $dir . '/' . $data['name']);

    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded.'
    ]);
    exit;
}

function getDir($setup) {
    //Get the directory to get the images from
    $dir = htmlentities($setup['ImageDirectory'] ? : '/images');

    //Add a slash to the start of the dir path if there isn't one already
    if (substr($dir, 0, 1) != '/') {
        $dir = '/' . $dir;
    }

    //Make sure no directory traversal can happen
    $dir = __DIR__ . str_replace('..', '', $dir);

    return $dir;
}
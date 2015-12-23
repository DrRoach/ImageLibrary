<?php

header('Content-Type: application/json');

//Get the name of the function being called
$function = htmlentities($_POST['function']);
//Get all of the setup data passed
$setup = $_POST['setup'];

//Call the required function
$function($setup);

function getImages($setup) {
    //Get the directory to get the images from
    $dir = htmlentities($setup['ImageDirectory'] ? : '/images');

    //Make sure no directory traversal can happen
    $dir = __DIR__ . str_replace('..', '', $dir);

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

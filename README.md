Image Library v0.2
===

Image Library is a plugin that can be added to your sites so that users can easily select images from a folder and submit them via a form.

Library Example:

![Image Library example](http://imgur.com/E01UGnQ.png)

Upload Example:

![Image upload example](http://imgur.com/myVcMo7.png)

Example Code:

```
<form action="" method="post">
    <div id="il"></div>

    <input type="submit" name="submit" value="Submit">
</form>
<script>
    IL.create('#il');
</script>
```

Form Data:

```
"["image1.jpg",image5.jpg","bestImage.jpg"]"
```

###setup.json
This is the file in which you can customize the plugin.

Examples:

#####ImageDirectory
The directory in which to get images from and where to save them.

#####ImageSize
######width
Add a class to set the width of each image, best to use a bootstrap class.

######height
Set the height of each image in pixels.

#####PreviewImageHeight
This is the height of the preview image that is shown when the user is selecting a image to upload. You may want this to be different to the library images' height as only one image is display on this page whereas many could be shown on the library. This is a pixel value e.g 200.

#####FileSize
The max file size of images that are being uploaded. This value is in bytes.


###Current Version
In version 0.2 the user can select and deselect images and then submit them via a form. They can also upload new images from their machine.

###Roadmap

####Version 1.0
- [x] Select images
- [x] Upload images
- [ ] Delete images
- [ ] Basic image editing
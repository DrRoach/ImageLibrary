Image Library
===

Image Library is a plugin that can be added to your sites so that users can easily select images from a folder and submit them via a form.

Example:

![Image Library example](http://imgur.com/E01UGnQ.png)

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
This is the file in which you can customize the plugin. You can set the directory in which to save and get the images from and also set the width and height of the images.

Examples:

#####ImageDirectory
The directory in which to get images from and where to save them.

#####ImageSize
######width
Add a class to set the width of each image, best to use a bootstrap class.

######height
Set the height of each image in pixels.


###Current Version
In version 0.1 the user can select and deselect images and then submit them via a form.

###Roadmap

####Version 1.0
- [x] Select images
- [ ] Upload images
- [ ] Delete images
- [ ] Basic image editing
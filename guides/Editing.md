# Editing Guide

The Encounter site is specifically designed to allow easy editing - updating descriptions, adding images, adding artifacts - by everyone on the team. This guide describes what kinds of edits can be made by the team, and what edits should be referred to the programmers.

## Actually making an edit

Github, the site where we host the code and where you're probably reading this, supports editing a file right from your browser. Simply navigate to the file, by clicking for example `traditions`, and then `buddhism.md`, and then click `Edit` in the corner of the file contents.

This will open an editor view where you can edit the Markdown code, or press `Preview` to see what the text will look like. **NOTE:** The slightly modified format of artifacts, see below, screws up the preview. Don't worry about size being a heading, or the rows of squiggles. You can, however, check that any links or other things in the artifact description came out correctly.

Once your edit is complete, you need to go to the bottom of the page, where there's a section called `Commit changes`. You should enter a description of your change in the small box, like "Adding three new artifacts to Buddhism". In the large box you can give any more detailed comments, like mention which artifacts, the reason you deleted an artifact, or whatever.

These changes and the description you write are permanently preserved by Github. Nothing is ever lost, we can see every change, recover any old version of a file, recover a deleted file. You **cannot** do permanent damage with a bad edit on Github , so don't be nervous to make an edit.

## Traditions and Artifacts

### Text

Tradition and artifact descriptions are in a file such as `traditions/buddhism.md`. There is one file per tradition, no matter how many artifacts or images in that tradition. These are the master files, and determine what artifacts exist, what images each artifact contains, and the order in which the artifacts will be displayed. If you add an artifact here, it will be updated in its tradition page, in search, everywhere.

These are the main content files, and therefore the primary place the Encounter team should be editing. They are in a slightly modified [Markdown](http://daringfireball.net/projects/markdown/basics) format.

The first section is the top-level description of the tradition. This is intended to be a paragraph or two giving brief background on the origins, history, and present understanding of the tradition. Generally we want to conclude with links to other sites (eg. Wikipedia) with more information.

Following this top-level description is a sequence of one or more artifact descriptions. An artifact description looks like this:

    ---
    title: Title of the Artifact
    images: ["trd.myartifact1.jpg", "trd.myartifact2.jpg"]
    origin: Somewhere
    date: Somewhen
    size: 6 inches
    ---
    This is the description of the artifact. It is any number of paragraphs of text, formatted in Markdown.
    We generally include a link at the bottom, like this.

    [Wikipedia: AngularJS](http://en.wikipedia.org/wiki/AngularJS)

- The `title`, `origin`, `date` and `size` are all just text.
- Titles should be title-cased: That is, Important Words Capitalized.
- `images` is special. It should always look like the above example: square brackets `[ ]` with quoted file names inside, separated by commas. Spaces don't matter outside the quotes.
    - If you're adding new artifact images, they are named, for example, `fun.buddychrist.jpg`. That is, they have a three-letter identifier for the tradition they belong to, a name, and are in `.jpg` format (`jpg` is designed for photographs, so this is generally the format we get from the camera).
    - This naming pattern is just convention: you could name the image `wacky_other_names.png` and it will load correctly. We should stick to the convention though, since it makes it easy to see what images belong to which traditions.
- The description of the artifact may be quite long, and it continues until there is another line of `---`, which is the first line of the next artifact.
- The last artifact in the file is not followed by anything, the file simply ends.

### Images

There are three sizes of every artifact image: thumbnails, medium size, and large. Thumbnails appear in the strip beneath the artifact image, and in the Overview of a tradition. Medium size is the main artifact picture displayed beside its description. Large size is used for the magnifier. All three files have exactly the same name, but are in different folders. Large are in `assets/big`, thumbnails in `assets/thumbs`, and medium in simply `assets`.

Braden wants to develop a small tool to do these resizes automatically, but that has not been done yet. The following is a guide to taking a photo from your camera and resizing it as needed for this site.

Generally, a new photo fresh from a camera is much too big even for large size. I reduced the originals to roughly half their size to become the large images, but that depends on the camera used. Whatever size the images come out of the camera, they should be shrunk to be about `1400x1000` (landscape, 4:3), `1800x1000` (landscape, widescreen), `1000x1400` (portrait, 4:3), or `1000x1800` (portrait, widescreen). These sizes are rough, they'll generally come out something more like `1024x1368`, I'm just giving the rough idea. The magnifier will adapt to the size of the image.

**Important:** Each of these three sizes should be made directly from the original image. Don't shrink the original to get large, shrink large to get medium, and shrink medium to get the thumbnail. Each time you shrink the image, its quality is damaged. Therefore each size should be made directly from the original, to maintain as much quality as possible.

Medium size images should be adjusted until their **height** is `300`. Some images will be `400x300`, others will be `116x300`, that's all fine. The site will adapt so long as the height does not exceed `300`.

Thumbnails should be adjusted until they would fit within a `74x74` box. Most of the thumbnails are `74x55` or `55x74`, but anything smaller than `75` in both dimensions is fine.

## Main page content

This is yours to edit, and it lives in `views/main.html`, in HTML format. However, because of the delicate positioning of the text around the globe image on the main page, it's probably best to ask Braden to adjust this.

## Search

As noted elsewhere, search is completely based on the artifact descriptions in `traditions/*.md`. There is nothing special that needs to be done once you have created a new artifact, removed an artifact, or modified an existing one; search will simply be updated.

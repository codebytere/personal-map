##Personalized Map
_Shelley Vohr_

#### What does it do?

This application allows for you to view and edit personalized map markers according to a series of predetermined categories.

#### How do I use it?

Once you navigate to the link, you'll see a map with icons on it; these icons are coded to the category type they've been filed under. To add a new location, click the `+` sign in the sidebar. From there you can fill location fields, and the new location will be automatically placed in the map and updated on the sidebar. Clicking on any location name in the sidebar brings up an edit screen, and clicking the trash icon will remove the icon from the database (and thus the sidebar and map). I've created a testing account for the public version of this project, so feel free to add and edit things! 

#### How was it built?

Built almost completely in javascript, node-ified by Browserify.

#### **How do you run it?**

At the moment, in order to run the project you'll need to create a (free) account and base on [Airtable](airtable.com).  The header fields need to be (in no specific order) :

`title` `address` `lat` `lng` `link`

You'll need to:
-  `git clone` the project
-  run `npm install`
-  replace all instances of **API_KEY** with your api key
- replace all instances of **BASE_KEY** with your base key
- replace all instances of **BASE_NAME** with your base key
-  run  `http-server -o`

#### **Planned Updates?**

Soon:
-  Ability to see yelp reviews for a given location
-  Ability to add locations from the search bar

Future TBD:
-  Ability to add categories


#### **Recognized Bugs**

The sidebar appears when a new location is being added, if the sidebar was already open.

Row deletion issues in Airtable make it so that records exist as blank, creating some weirdness on location pulls.

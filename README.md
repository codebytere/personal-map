##Personalized Map
_Shelley Vohr_

#### What does it do?

This application allows for you to view and edit personalized map markers according to a series of predetermined categories.

#### How was it built?

Built almost completely in javascript, node-ified by Browserify.

#### **How do you run it?**

At the moment, in order to run the project as intended you'll need to create a (free) account and base on [Airtable](airtable.com).  The header fields need to be (in no specific order) :

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

My horrendous commit messages...I'll amend those soon I swear 

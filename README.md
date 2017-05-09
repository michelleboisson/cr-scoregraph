# cr-scoregraph
A data-driven prototype for visualizing the range of tested refrigerators and their scores

https://cr-overallscoregraph.herokuapp.com/ 

## How to Run the App on your Local Machine
- install meteor https://www.meteor.com/install
- using Terminal command line, "cd" into this directory
- "meteor" to run the app
- open a new browser window, navigate to http://localhost:3000

## How to edit the product category
The app is making an API call to get all products in a category, and copies the data to a database.
The data displayed in the app is from this database.

STEP 1: Change API_CATEGORY in glb.js

STEP 2: While the app in running in your browser, open the console and run " Meteor.call('refreshProducts') "


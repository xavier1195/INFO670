# Read Me

## Bird's I've Seen Today App

### Application Purpose:
This application is designed to allow a user to input birds they have seen throughout the day into a running list. They are able to add and remove birds from the list. The current day list displays bird name and time list item was added. It also connects to an external database which allows the user to see a running lists of every bird they have inputed using the app and displays them in an addtional screen called 'database'. This will show the user the bird name and timestamp for easy bird tracking.

### Target Audience:
This application is design for Andriod users with a passion for bird watching. The current design is a simple bird list that connects to external database, future version may connect to existing bird databases for easier bird find/autocomplete, additional bird information such as latin name and location.

This app is a simple list tool for a user to add the birds they have seen today to their list. They can add and remove birds.

### Features
- Add Birds to List
- Remove Last Bird
- Clear all Birds from List
- View Saved Birds in seperate Database Screen
- Navigation using Hamburger
- Storage using AsyncStorage

#### Install and Setup

1. Clone Repository
bash git clone https://github.com/xavier1195/INFO670.git
cd ListManagementApp

2. Install dependencies
npm install
npm install -g expo-cli

3. Install Required Packages
npx expo install @react-navigation/native
npx expo install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-masked-view/masked-view
npx expo install @react-native-async-storage/async-storage
npm install firebase

4. Run App
- npm start
- a

#### Structure:

.
├── App.js                           # Entry point with drawer navigation
├── firebaseConfig.js               #Config external database using Google's free firebase database

├── /components
│   └── BirdListView.js             #Trying to follow good coding principles/Iskof
|   └── autoCompleteInput.js        #Take in eBird database and display the first 10 birds for easy identification -

├── /database
│   ├── database.js                 #AsyncStorage for local bird list (local-only, today)
│   └── firebaseDatabase.js         #Firebase Firestore integration (all-time bird log)
|   └── eBirdAPI.js                 #eBird API connection - Cornell's free bird API (used their current app as inspiration)

├── /screens
│   ├── HomeScreen.js               # Main screen: Add birds to local list + sync to cloud
│   └── DatabaseScreen.js           # Display synced list from Firebase (all birds ever logged)


### To Use:
1. Start typing a bird name in the text field, click and select desired bird from dropdown.
2. Click Add Bird button to add the bird to todays (and external) database
2. Select hamburger menu on top left of screen to select 'Database' screen
3. Review to ensure newly added bird is in the database
4. If desired, return to homescreen to add more birds or select 'clear today's birds' or 'remove last bird' to remove birds from today's list*
*Removing birds only removes them from the current bird list an not external database (or databse screen)

### Future State:
- Update Autocomplete to possibly allow non-eBird birds
- Add Latin name and other bird info from ebird API
- Possibility to create a bird and add information to database AND suplment that into the dropdown autocomplete
- Add bird pictures
- Add location
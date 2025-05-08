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

### Install and Setup

# 1. Clone Repository
git clone https://github.com/xavier1195/INFO670.git
cd ListManagementApp

# 2. Install dependencies
npm install
npm install -g expo-cli

# 3. Install Required Packages
npx expo install @react-navigation/native
npx expo install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-masked-view/masked-view
npx expo install @react-native-async-storage/async-storage
npx expo install expo-checkbox
npm install firebase

# 4. Run the App
npm start


### Structure:

.
├── App.js                          # Entry point with drawer navigation
├── firebaseConfig.js              # Firebase setup for Firestore backend

├── /components
│   ├── BirdListView.js            # Shared bird list component
│   ├── FlockBirdItem.js           # View for flock bird display
│   ├── autoCompleteInput.js       # Dropdown search from eBird API

├── /database
│   ├── database.js                # AsyncStorage logic
│   ├── firebaseDatabase.js        # Cloud CRUD for birds
│   ├── eBirdAPI.js                # Bird autocomplete suggestions
│   ├── getFlockBirds.js           # Fetch birds from users in your flocks
│   ├── getScientificName.js       # Get Latin name from eBird
│   └── getWikapediaImage.js       # Get image using Wikipedia API

├── /screens
│   ├── HomeScreen.js              # Bird input form and today’s bird list
│   ├── DatabaseScreen.js          # All logged birds from cloud
│   ├── ProfileScreen.js           # Signup/Login, favorite bird, flock selection
│   └── FlocksScreen.js            # View birds from users in your same flock(s)



### To Use:
Navigate to Home screen.

1. ype a bird name in the search box. Select a result from the dropdown.

2. Click Add Bird to save it locally and remotely.

3. Tap the ☰ hamburger menu to view the Database screen to see all saved birds.

4. Go to Profile to create a user with username/email/favorite bird and join one or more Flocks.

5. Visit the Flocks screen to see birds added by other users in the same flocks.

### Future State:
- Update Autocomplete to possibly allow non-eBird birds
- Caching for Wikapedia images and latin names to speed up app
- Possibility to create a bird and add information to database AND suplment that into the dropdown autocomplete
- Bird states, number of 'seen', historical context related birds ect.
- notifications for sightings within your 'flock'
- peer to peer messaging and collaboration
- Add location
- ML name suggestions based on bird photo upload
- audio for birds
- ML audio to bird suggestion
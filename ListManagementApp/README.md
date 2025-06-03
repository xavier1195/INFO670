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

.<br>
├── App.js                          # Entry point with drawer navigation<br>
├── firebaseConfig.js              # Firebase setup for Firestore<br>

├── /components<br>
│   ├── BirdListView.js            # Displays bird list<br>
│   ├── FlockBirdItem.js           # Individual bird card in Flocks<br>
│   ├── autoCompleteInput.js       # eBird-based search dropdown<br>

├── /database<br>
│   ├── database.js                # AsyncStorage for local storage<br>
│   ├── firebaseDatabase.js        # Cloud CRUD for birds<br>
│   ├── eBirdAPI.js                # eBird autocomplete integration<br>
│   ├── getFlockBirds.js           # Retrieves birds from user's flocks<br>
│   ├── getScientificName.js       # Gets Latin names from eBird<br>
│   └── getWikapediaImage.js       # Gets images from Wikipedia<br>

├── /screens<br>
│   ├── HomeScren.js              # Main input screen<br>
│   ├── DatabaseScreen.js          # View all birds logged<br>
│   ├── ProfileScreen.js           # User login/signup and preferences<br>
│   └── FlocksScreen.js            # See your Flock's birds and messages<br>



### To Use:
Navigate to Home screen.

1. Click the hamburger menu on the top left and select Profile Screen<br>
![image](https://github.com/user-attachments/assets/5d716e47-17c9-4ef6-b5e3-856f2fc13eb9)
2. Create profile and select 'Urban Birds' Flock or another multiple<br>
  ![image](https://github.com/user-attachments/assets/10670ebf-8533-4cfc-85d4-8535df5d8f05)
3. Go to home screen and type a bird name in the search box. Select a result from the dropdown.<br>
![image](https://github.com/user-attachments/assets/27d595d2-c471-43a5-b782-b2027444f6ae)
4. Tap the ☰ hamburger menu to view the Database screen to see all saved birds.<br>
![image](https://github.com/user-attachments/assets/686dc6b6-50ff-41bb-96b1-5a730af7cd70)
5. Visit the Flocks screen to see birds added by other users in the same flocks and see messages by others in your Flock (Use Urban Birds when signing up to see prepopulated Flock)<br>
![image](https://github.com/user-attachments/assets/44f1146a-91bf-400b-a1c2-2603d90509a8)

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
- gamification


## notes

### ML dataset
- use nabirds dataset to create model for birds\
    - use learned modeling by utilizing pre-trained image model as jumping off point: EfficientNetB0
- challenge: unknown birds not in image dataset should be identifiable
    - use eBird to grab descriptions of birds or another bird description dataset to help algo understand what to look for the used trained model to ingest the characteristics to determine potential birds...

# Read Me

## Bird's I've Seen Today App

### Application Purpose:
This application is designed to allow a user to input birds they have seen throughout the day into a running list. They are able to add and remove birds from the list. The current day list displays the bird name and the time the list item was added. It also connects to an external database, which allows the user to see a running list of every bird they have input using the app and displays them in an additional screen called 'database'. This will show the user the bird name and timestamp for easy bird tracking. The application also contains communities known as 'flocks'. Here, users can interact with each other by sending messages and seeing other users' most recent bird log. You can also play games (in beta), bird race which takes values from our bird trait database (wing legnth and mass) and calculate the birds speed and bird survival which calculate allows you to select a bird to compete against a random bird from your database and has a winner based on a variety of scenarios. Finally, you can upload a bird image and use our image recognition model to determine what type of bird it is (beta).

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
- Cloud storage via Firebase
- MongoDB integration for bird traits
- Profile and Flocks screens
- Game and Image Recognition modules

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
npx expo install expo-checkbox
npm install react-native-image-picker
npm install axios
npm install react-native-document-picker react-native-paper react-native-vector-icons
npx expo install expo-image-picker


# 4. Run the App
connect to Drexel VPN
npm start
a

### API Connections and Dependencies
This project interacts with multiple APIs and relies on various React Native packages.

**API Connections**
- Firebase Firestore for cloud storage
- Cornell Lab's eBird API for bird suggestions and scientific names
- Node/Express API at http://node.cci.drexel.edu:9651 for bird trait data
- Wikipedia REST API for bird images
- Google Cloud Function for running image recognition model and returning JSON prediction (WIP)

**Key Dependencies**
- firebase, axios
- @react-navigation/native, @react-navigation/drawer
- react-native-gesture-handler, react-native-reanimated, react-native-screens, react-native-safe-area-context, @react-native-masked-view/masked-view
- @react-native-async-storage/async-storage, expo-checkbox
- react-native-image-picker, react-native-document-picker, expo-image-picker
- react-native-paper, react-native-vector-icons

### Structure:

.<br>
├── App.js                          # Entry point with drawer navigation<br>
├── firebaseConfig.js              # Firebase setup for Firestore<br>
├── styles.js                      # Global styling<br>
├── assets                         # folder for images<br>


├── /components<br>
│   ├── BirdListView.js            # Displays bird list<br>
│   ├── BirdListItem.js            # Single bird item<br>
│   ├── FlockBirdItem.js           # Birds within flocks<br>
│   ├── autoCompleteInput.js       # eBird-based search dropdown<br>
│   ├── BirdAvatar.js              # Game avatar (WIP)<br>
│   ├── BirdDetailModal.js         # Bird traits from MongoDB<br>
│   ├── BirdImage.js               # Handles bird images<br>
│   ├── BirdRace.js                # Game component<br>
│   ├── GameEngine.js              # TBD - runs game<br>
│   └── Obstacle.js                # TBD - game object<br>
│   └── SurvivalGame.js            # module for bird survival game based on random environment (desert/forest/etc) and different metrics based on the bird and its ability in that environment <br>

├── /database<br>
│   ├── database.js                # AsyncStorage for local storage<br>
│   ├── firebaseDatabase.js        # Cloud CRUD for birds<br>
│   ├── eBirdAPI.js                # eBird autocomplete integration<br>
│   ├── getFlockBirds.js           # Retrieves birds from user's flocks<br>
│   ├── getScientificName.js       # Gets Latin names from eBird<br>
│   ├── getWikapediaImage.js       # Gets images from Wikipedia<br>
│   ├── flockMessages.js           # Stores and sends messages<br>
│   ├── getBirdTraits.js           # Bird trait data via Node/MongoDB<br>
│   └── userDatabase.js            # User accounts via Firebase<br>


├── /screens<br>
│   ├── HomeScreen.js              # Main input screen<br>
│   ├── DatabaseScreen.js          # View all birds logged<br>
│   ├── ProfileScreen.js           # User login/signup<br>
│   ├── FlocksScreen.js            # View flocks and messages<br>
│   ├── GameScreen.js              # WIP game screen<br>
│   └── ImageRecognitionScreen.js  # Upload and classify images<br>



### To Use:
Navigate to Home screen.

1. Click the hamburger menu on the top left and select Profile Screen which uses firebase to read and write to a nosql database<br>
![image](https://github.com/user-attachments/assets/5d716e47-17c9-4ef6-b5e3-856f2fc13eb9)
2. Create profile and select 'Urban Birds' Flock or another multiple<br>
  ![image](https://github.com/user-attachments/assets/10670ebf-8533-4cfc-85d4-8535df5d8f05)
3. Go to home screen and type a bird name in the search box. Select a result from the dropdown.<br>
![image](https://github.com/user-attachments/assets/27d595d2-c471-43a5-b782-b2027444f6ae)
4. Tap the ☰ hamburger menu to view the Database screen to see all saved birds.<br>
![image](https://github.com/user-attachments/assets/686dc6b6-50ff-41bb-96b1-5a730af7cd70)
5. Click on a bird to bring up a module that calls MongoDB using Express via Node for more bird information (reading from a nosql database)<br>
![Screenshot 2025-06-04 at 8 11 33 PM](https://github.com/user-attachments/assets/3ee962b3-f0b2-4ceb-904f-7522dd4eed2f)
6. Visit the Flocks screen to see birds added by other users in the same flocks and see messages by others in your Flock (Use Urban Birds when signing up to see prepopulated Flock)<br>
![image](https://github.com/user-attachments/assets/44f1146a-91bf-400b-a1c2-2603d90509a8)
7. Added Game Screen - Two games: Bird race (Mass & Weight = bird speed calculation) and Bird Survival (Five Environments: Desert, Mountain, Forest, Beach, Jungle & Multitude of bird attribute calculations with weights to determine winner)<br>
![Screenshot 2025-06-11 at 10 29 25 PM](https://github.com/user-attachments/assets/0208f284-3732-4714-a7d2-bfee6d79049f)
![Screenshot 2025-06-11 at 10 31 01 PM](https://github.com/user-attachments/assets/16d042b6-94c0-4a8a-92f3-ca48b21be230)
![Screenshot 2025-06-11 at 10 31 09 PM](https://github.com/user-attachments/assets/336711f3-a131-4a85-89a0-dbc1d2574802)
![Screenshot 2025-06-11 at 10 30 26 PM](https://github.com/user-attachments/assets/c2dec41f-c98a-434b-92cc-ec5623e33563)

9. Added Image Recognition Screen (model is performing at ~86% accuracy on a limited dataset [50k images/222 species]. Model runs but confidence is subpar, need to check py script and/or enhance model<br>
![Screenshot 2025-06-11 at 10 25 43 PM](https://github.com/user-attachments/assets/38d9cb00-173a-4d74-ae52-a06fc7f142f0)


### Future State:
- Update Autocomplete to possibly allow non-eBird birds
- Caching for Wikapedia images and latin names to speed up app
- Possibility to create a bird and add information to database AND suplment that into the dropdown autocomplete
- Bird states, number of 'seen', historical context related birds ect.
- notifications for sightings within your 'flock'
- peer-to-peer messaging and collaboration
- Add location
- audio for birds
- ML audio to bird suggestion

## notes

### ML dataset
- use nabirds dataset to create model for birds\
    - use learned modeling by utilizing pre-trained image model as jumping off point: EfficientNetB0
- challenge: unknown birds not in image dataset should be identifiable
    - use eBird to grab descriptions of birds or another bird description dataset to help algo understand what to look for the used trained model to ingest the characteristics to determine potential birds...

/Users/franpoeske/Desktop/Drexel MSIS/INFO670/birds/bird_classifier_model_fa.pkl

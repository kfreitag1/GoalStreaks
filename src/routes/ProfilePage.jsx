import {useLoaderData} from "react-router-dom";
import {ref, onValue, get} from "firebase/database";
import {useEffect, useState} from "react";
import { database } from "../FirebaseConfig.js";
import'./ProfilePage.css';
import GoalList from "../components/GoalList.jsx";

/**
 * Function to get the userID from the URL
 * @param params
 * @return {Promise<{userId: *}>}
 */
export async function loader({ params }) {
    const userId = params.userId;
    return { userId };
}

async function getUID(userId) {
    const userDatabaseRef = ref(database, "users/" + userId);
    const uidSnapshot = await get(userDatabaseRef);
    return uidSnapshot.val();
}

/**
 * ProfilePage that displays the habit/goal information for a user
 *
 * @param isEditable Boolean - Whether the page is editable or not
 *                   (only if the user is authenticated and logged in)
 * @return {JSX.Element}
 * @constructor
 */
export default function ProfilePage({ isEditable }) {
    const { userId } = useLoaderData();
    const [userData, setUserData] = useState(null);

    // Update userData from firebase
    useEffect(() => {
        // Get UID
        getUID(userId).then((uid) => {
            // Nothing in user
            if (uid === null) {
                //TODO: have 404 page
                return
            }

            const dataDatabaseRef = ref(database, "data/" + uid);
            onValue(dataDatabaseRef, (snapshot) => {
                setUserData(snapshot.val());
                console.log(userData)
            })
        })
    }, []);


    // useEffect(()=>{
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             // User is signed in, see docs for a list of available properties
    //             // https://firebase.google.com/docs/reference/js/firebase.User
    //             const email = user.email;
    //             // ...
    //             alert("logged in user: " + email);
    //         } else {
    //             // User is signed out
    //             // ...
    //             alert("user is logged out")
    //         }
    //     });
    //
    // }, [])

    return <>
        <div>
            <h1>
                GoalStreak
            </h1>
        </div>
        <div>userId: {userId}</div>

        {isEditable ? <p>Editable!</p> : <p>NOT Editable!</p>}
        {userData !== null ?
            <>
                <p>Name: {userData.name}</p>
                <GoalList goals={userData.goals ?? []}/>
            </>
            : null}
    </>
}
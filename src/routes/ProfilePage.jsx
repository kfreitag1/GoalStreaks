import {useLoaderData, useNavigate} from "react-router-dom";
import {ref, onValue, get} from "firebase/database";
import {useEffect, useState} from "react";
import {auth, database} from "../FirebaseConfig.js";
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

function getShareLink() {
    const link = window.location.href
    const lastSlashIndex = link.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
        return link.substring(0, lastSlashIndex);
    }
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
    const navigate = useNavigate();
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
                setUserData({
                    ...snapshot.val(),
                    uid: uid
                });
                console.log({
                    ...snapshot.val(),
                    uid: uid
                })
            })
        })
    }, []);

    const logOut = async () => {
        await auth.signOut();
        navigate("/")
    }

    return <>
        <header className="ProfilePage-header">
        <div>
            <h1>
                {userId.charAt(0).toUpperCase() + userId.substring(1)}'s GoalStreak
            </h1>
        </div>
        <div>userId: {userId}</div>

        {isEditable ? <p>Editable!</p> : <p>NOT Editable!</p>}
        {isEditable ? <button onClick={logOut}>Log Out</button> : null}
        {isEditable ? <>
            <p>Link to share: <a href={getShareLink()}>{getShareLink()}</a></p>
        </> : null}
        {userData !== null ?
            <>
                <p>Name: {userData.name}</p>
                <GoalList goals={userData.goals} uid={userData.uid} isEditable={isEditable}/>
                <button>Add new goal</button>
            </>
        : null}
        </header>
    </>
}


import {ref, set} from "firebase/database";
import {database} from "../FirebaseConfig.js";



export default function Goal({ goalData, uid, index, isEditable }) {

    // Compute if the goal is complete today
    const currentDate = new Date()
    let previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 1)

    const lastCompletionDate = new Date(goalData.lastdate)
    const isComplete =
        currentDate.getFullYear() === lastCompletionDate.getFullYear() &&
        currentDate.getMonth() === lastCompletionDate.getMonth() &&
        currentDate.getDate() === lastCompletionDate.getDate();
    const lastCompleteDateString = lastCompletionDate.toLocaleDateString()

    // Streak is broken if NOT complete AND if NOT previous day
    const isStreakBroken = !isComplete &&
        !(previousDate.getFullYear() === lastCompletionDate.getFullYear() &&
        previousDate.getMonth() === lastCompletionDate.getMonth() &&
        previousDate.getDate() === lastCompletionDate.getDate());

    // Set the goal's lastdate to right now (makes it complete)
    const completeGoal = async () => {
        const dateRef = ref(database,
            "data/" + uid + "/goals/" + index + "/lastdate");
        const streakRef = ref(database,
            "data/" + uid + "/goals/" + index + "/streak");

        await set(dateRef, currentDate.getTime()).catch((error) => {
            alert(error)
            return
        })
        await set(streakRef, isStreakBroken ? 1 : goalData.streak + 1)
    }

    return <li style={{backgroundColor: isComplete ? "lightgreen" : "lightgray"}}>
        <div>UID: {uid}</div>
        <div>name: {goalData.name}</div>
        <div>streak: {goalData.streak}</div>
        <div>last completion date: {lastCompleteDateString}</div>
        {isEditable && !isComplete ?
            <button onClick={completeGoal}>Complete</button>
        : null}
    </li>
}
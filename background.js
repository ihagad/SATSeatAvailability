import { fetchAvailableSeats } from './api/fetchAvailableSeats.js'

const ALARM_JOB_NAME = "DROP_ALARM"
let lastNotifiedCenterCodes = new Set();

let cachedPref = {};

chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled reason:", details.reason);
})

chrome.runtime.onMessage.addListener(data => {
    const {event, prefs, type} = data

    //SAT test dates
    if(type == "SAT_DATES"){
        console.log("Received SAT test dates:", data.data);
        chrome.storage.local.set({ satDates: data.data });
        return;
    }

    switch (event) {
        case 'onStop':
            handleOnStop();
            break;
        case 'onStart':
            handleOnStart(prefs);
            break;
        default:
            break;
    }
})

const handleOnStop = () => {
    console.log("On stop in background")
    setRunningStatus(false);
    stopAlarm();
    lastNotifiedCenterCodes = new Set();
    cachedPref = {};
}

const handleOnStart = (prefs) => {
    console.log("prefs recieved:", prefs)
    cachedPref = prefs
    chrome.storage.local.set(prefs)
    setRunningStatus(true);
    createAlarm();
}

const setRunningStatus = (isRunning)=> {
    chrome.storage.local.set({ isRunning })
}

const createAlarm = () => {
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
        if(!existingAlarm){
            chrome.alarms.create(ALARM_JOB_NAME, {periodInMinutes: 1.0})
        }
    })
}

const stopAlarm = () => {
    chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get(["testDate", "zipcode", "radius"], (prefs) => {
        if (prefs.testDate && prefs.zipcode && prefs.radius) {
            cachedPref = prefs; // <-- now re-populated correctly
            runSeatCheck(prefs);
        } else {
            console.warn("No stored prefs available.");
        }
    });
})

async function runSeatCheck({ testDate, zipcode, radius }) {
    try {
        const availableCenters = await fetchAvailableSeats(cachedPref);

        const newCenters = availableCenters.filter(center => !lastNotifiedCenterCodes.has(center.code));

        if(newCenters.length > 0){
            const center = newCenters[0];
            chrome.notifications.create({
                type: "basic",
                iconUrl: "images/icon-128.png",
                title: "SAT Seat Available!",
                message: `Seat available at ${center.name}. ${center.distance.toFixed(1)} miles away`
            }, (id) => {
                if (chrome.runtime.lastError) {
                    console.error("Notification error:", chrome.runtime.lastError.message);
                } else {
                    console.log("Notification created with ID:", id);
                }
            });
            lastNotifiedCenterCodes.add(center.code);
        }

        if (newCenters.length > 0) {
            console.log(`${newCenters.length} new centers with availability`);
        } else {
            console.log("Checked: no new seats found.");
        }

        chrome.storage.local.set({ availableCenters });
    } catch (error) {
        console.error("Failed to check seats:", error);
    }
}
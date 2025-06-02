//ELEMENTS

const testDateElement = document.getElementById('testDate');
const zipcodeElement = document.getElementById('zipcode');
const radiusElement = document.getElementById('radius');

//BUTTONS
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

//STATUS
const runningSpan = document.getElementById('runningSpan');
const stopSpan = document.getElementById('stopSpan');

//ERROR
const testDateError = document.getElementById("testDateError");
const zipcodeError = document.getElementById("zipcodeError");
const radiusError = document.getElementById("radiusError");

const hideElement = (elem) => {
    elem.style.display = 'none'
}

const showElement = (elem) => {
    elem.style.display = ''
}

const disableElement = (elem) => {
    elem.disabled = true;
}

const enableElement = (elem) => {
    elem.disabled = false;
}

const handleOnStartState = () => {
    showElement(runningSpan)
    hideElement(stopSpan)

    disableElement(startButton)
    enableElement(stopButton)

    disableElement(testDateElement)
    disableElement(zipcodeElement)
    disableElement(radiusElement)
}

const handleOnStopState = () => {
    showElement(stopSpan)
    hideElement(runningSpan)

    disableElement(stopButton)
    enableElement(startButton)

    enableElement(testDateElement)
    enableElement(zipcodeElement)
    enableElement(radiusElement)
}

const performsOnStartValidations = () => {
    if(!testDateElement.value){
        showElement(testDateError)
    }else {
        hideElement(testDateError)
    }

    if(!zipcodeElement.value){
        showElement(zipcodeError);
    }else {
        hideElement(zipcodeError)
    }

    if(!radiusElement.value){
        showElement(radiusError);
    }else {
        hideElement(radiusError)
    }

    return testDateElement.value && zipcodeElement.value && radiusElement.value;
}

startButton.onclick = () => {
    const allFieldsValid = performsOnStartValidations();

    if(allFieldsValid){
        handleOnStartState();
        const prefs = {
            testDate: testDateElement.value,
            zipcode: zipcodeElement.value,
            radius: radiusElement.value
        }
        chrome.runtime.sendMessage({ event: 'onStart', prefs})
    }
}

stopButton.onclick = () => {
    handleOnStopState();
    chrome.runtime.sendMessage({ event: 'onStop' })
}

chrome.storage.local.get(["zipcode", "radius", "isRunning"], (result) => {
    const {zipcode, radius, isRunning} = result;

    if(zipcode){
        zipcodeElement.value = zipcode
    }

    if(radius){
        radiusElement.value = radius
    }

    if(isRunning){
        handleOnStartState();
    }
    else{
        handleOnStopState();
    }
})

chrome.storage.local.get("satDates", ({ satDates }) => {
    if (!satDates || satDates.length === 0) return;

    testDateElement.innerHTML = "";

    satDates.forEach(({ label, value }) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        testDateElement.appendChild(option);
    });

    chrome.storage.local.get("testDate", ({ testDate }) => {
        if (testDate) testDateElement.value = testDate;
    });
});

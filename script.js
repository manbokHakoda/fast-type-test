// ==========================================================
// FAST TYPE — 1 МИНУТЫН БИЧИЛТИЙН ТЕХНИКИЙН ШАЛГАЛТ
// ==========================================================

// ЭНД Google Apps Script Web App URL-ээ оруулна.
const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbyPu_Yob7XPxtPTpKTra4tMsOZPphr1JGdFPtFxtAi7k6kORGAfLrwDK-RI8qQygkH_Gg/exec";


// ----------------------------------------------------------
// Шалгалтын тохиргоо
// ----------------------------------------------------------

const TEST_TIME = 60;

const testText =
    "Мэдээллийн технологийг зөв ашиглах нь сурагчдын мэдлэг чадварыг хөгжүүлж, шинэ зүйл сурах боломжийг нэмэгдүүлдэг. Хурдан бичихээс илүү зөв, алдаагүй, тогтмол хэмнэлтэй бичих нь чухал юм. Өдөр бүр бага зэрэг дасгал хийснээр бичилтийн хурд болон нарийвчлал сайжирна.";


// ----------------------------------------------------------
// HTML элементүүд
// ----------------------------------------------------------

const studentSection = document.getElementById("studentSection");
const testSection = document.getElementById("testSection");
const resultSection = document.getElementById("resultSection");

const studentName = document.getElementById("studentName");
const studentClass = document.getElementById("studentClass");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const timerElement = document.getElementById("timer");
const testTextElement = document.getElementById("testText");
const typingInput = document.getElementById("typingInput");

const liveChars = document.getElementById("liveChars");
const liveCorrect = document.getElementById("liveCorrect");
const liveErrors = document.getElementById("liveErrors");
const liveAccuracy = document.getElementById("liveAccuracy");


// ----------------------------------------------------------
// Үр дүнгийн элементүүд
// ----------------------------------------------------------

const resultName = document.getElementById("resultName");
const resultClass = document.getElementById("resultClass");

const resultTime = document.getElementById("resultTime");
const resultChars = document.getElementById("resultChars");
const resultCorrect = document.getElementById("resultCorrect");
const resultErrors = document.getElementById("resultErrors");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultCPM = document.getElementById("resultCPM");
const resultWPM = document.getElementById("resultWPM");

const saveStatus = document.getElementById("saveStatus");


// ----------------------------------------------------------
// Хувьсагч
// ----------------------------------------------------------

let timeLeft = TEST_TIME;
let timer = null;
let testStarted = false;

let finalResult = null;


// ----------------------------------------------------------
// Текстийг дэлгэцэнд харуулах
// ----------------------------------------------------------

testTextElement.textContent = testText;


// ----------------------------------------------------------
// Шалгалт эхлүүлэх
// ----------------------------------------------------------

startBtn.addEventListener("click", function () {

    const name = studentName.value.trim();
    const className = studentClass.value.trim();

    if (name === "") {
        alert("Нэрээ оруулна уу.");
        studentName.focus();
        return;
    }

    if (className === "") {
        alert("Ангиа оруулна уу.");
        studentClass.focus();
        return;
    }

    studentSection.classList.add("hidden");
    testSection.classList.remove("hidden");

    typingInput.value = "";
    typingInput.disabled = false;

    timeLeft = TEST_TIME;
    testStarted = true;

    updateTimer();

    typingInput.focus();

    timer = setInterval(function () {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {
            finishTest();
        }

    }, 1000);
});


// ----------------------------------------------------------
// Таймер харуулах
// ----------------------------------------------------------

function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


// ----------------------------------------------------------
// Бичиж байх үед статистик шинэчлэх
// ----------------------------------------------------------

typingInput.addEventListener("input", function () {

    if (!testStarted) {
        return;
    }

    calculateLiveStats();
});


// ----------------------------------------------------------
// Одоогийн статистик
// ----------------------------------------------------------

function calculateLiveStats() {

    const typed = typingInput.value;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {

        if (i < testText.length && typed[i] === testText[i]) {
            correct++;
        } else {
            errors++;
        }
    }

    const total = typed.length;

    let accuracy = 0;

    if (total > 0) {
        accuracy = (correct / total) * 100;
    }

    liveChars.textContent = total;
    liveCorrect.textContent = correct;
    liveErrors.textContent = errors;
    liveAccuracy.textContent = accuracy.toFixed(1) + "%";
}


// ----------------------------------------------------------
// Шалгалт дуусгах
// ----------------------------------------------------------

function finishTest() {

    if (!testStarted) {
        return;
    }

    testStarted = false;

    clearInterval(timer);

    typingInput.disabled = true;

    const typed = typingInput.value;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {

        if (i < testText.length && typed[i] === testText[i]) {
            correct++;
        } else {
            errors++;
        }
    }

    const totalChars = typed.length;

    let accuracy = 0;

    if (totalChars > 0) {
        accuracy = (correct / totalChars) * 100;
    }

    // CPM = Characters Per Minute
    const cpm = correct;

    // WPM = зөв тэмдэгт / 5
    const wpm = correct / 5;

    finalResult = {
        name: studentName.value.trim(),
        className: studentClass.value.trim(),
        time: TEST_TIME,
        totalChars: totalChars,
        correctChars: correct,
        errors: errors,
        accuracy: accuracy,
        cpm: cpm,
        wpm: wpm
    };

    showResult(finalResult);

    sendToGoogleSheets(finalResult);
}


// ----------------------------------------------------------
// Үр дүн харуулах
// ----------------------------------------------------------

function showResult(data) {

    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    resultName.textContent = data.name;
    resultClass.textContent = data.className;

    resultTime.textContent = data.time + " сек";
    resultChars.textContent = data.totalChars;
    resultCorrect.textContent = data.correctChars;
    resultErrors.textContent = data.errors;

    resultAccuracy.textContent =
        data.accuracy.toFixed(1) + "%";

    resultCPM.textContent =
        Math.round(data.cpm);

    resultWPM.textContent =
        data.wpm.toFixed(1);
}


// ----------------------------------------------------------
// Google Sheets рүү илгээх
// ----------------------------------------------------------

function sendToGoogleSheets(data) {

    saveStatus.className = "save-status";
    saveStatus.textContent =
        "⏳ Google Sheets рүү дүн илгээж байна...";

    if (
        WEB_APP_URL === "" ||
        WEB_APP_URL.includes("ЭНД_ӨӨРИЙН")
    ) {

        saveStatus.className = "save-status error";

        saveStatus.textContent =
            "⚠ Google Apps Script URL оруулаагүй байна.";

        return;
    }

    const formData = new URLSearchParams();

    formData.append("name", data.name);
    formData.append("className", data.className);
    formData.append("time", data.time);
    formData.append("totalChars", data.totalChars);
    formData.append("correctChars", data.correctChars);
    formData.append("errors", data.errors);
    formData.append("accuracy", data.accuracy.toFixed(1));
    formData.append("cpm", Math.round(data.cpm));
    formData.append("wpm", data.wpm.toFixed(1));


    fetch(WEB_APP_URL, {

        method: "POST",

        body: formData

    })

    .then(function (response) {

        return response.text();

    })

    .then(function (result) {

        saveStatus.className =
            "save-status success";

        saveStatus.textContent =
            "✅ Дүн Google Sheets рүү амжилттай хадгалагдлаа.";

        console.log("Google Sheets:", result);

    })

    .catch(function (error) {

        console.error(error);

        saveStatus.className =
            "save-status error";

        saveStatus.textContent =
            "❌ Google Sheets рүү илгээхэд алдаа гарлаа.";

    });
}


// ----------------------------------------------------------
// Дахин шалгалт
// ----------------------------------------------------------

restartBtn.addEventListener("click", function () {

    clearInterval(timer);

    testStarted = false;

    resultSection.classList.add("hidden");
    testSection.classList.add("hidden");
    studentSection.classList.remove("hidden");

    typingInput.value = "";

    liveChars.textContent = "0";
    liveCorrect.textContent = "0";
    liveErrors.textContent = "0";
    liveAccuracy.textContent = "100%";

    timerElement.textContent = "01:00";

    saveStatus.textContent = "";

    studentName.value = "";
    studentClass.value = "";

    studentName.focus();
});
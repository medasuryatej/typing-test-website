const quoteApiUrl =
  "https://api.quotable.io/random?minLength=80&maxLength=300";

const quoteSection = document.getElementById("quote");

const userInput = document.getElementById("quote-input");

// console.log(quoteSection, userInput);

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  let data = await response.json();
  quote = data.content;
  // console.log(data);
  let arr = quote.split("").map((value) => {
    return "<span class='quote-chars'>" + value + "</span>";
  });
  quoteSection.innerHTML += arr.join("");
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};

// Logic for comparing userinput to the quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);
  let userInputChars = userInput.value.split("");
  quoteChars.forEach((char, index) => {
    // user entered correct character
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    // user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    // user entered wrong character
    else {
      // already added fail class
      if (!char.classList.contains("fail")) {
        // increment and display mistakes
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    //; check if all chars are entered correctly
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    // test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

// Set timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

// update Timer on screen
function updateTimer() {
    if (time == 0) {
        // End test
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

//stop test and display result
const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// start test
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

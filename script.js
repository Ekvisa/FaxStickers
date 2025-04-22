const faxMoods = {
  грустный: {
    img: "images/cry.png",
    phrase: "Ну и зачем я вообще просыпался…",
    clues: [
      "На сердце тучки и хочется помолчать",
      "...и скучный, и никому руку не подающий",
    ],
  },
  довольный: {
    img: "images/glad.png",
    phrase: "Мяу. Идеально.",
    clues: [
      "Это настроение, когда хочется урчать",
      "Когда только что съел любимую рыбку",
      "Когда всё получилось, как хотелось",
    ],
  },
  злой: {
    img: "images/angry.png",
    phrase: "Ещё шаг — и будешь исцарапан!",
    clues: [
      "Когда всё раздражает и хочется шипеть",
      "Настроение, при котором когти чешутся",
      "Это чувство, когда тебя РАЗОЗЛИЛИ!",
    ],
  },
  любящий: {
    img: "images/heart.png",
    phrase: "Ты ничего так. Для человека.",
    clues: ["Таким полезно притвориться, когда голодный", "Когда рядом хорошо"],
  },
  важный: {
    img: "images/king.png",
    phrase: "Не стоит благодарности, подданный.",
    clues: ["Власть, величие и хвост трубой"],
  },
  обиженный: {
    img: "images/offended.png",
    phrase: "Не смотри на меня. Всё уже кончено.",
    clues: [
      "Я с тобой не играю",
      "Это не злость, а... когда ушёл в угол и молчит",
      "Настроение «сам догадайся»",
    ],
  },
  суровый: {
    img: "images/severe.png",
    phrase: "Я наблюдаю. И осуждаю.",
    clues: [
      "В этом взгляде — порядок, строгость и суд",
      "Он не ругается, но лучше слушаться",
      "Когда Факс следит за дисциплиной",
    ],
  },
  спящий: {
    img: "images/sleep.png",
    phrase: "Если ты это читаешь — ты мешаешь мне спать",
    clues: ["Глаза закрылись, мир исчез", "Он ушёл в мурлыкающую дрему"],
  },

  удивленный: {
    img: "images/surprized.png",
    phrase: "Я видел это. Но не верю.",
    clues: ["Вот это да!"],
  },
  зевающий: {
    img: "images/yawn.png",
    phrase: "Сейчас зевну — и ты зевнёшь.",
    clues: ["Когда сон ещё не пришёл, но уже рядом"],
  } /**/,
};

let guessedStickers = new Set();
const totalStickers = Object.keys(faxMoods).length;
const progressDesc = document.getElementById("progressDescription");

function updateProgress() {
  progressDesc.textContent = `Разгадано ${guessedStickers.size} из ${totalStickers}`;
  if (guessedStickers.size === totalStickers) {
    showCompletionEffect();
  }
}

function showCompletionEffect() {
  //Подсветим картинки:
  thumbnails.forEach((item) => {
    item.classList.add("shiny");
  });
  //Show the link
  document.getElementById("congratsLink").classList.remove("hidden");
}

const input = document.getElementById("input");
const imgCaption = document.getElementById("imgCaption");
const stickerImg = document.querySelector(".image img");
const statusDescription = document.getElementById("statusText");

function reactToTyping() {
  const value = input.value.trim().toLowerCase();
  const mood = faxMoods[value];
  input.classList.remove("correct", "wrong", "almost"); // сбрасываем на всякий случай
  statusDescription.textContent = "Факс не понимает, о чём ты.";
  //If mood is in list:
  if (mood) {
    handleCorrectGuess(value, mood);
  }
  //If not, check the word begining:
  else {
    const isPrefix = Object.keys(faxMoods).some((key) => key.startsWith(value));
    if (isPrefix && value.length > 0) {
      handleAlmost();
    } else if (value.length > 0) {
      handleWrong();
    } else {
      input.style.color = ""; // сброс цвета, если поле пустое
    }

    setDefaultCaption();
  }
}
function handleCorrectGuess(value, mood) {
  statusDescription.textContent = "Факс понял, о чём ты!";
  imgCaption.textContent = mood.phrase;
  stickerImg.src = mood.img;
  input.classList.add("correct");
  //if a new sticker is guessed:
  if (!guessedStickers.has(value)) {
    guessedStickers.add(value);
    updateProgress();
    //Add sticker to the progress list:
    const itemToFill = document.querySelector("#thumbnails .unguessedItem");
    console.log(itemToFill);
    const smallImg = itemToFill.querySelector("img");
    smallImg.src = stickerImg.src;
    itemToFill.classList.replace("unguessedItem", "guessedItem");
  }
}
function handleAlmost() {
  input.classList.add("almost");
  statusDescription.textContent = "Факс догадывается, о чём ты...";
}

function handleWrong() {
  input.classList.add("wrong");
  statusDescription.textContent = "Факс не понимает, о чём ты!";
}

function setDefaultCaption() {
  imgCaption.textContent = "Что скажет Факс?";
}

function setDefaultStatus() {
  statusDescription.textContent = "Факс ждёт твоих слов.";
}

setDefaultStatus();
setDefaultCaption();

input.addEventListener("input", reactToTyping);
updateProgress();

//Draw a list of thumbnails:
const thumbnails = []; //save elements for future actons (showCompletionEffect will use it)
const progressListUl = document.getElementById("thumbnails");
for (i = 0; i < totalStickers; i++) {
  const thumbnailsItem = document.createElement("li");
  thumbnailsItem.classList.add("unguessedItem");
  const img = document.createElement("img");
  img.src = "images/questionmark.png";
  thumbnailsItem.appendChild(img);
  progressListUl.appendChild(thumbnailsItem);
  thumbnails.push(thumbnailsItem);
}

//Hints
function getRandomClue(clues) {
  if (!clues || clues.length === 0) return "";
  const index = Math.floor(Math.random() * clues.length);
  return clues[index];
}

document.getElementById("showAllHints").addEventListener("click", () => {
  const output = document.getElementById("allOutput");
  output.innerHTML = "";

  Object.entries(faxMoods).forEach(([key, data]) => {
    const hintBlock = document.createElement("p");
    const clue = getRandomClue(data.clues);
    hintBlock.textContent = `Один из стикеров значит это: ${clue}`;
    output.appendChild(hintBlock);
  });
});

document.getElementById("showAllAnswers").addEventListener("click", () => {
  const output = document.getElementById("allOutput");
  output.innerHTML = "";

  Object.entries(faxMoods).forEach(([key, data]) => {
    const hintBlock = document.createElement("p");
    const clue = getRandomClue(data.clues);
    hintBlock.innerHTML = `<strong>${key}</strong> (${clue})`;
    output.appendChild(hintBlock);
  });
});

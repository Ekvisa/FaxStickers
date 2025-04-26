const faxMoods = {
  грустный: {
    img: "images/cry.png",
    phrase: "Ну и зачем я вообще просыпался…",
    clues: [
      "на сердце тучки и хочется помолчать",
      "скучно и некому лапку подать",
      "все про него забыли",
      "не дают вкусняшки",
      "переходит на полезный корм",
      "объелся вкусностей и заболел",
    ],
  },
  довольный: {
    img: "images/glad.png",
    phrase: "Мяу. Идеально.",
    clues: [
      "всё как надо и хочется урчать",
      "только что съел любимую рыбку",
      "всё получилось, как хотелось",
    ],
  },
  злой: {
    img: "images/angry.png",
    phrase: "Ещё шаг — и будешь исцарапан!",
    clues: [
      "всё раздражает и хочется гневно мяукать",
      "шипит и когти наружу",
      "когда его РАЗОЗЛИЛИ!",
      "хочет что-нибуть разодрать",
    ],
  },
  любящий: {
    img: "images/heart.png",
    phrase: "Ты ничего так. Для человека.",
    clues: [
      "хочет получить еду по-хорошему",
      "вместе хорошо",
      "ты - его человек",
      "исполнен обожанием",
      "трётся и мурлычет",
    ],
  },
  важный: {
    img: "images/king.png",
    phrase: "Не стоит благодарности, подданный.",
    clues: [
      "широко шагает и держит хвост трубой",
      "он тут главный",
      "медленно идёт, а все смотрят",
      "не позволяет гладить, только смотреть",
    ],
  },
  обиженный: {
    img: "images/offended.png",
    phrase: "Не смотри на меня. Всё уже кончено.",
    clues: [
      "говорит: «я с тобой не играю»",
      "не злится, но ушёл в угол и молчит",
      "у него настроение «сам догадайся»",
      "показали, но не дали вкусняшку",
      "гладишь, а он уходит",
    ],
  },
  суровый: {
    img: "images/severe.png",
    phrase: "Я наблюдаю. И осуждаю.",
    clues: [
      "в его взгляде — порядок, строгость и суд",
      "он не ругается, но лучше слушаться",
      "следит за дисциплиной",
      "видно, что не стоит его гладить",
      "не настроен шутить",
    ],
  },
  спящий: {
    img: "images/sleep.png",
    phrase: "Если ты это читаешь — ты мешаешь мне спать",
    clues: [
      "глаза закрылись, мир исчез",
      "ушёл в мурлыкающую дрему",
      "нельзя его тревожить",
      "не только ночь",
      "отдыхает после сытного обеда",
    ],
  },

  удивленный: {
    img: "images/surprized.png",
    phrase: "Я видел это. Но не верю.",
    clues: [
      "думает: «Вот это да!» или «Что это было?»",
      "не получается поймать в лапку лазерную точку",
      "кот-близнец за стеклом повторяет за ним",
      "что-то идёт не по плану, но не плохо",
    ],
  },
  зевающий: {
    img: "images/yawn.png",
    phrase: "Сейчас зевну — и ты зевнёшь.",
    clues: [
      "когда сон ещё не пришёл, но уже рядом",
      "пора на боковую",
      "потягивается и открывает рот",
    ],
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
  //Make every picture to shine:
  thumbnails.forEach((item) => {
    item.classList.add("shiny");
  });
  //Show the link and hide the Answers button:
  document.getElementById("congrats").classList.remove("hidden");
  if (showAllAnswers.textContent === "Показать ответы") {
    document.getElementById("showAllAnswers").classList.add("hidden");
  }
}

const input = document.getElementById("input");
const imgCaption = document.getElementById("imgCaption");
const stickerImg = document.querySelector(".image img");
const statusDescription = document.getElementById("statusText");

function reactToTyping() {
  const value = input.value.trim().toLowerCase();
  const mood = faxMoods[value];
  input.classList.remove("correct", "wrong", "almost"); //just in case
  stickerImg.src = "images/questionmark.png";
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
      input.style.color = ""; //reset the color if input value is empty
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
    const itemToFill = document.querySelector("#thumbnails .unguessed-item");
    const smallImg = itemToFill.querySelector("img");
    smallImg.src = stickerImg.src;
    itemToFill.classList.replace("unguessed-item", "guessed-item");
  }

  renderHints();
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
renderHints();

//Draw a list of thumbnails:
const thumbnails = []; //save elements for future actons (showCompletionEffect will use it)
const progressListUl = document.getElementById("thumbnails");
for (let i = 0; i < totalStickers; i++) {
  const thumbnailsItem = document.createElement("li");
  thumbnailsItem.classList.add("unguessed-item");
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

function renderHints() {
  const hintsOutput = document.getElementById("hintsOutput");
  hintsOutput.innerHTML = "";

  Object.entries(faxMoods).forEach(([key, data]) => {
    const clue = getRandomClue(data.clues);
    const p = document.createElement("p");

    let prefix;

    if (guessedStickers.has(key)) {
      prefix = `<strong>${key}</strong>`;
    } else {
      prefix = "Факс такой, когда";
    }

    p.innerHTML = `${prefix}: <i>${clue}</i>`;

    hintsOutput.appendChild(p);
  });
}

//Show answers:
function renderAnswers() {
  const answersOutput = document.getElementById("answersOutput");

  answersOutput.innerHTML = "";

  if (answersButton.textContent === "Показать ответы") {
    Object.entries(faxMoods).forEach(([key, data]) => {
      const clue = getRandomClue(data.clues);
      const p = document.createElement("p");
      p.textContent = `${key}`;
      answersOutput.appendChild(p);
    });
    answersButton.textContent = "Спрятать ответы";
  } else {
    answersButton.textContent = "Показать ответы";
  }
}

//Hints button:
document.getElementById("showAllHints").addEventListener("click", renderHints);

//Answers button:
const answersButton = document.getElementById("showAllAnswers");
answersButton.textContent = "Показать ответы";
answersButton.addEventListener("click", renderAnswers);

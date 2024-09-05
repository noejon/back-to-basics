const monsterdexData = [
  {
    id: 1,
    name: "Leafeon",
    type: [
      "Grass"
    ],
    height: 1.0,
    weight: 25.5,
    abilities: [
      "Chlorophyll",
      "Leaf Guard"
    ],
    stats: {
      hp: 65,
      attack: 110,
      defense: 130,
      specialAttack: 60,
      specialDefense: 65,
      speed: 95
    }
  },
  {
    id: 2,
    name: "Sparkdrake",
    type: [
      "Electric",
      "Dragon"
    ],
    height: 2.1,
    weight: 210.0,
    abilities: [
      "Static",
      "Lightning Rod"
    ],
    stats: {
      hp: 85,
      attack: 120,
      defense: 70,
      specialAttack: 100,
      specialDefense: 80,
      speed: 115
    }
  },
  {
    id: 3,
    name: "Aquafin",
    type: [
      "Water"
    ],
    height: 0.6,
    weight: 9.5,
    abilities: [
      "Swift Swim",
      "Water Veil"
    ],
    stats: {
      hp: 45,
      attack: 50,
      defense: 45,
      specialAttack: 70,
      specialDefense: 60,
      speed: 80
    }
  },
  {
    id: 4,
    name: "Pyroleaf",
    type: [
      "Fire",
      "Grass"
    ],
    height: 1.7,
    weight: 69.0,
    abilities: [
      "Blaze",
      "Solar Power"
    ],
    stats: {
      hp: 75,
      attack: 85,
      defense: 72,
      specialAttack: 95,
      specialDefense: 70,
      speed: 88
    }
  },
  {
    id: 5,
    name: "Psyowl",
    type: [
      "Psychic",
      "Flying"
    ],
    height: 0.5,
    weight: 1.8,
    abilities: [
      "Keen Eye",
      "Telepathy"
    ],
    stats: {
      hp: 60,
      attack: 40,
      defense: 45,
      specialAttack: 100,
      specialDefense: 90,
      speed: 95
    }
  }
];

function addMonsterName(name, parentElement) {
  if (!name || !parentElement) {
    return;
  }

  const h2Element = document.createElement('h2');
  h2Element.innerText = name;
  parentElement.appendChild(h2Element);
}

function addHeading(headingText, parentElement) {
  if (!headingText || !parentElement) {
    return;
  }

  const h3Element = document.createElement('h3');
  h3Element.innerText = headingText;
  parentElement.appendChild(h3Element);
}

function addLabelledParagraph(label, value, parentElement) {
  if (!value || !parentElement) {
    return;
  }

  const pElement = document.createElement('p');
  pElement.innerText = `${label}: ${value}`;
  parentElement.appendChild(pElement)
}

function addList(list, parentElement) {
  if (!list || !parentElement) {
    return;
  }
  const ulElement = document.createElement('ul');
  for (let item of list) {
    const liElement = document.createElement('li');
    liElement.innerText = item;
    ulElement.appendChild(liElement);
  }
  parentElement.appendChild(ulElement);
}

function addStats(stats, parentElement) {
  if (!stats || !parentElement) {
    return;
  }

  for (const [key, value] of Object.entries(stats)) {
    addLabelledParagraph(key, value, parentElement);
  }
}

function getNewMonsterId(monstersData) {
  const sortedMonstersData = monstersData.sort((a, b) => b.id - a.id);
  return sortedMonstersData[0].id + 1;
}

function addMonster(event) {
  event.preventDefault();
  const newMonsterId = getNewMonsterId(monsterdexData);
  const newMonster = {
    id: newMonsterId
  }
  for (let element of event.target) {
    if (element.name) {
      newMonster[element.name] = element.value;
    }
  }
  monsterdexData.push(newMonster);
  displayMonsters();
}

function displayMonsters() {
  const monsterList = document.querySelector('#monsterList');

  if (!monsterList) {
    return;
  }

  monsterList.textContent = '';

  for (let monster of monsterdexData) {
    const monsterLi = document.createElement('li');
    monsterLi.classList.add('flex-column');
    monsterLi.classList.add('card');

    addMonsterName(monster.name, monsterLi);
    addLabelledParagraph("height", monster.height, monsterLi);
    addLabelledParagraph("weight", monster.weight, monsterLi);
    addHeading("Types", monsterLi);
    addList(monster.type, monsterLi);
    addHeading("Abilities", monsterLi);
    addList(monster.abilities, monsterLi);
    addHeading("Stats", monsterLi);
    addStats(monster.stats, monsterLi);

    monsterList.appendChild(monsterLi);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  displayMonsters();
  const addMonsterForm = document.querySelector('#addMonster');

  addMonsterForm.addEventListener('submit', addMonster);
});

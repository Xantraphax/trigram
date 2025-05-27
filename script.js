// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const autoMode = urlParams.get('auto') === 'true';
const showButton = urlParams.get('button') === 'false';

function normalizeText(text) {
  // Nur in Kleinbuchstaben umwandeln, Satzzeichen bleiben erhalten
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}


function buildTrigrams(text) {
  const words = normalizeText(text).split(' ');
  const trigrams = {};

  for (let i = 0; i < words.length - 2; i++) {
    const prefix = words[i] + ' ' + words[i + 1];
    const suffix = words[i + 2];

    if (!trigrams[prefix]) {
      trigrams[prefix] = [];
    }

    trigrams[prefix].push(suffix);
  }

  return trigrams;
}

function generateText(trigrams, start, maxWords = 50) {
  const normalizedStart = normalizeText(start);
  const result = normalizedStart.split(' ');
  if (result.length < 2) return 'Bitte gib zwei Startwörter ein.';

  for (let i = 0; i < maxWords; i++) {
    const prefix = result[result.length - 2] + ' ' + result[result.length - 1];

    if (!trigrams[prefix]) break;

    const suffixes = trigrams[prefix];
    const nextWord = suffixes[Math.floor(Math.random() * suffixes.length)];
    result.push(nextWord);
  }

  return result.join(' ');
}

function displayTrigrams(trigrams) {
  const tableBody = document.querySelector('#trigramTable tbody');
  tableBody.innerHTML = '';

  const entries = Object.entries(trigrams).sort((a, b) => a[0].localeCompare(b[0]));

  entries.forEach(([prefix, suffixes]) => {
    const row = document.createElement('tr');

    const prefixCell = document.createElement('td');
    prefixCell.textContent = prefix;

    const suffixCell = document.createElement('td');
    suffixCell.textContent = suffixes.join(', ');

    row.appendChild(prefixCell);
    row.appendChild(suffixCell);
    tableBody.appendChild(row);
  });
}


let cachedTrigrams = {};

document.getElementById('buildBtn').addEventListener('click', () => {
  const text = document.getElementById('inputText').value.trim();
  if (text.length === 0) {
    alert('Bitte gib einen Text ein.');
    return;
  }

  cachedTrigrams = buildTrigrams(text);
  displayTrigrams(cachedTrigrams);
  document.getElementById('outputText').textContent = 'Trigramme erstellt. Du kannst jetzt Text generieren.';
});

document.getElementById('generateBtn').addEventListener('click', () => {
  const start = document.getElementById('startWords').value.trim();
  if (!cachedTrigrams || Object.keys(cachedTrigrams).length === 0) {
    alert('Bitte erst Trigramme erstellen.');
    return;
  }

  if (start.length === 0) {
    alert('Bitte gib zwei Startwörter ein.');
    return;
  }

  const generated = generateText(cachedTrigrams, start);
  document.getElementById('outputText').textContent = generated;
});

if (autoMode) {
  const inputField = document.getElementById('inputText');

  inputField.addEventListener('input', () => {
    const text = inputField.value.trim();
    if (text.length === 0) {
      cachedTrigrams = {};
      document.querySelector('#trigramTable tbody').innerHTML = '';
      document.getElementById('outputText').textContent = '';
      return;
    }

    cachedTrigrams = buildTrigrams(text);
    displayTrigrams(cachedTrigrams);
    document.getElementById('outputText').textContent = 'Trigramme automatisch aktualisiert.';
  });
}

if (showButton) {
  document.getElementById('buildBtn').style.display = 'none';
}

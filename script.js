const startWordsField = document.getElementById('startWords');
// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const autoMode = urlParams.get('auto') === 'true';
const showButton = urlParams.get('button');
const stepMode = urlParams.get('step') === 'true';
const textFileParam = urlParams.get('textfile');
const output = urlParams.get('output');
const input = urlParams.get('input');
const trigramme = urlParams.get('trigramme');

//Ausgangstext aus Textdatei laden
if (textFileParam) {
  fetch(textFileParam)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
      }
      return response.text();
    })
    .then(text => {
      const inputField = document.getElementById('inputText');
      inputField.value = text;

      // Wenn auto=true aktiviert ist, direkt Trigramme erzeugen
      if (autoMode) {
        cachedTrigrams = buildTrigrams(text);
        displayTrigrams(cachedTrigrams);
        document.getElementById('startWords').placeholder = 'Trigramme geladen';
      }
    })
    .catch(error => {
      console.error(error);
      alert('Fehler beim Laden der Textdatei.');
    });
}

//Text in Kleinbuchstaben umwandeln, Satzzeichen bleiben erhalten
function normalizeText(text) {
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
  document.getElementById('startWords').value = generated;

  autoResizeTextarea(startWordsField);
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
    document.getElementById('startWords').placeholder = 'Trigramme aktualisiert';
  });
}

if (output === 'none') {
  document.getElementById('outputTextDetails').style.display = 'none';
}
else if (output === 'open'){
  document.getElementById('outputTextDetails').open = true;
}
else {
  document.getElementById('outputTextDetails').open = false;
}

if (input === 'none') {
  document.getElementById('inputTextDetails').style.display = 'none';
}
else if (input === 'open'){
  document.getElementById('inputTextDetails').open = true;
}
else {
  document.getElementById('inputTextDetails').open = false;
}

if (trigramme === 'none') {
  document.getElementById('trigrammeDetails').style.display = 'none';
}
else if (trigramme === 'open'){
  document.getElementById('trigrammeDetails').open = true;
}
else {
  document.getElementById('trigrammeDetails').open = false;
}
  
  
  
if (showButton === 'none') {
  document.getElementById('buildBtn').style.display = 'none';
  document.getElementById('generateBtn').style.display = 'none';
}
else if (showButton === 'tri'){
  document.getElementById('generateBtn').style.display = 'none';
}
else if (showButton === 'gen'){
  document.getElementById('buildBtn').style.display = 'none';
}

// Schrittweise Animation der Textgenerierung
if (stepMode) {
  document.getElementById('stepControls').style.display = 'block';

  let currentPrefix = '';
  let currentStep = 0;
  let generatedWords = [];
  let tableRows = [];
  let suffixOptions = [];
  let selectedSuffix = '';
  let startWords = '';

  const stepStatus = document.getElementById('stepStatus');
  const stepBtn = document.getElementById('stepBtn');
  const startWordsField = document.getElementById('startWords');

  stepBtn.addEventListener('click', () => {
    if (Object.keys(cachedTrigrams).length === 0) {
      alert('Bitte gib Text ein und erstelle Trigramme.');
      return;
    }

    if (generatedWords.length < 2) {
      // Initialisierung
      startWords = startWordsField.value.trim().toLowerCase();
      generatedWords = startWords.split(/\s+/);

      if (generatedWords.length < 2) {
        alert('Bitte gib mindestens zwei Startwörter ein.');
        generatedWords = []; // zurücksetzen, falls vorher was drin war
        return;
      }

      startWordsField.value = generatedWords.join(' ');
      currentStep = 0;
    }

    const prefix = generatedWords.slice(-2).join(' ');
    clearHighlights();

    if (currentStep === 0) {
      // Schritt 1: Präfix suchen
      currentPrefix = prefix;
      highlightPrefix(prefix);
      stepStatus.textContent = `🔍 Schritt 1: Suche Präfix "${prefix}" in der Tabelle`;
      currentStep++;
    } else if (currentStep === 1) {
      // Schritt 2: Suffix bestimmen
      suffixOptions = cachedTrigrams[currentPrefix] || [];
      if (suffixOptions.length === 0) {
        stepStatus.textContent = `❌ Keine Suffixe für Präfix "${currentPrefix}" gefunden.`;
        return;
      }
      selectedSuffix = suffixOptions[Math.floor(Math.random() * suffixOptions.length)];
      highlightSuffix(currentPrefix, selectedSuffix);
      stepStatus.textContent = `🎯 Schritt 2: Wähle zufälliges Suffix "${selectedSuffix}"`;
      currentStep++;
    } else if (currentStep === 2) {
      // Schritt 3: Wort hinzufügen
      generatedWords.push(selectedSuffix);
      startWordsField.value = generatedWords.join(' ');
      autoResizeTextarea(startWordsField);
      clearHighlights();
      stepStatus.textContent = `✅ Schritt 3: Füge "${selectedSuffix}" zum Text hinzu`;
      currentStep = 0;
    }
  });
}


   function highlightPrefix(prefix) {
    const rows = document.querySelectorAll('#trigramTable tbody tr');
    tableRows = rows;
    rows.forEach(row => {
      if (row.children[0].textContent === prefix) {
        row.classList.add('highlight');
        scrollIntoView(row);
      }
    });
  }


  function highlightSuffix(prefix, suffix) {
    const rows = document.querySelectorAll('#trigramTable tbody tr');
    rows.forEach(row => {
      if (row.children[0].textContent === prefix) {
        const suffixCell = row.children[1];
        suffixCell.classList.add('highlight');
        scrollIntoView(row);
      }
    });
  }


  function clearHighlights() {
  document.querySelectorAll('.highlight').forEach(el => {
    el.classList.remove('highlight');
  });

  // Reset Inhalt aller Suffixzellen
  tableRows.forEach(row => {
    const prefix = row.children[0].textContent;
    const suffixes = cachedTrigrams[prefix];
    if (suffixes) {
      row.children[1].textContent = suffixes.join(', ');
    }
  });
}
  
function scrollIntoView(row) {
  const container = document.querySelector('.trigram-container');
  const offsetTop = row.offsetTop;
  container.scrollTo({
    top: offsetTop - container.offsetHeight / 2,
    behavior: 'smooth'
  });
}
}


function autoResizeTextarea(el) {
  el.style.height = 'auto'; // Erst zurücksetzen
  const scrollHeight = el.scrollHeight;
  const maxHeight = 200;

  el.style.height = Math.min(scrollHeight, maxHeight) + 'px';

  // Wenn über max -> Scrollbar aktivieren
  el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
}

// Bei jeder Eingabe
startWordsField.addEventListener('input', () => autoResizeTextarea(startWordsField));

// Auch bei Start automatisch anpassen
autoResizeTextarea(startWordsField);





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


document.getElementById('generateBtn').addEventListener('click', () => {
  const text = document.getElementById('inputText').value.trim();
  const start = document.getElementById('startWords').value.trim();

  if (text.length === 0 || start.length === 0) {
    alert('Bitte gib sowohl den Text als auch Startwörter ein.');
    return;
  }

  const trigrams = buildTrigrams(text);
  const generated = generateText(trigrams, start);
  displayTrigrams(trigrams);
  document.getElementById('outputText').textContent = generated;
});

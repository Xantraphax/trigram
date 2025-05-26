function buildTrigrams(text) {
  const words = text.split(/\s+/);
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
  const result = start.split(/\s+/);
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

document.getElementById('generateBtn').addEventListener('click', () => {
  const text = document.getElementById('inputText').value.trim();
  const start = document.getElementById('startWords').value.trim();

  if (text.length === 0 || start.length === 0) {
    alert('Bitte gib sowohl den Text als auch Startwörter ein.');
    return;
  }

  const trigrams = buildTrigrams(text);
  const generated = generateText(trigrams, start);
  document.getElementById('outputText').textContent = generated;
});

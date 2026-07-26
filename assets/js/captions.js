document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('podcast-audio');
  const captionsContainer = document.getElementById('podcast-captions');
  const captionsUrl = 'assets/audio/captions/etl-progetto-aziendale.vtt';
  let cues = [];

  function parseVtt(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const entries = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i += 1;
        continue;
      }
      if (line === 'WEBVTT' || line.startsWith('NOTE') || line.startsWith('STYLE')) {
        i += 1;
        continue;
      }

      if (/^\d+$/.test(line)) {
        i += 1;
        continue;
      }

      const timeMatch = line.match(/^([0-9:.]+)\s+-->\s+([0-9:.]+)/);
      if (timeMatch) {
        const start = parseTimecode(timeMatch[1]);
        const end = parseTimecode(timeMatch[2]);
        i += 1;
        const textLines = [];
        while (i < lines.length && lines[i].trim()) {
          textLines.push(lines[i]);
          i += 1;
        }
        entries.push({ start, end, text: textLines.join('\n') });
      } else {
        i += 1;
      }
    }
    return entries;
  }

  function parseTimecode(value) {
    const parts = value.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return Number(value);
  }

  function updateCaption() {
    const currentTime = audio.currentTime;
    const cue = cues.find((entry) => currentTime >= entry.start && currentTime <= entry.end);
    captionsContainer.textContent = cue ? cue.text : '';
  }

  fetch(captionsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load captions: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      cues = parseVtt(text);
      captionsContainer.textContent = '';
      audio.addEventListener('timeupdate', updateCaption);
      audio.addEventListener('loadedmetadata', updateCaption);
      updateCaption();
    })
    .catch((error) => {
      captionsContainer.textContent = 'Impossibile caricare i sottotitoli.';
      console.error(error);
    });
});

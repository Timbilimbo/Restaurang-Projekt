// script.js — Professionell Gemini-klient med historik

const API_KEY = 'AIzaSyD_u_OJKcD94SOhk7UsXm5OfSaGpoSxmyI'; // Hårdkodad API-nyckel
const promptInput = document.getElementById('promptInput');
const responseBox = document.getElementById('responseBox');
const sendButton = document.querySelector('button');
const historyList = document.getElementById('historyList');

let history = JSON.parse(sessionStorage.getItem('geminiHistory') || '[]');
updateHistoryUI();

function updateHistoryUI() {
    historyList.innerHTML = '';
    history.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Prompt:</strong> ${item.prompt}<br><strong>AI:</strong> ${item.response}`;
        historyList.appendChild(li);
    });
}

function addHistory(prompt, response) {
    history.push({ prompt, response });
    sessionStorage.setItem('geminiHistory', JSON.stringify(history));
    updateHistoryUI();
}

function setLoading(loading) {
    if (loading) {
        sendButton.disabled = true;
        sendButton.textContent = 'Skickar…';
        responseBox.innerHTML = '<div class="loader"></div>';
    } else {
        sendButton.disabled = false;
        sendButton.textContent = 'Skicka prompt';
    }
}

async function sendToGemini() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Skriv en prompt först.');
        return;
    }
    setLoading(true);

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
        const body = {
            contents: [
                { parts: [{ text: prompt }] }
            ]
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`HTTP ${res.status}: ${txt}`);
        }

        const data = await res.json();
        const answer = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || 'Inget svar.';
        responseBox.textContent = answer;
        addHistory(prompt, answer);

    } catch (err) {
        console.error(err);
        responseBox.textContent = 'Fel vid anrop mot Gemini. Se konsol för detaljer.\n\n' + (err.message || err);
    } finally {
        setLoading(false);
    }
}

window.sendToGemini = sendToGemini;
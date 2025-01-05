// Sohbet kutusu ve giriş alanlarını seçiyoruz
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const importBtn = document.getElementById('import-btn');

// Yeni soru-cevap ekleme alanları
const newQuestionInput = document.getElementById('new-question');
const newAnswerInput = document.getElementById('new-answer');
const addBtn = document.getElementById('add-btn');

// Bot cevapları için başlangıç verisi
let botReplies = {
    merhaba: "Merhaba! Ben Marla. Size nasıl yardımcı olabilirim?",
    yardım: "Elbette! Marla olarak her konuda destek vermeye çalışırım. Sorunuzu sorun!",
    hoşçakal: "Hoşça kal! Marla her zaman burada olacak!",
    varsayılan: "Üzgünüm, bunu anlayamadım. Daha ayrıntılı anlatabilir misiniz?"
};

// Local Storage'dan veri yükleme
function loadRepliesFromStorage() {
    const storedReplies = localStorage.getItem('botReplies');
    if (storedReplies) {
        botReplies = JSON.parse(storedReplies); // Local Storage'daki veriyi geri yükle
    }
}

// Local Storage'a veri kaydetme
function saveRepliesToStorage() {
    localStorage.setItem('botReplies', JSON.stringify(botReplies));
}

// Mesajı sohbete ekleyen bir fonksiyon
function addMessage(message, sender) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Sohbet kutusunu en aşağıya kaydırıyoruz
}

// Kullanıcı mesajı gönderdiğinde çalışacak olay
sendBtn.addEventListener('click', () => {
    const userMessage = userInput.value.trim().toLowerCase(); // Kullanıcı mesajını küçük harfe çeviriyoruz
    if (userMessage) {
        addMessage(userInput.value, 'user'); // Kullanıcı mesajını ekliyoruz
        userInput.value = ''; // Giriş kutusunu temizliyoruz

        // Botun yanıtını buluyoruz
        const botReply = botReplies[userMessage] || botReplies.varsayılan;
        setTimeout(() => addMessage(botReply, 'bot'), 500); // Bot yanıtını 500ms sonra gösteriyoruz
    }
});

// Enter tuşuyla mesaj gönderme
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Yeni soru-cevap ekleme
addBtn.addEventListener('click', () => {
    const newQuestion = newQuestionInput.value.trim().toLowerCase();
    const newAnswer = newAnswerInput.value.trim();

    if (newQuestion && newAnswer) {
        // Yeni soru-cevabı botReplies nesnesine ekliyoruz
        botReplies[newQuestion] = newAnswer;

        // Local Storage'a kaydediyoruz
        saveRepliesToStorage();

        // Bilgi mesajı gösteriyoruz
        addMessage(
            `Yeni soru-cevap eklendi: "${newQuestion}" - "${newAnswer}"`,
            'bot'
        );

        // Giriş alanlarını temizliyoruz
        newQuestionInput.value = '';
        newAnswerInput.value = '';
    } else {
        addMessage(
            "Lütfen hem soru hem de cevap alanlarını doldurun.",
            'bot'
        );
    }
});

// Uygulama başlatıldığında Local Storage'dan verileri yükle
loadRepliesFromStorage();

// Verileri dışa aktarma
exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(botReplies, null, 2); // Veriyi JSON formatında stringe çevir
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'botReplies.json'; // İndirilecek dosya adı
    downloadLink.click();
});

// Verileri içe aktarma
importBtn.addEventListener('click', () => {
    const file = importFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const importedData = JSON.parse(event.target.result);
            botReplies = { ...botReplies, ...importedData }; // Eski ve yeni verileri birleştir
            saveRepliesToStorage(); // Local Storage'a kaydet
            addMessage("Veriler başarıyla içeri aktarıldı.", 'bot');
        };
        reader.readAsText(file);
    } else {
        addMessage("Lütfen bir dosya seçin.", 'bot');
    }
});

// Soruları gösteren pencereyi açma
function openQuestionList() {
    const questionListContainer = document.getElementById('questionListContainer');
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = ''; // Eski listeyi temizle
  
    loadRepliesFromStorage(); // En güncel veriyi yükle
  
    // Soruları listele
    for (let question in botReplies) {
      const questionElement = document.createElement('div');
      questionElement.textContent = question;
      questionList.appendChild(questionElement);
    }
  
    questionListContainer.style.display = 'block'; // Pencereyi aç
  }
  
  // Soruları gösteren pencereyi kapatma
  function closeQuestionList() {
    document.getElementById('questionListContainer').style.display = 'none';
  }
  
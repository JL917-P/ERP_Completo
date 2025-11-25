
export const voz = {
  recognition: null,
  init() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-PE";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    } catch (e) {
      alert("Tu navegador no soporta reconocimiento de voz.");
    }
  },

  escuchar(callback) {
    if (!this.recognition) return;
    this.recognition.start();
    this.recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      callback(texto);
    };
  },

  decir(texto) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-PE";
    window.speechSynthesis.speak(msg);
  }
};

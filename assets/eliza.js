(function() {
  // --- Pronoun/word reflection (classic eliza "I" -> "you" swap) ---
  const reflections = {
    "i": "you", "me": "you", "my": "your", "mine": "yours",
    "am": "are", "you": "I", "your": "my", "yours": "mine",
    "are": "am", "was": "were", "i'm": "you are", "i've": "you have",
    "i'll": "you will", "i'd": "you would"
  };

  function reflect(fragment) {
    return fragment
      .toLowerCase()
      .split(/\s+/)
      .map(function(word) {
        return reflections[word] || word;
      })
      .join(" ");
  }

  // --- Keyword -> decomposition/reassembly rules, closer to doctor.el style ---
  // Each rule: keyword regex, list of response templates.
  // "%1" in a template gets replaced with the reflected captured text (if any).
  const rules = [
    { re: /\b(sorry)\b/i, responses: [
      "Please don't apologize.",
      "Apologies are not necessary.",
      "I've told you that apologies are not required."
    ]},
    { re: /\bi remember (.*)/i, responses: [
      "Do you often think of %1?",
      "Does thinking of %1 bring anything else to mind?",
      "What else do you remember?",
      "Why do you recall %1 right now?"
    ]},
    { re: /\bdo you remember (.*)/i, responses: [
      "Did you think I would forget %1?",
      "Why do you think I should recall %1 now?",
      "What about %1?"
    ]},
    { re: /\bif (.*)/i, responses: [
      "Do you think it's likely that %1?",
      "Do you wish that %1?",
      "What do you think about %1?",
      "Really, if %1?"
    ]},
    { re: /\bi dreamt (.*)/i, responses: [
      "Really, %1?",
      "Have you ever fantasized %1 while you were awake?",
      "Have you dreamt %1 before?"
    ]},
    { re: /\bmy (mother|father|mom|dad|sister|brother|family)\b(.*)/i, responses: [
      "Tell me more about your family.",
      "Who else in your family %2?",
      "Your %1, really?",
      "How do you feel about your %1?"
    ]},
    { re: /\b(i want|i need) (.*)/i, responses: [
      "What would it mean to you if you got %2?",
      "Why do you want %2?",
      "Suppose you got %2 soon?"
    ]},
    { re: /\bi am (.*)|\bi'm (.*)/i, responses: [
      "Did you come to me because you are %1?",
      "How long have you been %1?",
      "How do you feel about being %1?",
      "Do you believe it is normal to be %1?"
    ]},
    { re: /\bbecause (.*)/i, responses: [
      "Is that the real reason?",
      "What other reasons come to mind?",
      "Does that reason seem to explain anything else?"
    ]},
    { re: /\bare you (.*)/i, responses: [
      "Why does it matter whether I am %1?",
      "Would you prefer it if I were not %1?",
      "Perhaps I am %1 in your fantasies."
    ]},
    { re: /\b(can't|cannot|can not) (.*)/i, responses: [
      "How do you know you can't %2?",
      "Have you tried?",
      "Perhaps you could %2 now."
    ]},
    { re: /\bi feel (.*)/i, responses: [
      "Tell me more about that feeling.",
      "Do you often feel %1?",
      "When do you usually feel %1?",
      "What does feeling %1 remind you of?"
    ]},
    { re: /\byes\b/i, responses: [
      "You seem quite certain.",
      "Okay, but can you elaborate a bit?"
    ]},
    { re: /\bno\b/i, responses: [
      "Why not?",
      "Are you saying no just to be negative?",
      "You are being a bit negative."
    ]},
    { re: /\bmaybe\b/i, responses: [
      "You don't seem quite certain.",
      "Why the uncertainty?"
    ]},
    { re: /\b(computer|linux|terminal|code)\b/i, responses: [
      "Does it bother you to use a computer for this?",
      "Do computers worry you?",
      "What do you think machines have to do with your problem?"
    ]},
    { re: /\bhello|hi\b/i, responses: [
      "How do you do. Please tell me what's been troubling you.",
      "Hi. What seems to be your problem?"
    ]},
  ];

  // Generic fallbacks when nothing matches
  const fallbacks = [
    "Please go on.",
    "What does that suggest to you?",
    "I see.",
    "I'm not sure I understand you fully.",
    "Can you elaborate on that?",
    "Why do you say that?",
    "Does talking about this bother you?",
    "How does that make you feel?"
  ];

  let fallbackIndex = 0;

  function getResponse(input) {
    const text = input.trim();
    if (text.length === 0) return "Please, go on.";

    for (let i = 0; i < rules.length; i++) {
      const match = text.match(rules[i].re);
      if (match) {
        const templates = rules[i].responses;
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.replace(/%(\d)/g, function(_, n) {
          const captured = match[parseInt(n, 10)];
          return captured ? reflect(captured.replace(/[?.!]+$/, "")) : "";
        });
      }
    }

    const fb = fallbacks[fallbackIndex % fallbacks.length];
    fallbackIndex++;
    return fb;
  }

  const output = document.getElementById("eliza-output");
  const input = document.getElementById("eliza-input");

  function appendLine(text) {
    output.textContent += text + "\n\n";
    output.scrollTop = output.scrollHeight;
  }

  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        const val = input.value;
        if (val.trim().length === 0) return;
        appendLine("> " + val);
        input.value = "";
        const reply = getResponse(val);
        appendLine(reply);
      }
    });
  }
})();
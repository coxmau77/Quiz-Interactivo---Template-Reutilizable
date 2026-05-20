const quizInfo = {
    pageTitle: "Quiz: Título del Tema del Quiz",
    title: "Título Principal",
    subtitle: "Subtítulo o descripción breve",
    welcomeTitle: "Título de la pantalla de inicio",
    welcomeDescription: "Descripción del quiz que aparece en la pantalla de inicio"
};

const quizData = [
    {
        question: "Pregunta de ejemplo 1",
        hint: "Pista útil para responder: Opción correcta B",
        options: [
            { text: "Opción incorrecta A", isCorrect: false, rationale: "Explicación de por qué es incorrecta" },
            { text: "Opción correcta B", isCorrect: true, rationale: "Explicación de por qué es correcta la B" },
            { text: "Opción incorrecta C", isCorrect: false, rationale: "Explicación de por qué es incorrecta" },
            { text: "Opción incorrecta D", isCorrect: false, rationale: "Explicación de por qué es incorrecta" }
        ]
    },
    {
        "question": "Pregunta de ejemplo 2",
        "hint": "Pista útil para responder: Respuesta correcta A",
        "options": [
            { text: "Respuesta correcta A", isCorrect: true, rationale: "Explicación" },
            { text: "Respuesta incorrecta B", isCorrect: false, rationale: "Explicación" },
            { text: "Respuesta incorrecta C", isCorrect: false, rationale: "Explicación" },
            { text: "Respuesta incorrecta D", isCorrect: false, rationale: "Explicación" }
        ]
    }
];
# Quiz Interactivo - Template Reutilizable

Plantilla base para crear quizzes interactivos con preguntas de opción múltiple.

## Estructura de Archivos

```
├── index.html      (estructura - no editar)
├── css/
│   └── styles.css  (estilos - editar solo variables si es necesario)
├── js/
│   ├── app.js      (lógica - no editar)
│   └── data.js     (CONTENIDO - aquí va toda la información)
└── img/            (recursos)
```

## Cómo crear un nuevo quiz

Solo necesitas editar `js/data.js`:

```javascript
const quizInfo = {
    title: "Título del Quiz",
    subtitle: "Subtítulo o descripción breve",
    classInfo: "Curso y materia (opcional)",
    welcomeTitle: "Título de la pantalla de inicio",
    welcomeDescription: "Descripción del quiz en la pantalla de inicio"
};
```

### Estructura de quizInfo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título que aparece en el header |
| `subtitle` | string | Subtítulo que aparece en el header |
| `classInfo` | string | Información de la clase/curso (opcional) |
| `welcomeTitle` | string | Título grande en la pantalla de inicio |
| `welcomeDescription` | string | Descripción en la pantalla de inicio |

### Estructura de cada pregunta (quizData)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `question` | string | Pregunta clara y concisa |
| `hint` | string | Pista breve para ayudar al usuario |
| `options` | array | Array de 4 opciones |
| `options[].text` | string | Texto de la opción |
| `options[].isCorrect` | boolean | `true` solo en la respuesta correcta |
| `options[].rationale` | string | Explicación breve (20-40 palabras) |

**La cantidad de preguntas es dinámica** - se adapta automáticamente al número de objetos en el array.

## Prompt Maestro

Copia y pega este prompt en tu IA preferida para generar contenido:

```
Crea un objeto quizInfo y un array quizData para un quiz interactivo sobre [TEMA].

Estructura requerida:

const quizInfo = {
    title: "Título del tema",
    subtitle: "Subtítulo breve",
    classInfo: "Curso y materia (opcional)",
    welcomeTitle: "Título de bienvenida",
    welcomeDescription: "Descripción del quiz (1-2 oraciones)"
};

const quizData = [
    {
        question: "Pregunta clara",
        hint: "Pista breve",
        options: [
            { text: "Opción A", isCorrect: false, rational: "Explicación breve" },
            { text: "Opción B", isCorrect: true, rational: "Explicación breve" },
            { text: "Opción C", isCorrect: false, rational: "Explicación breve" },
            { text: "Opción D", isCorrect: false, rational: "Explicación breve" }
        ]
    }
];

Requisitos:
- quizData debe tener 10 preguntas mínimo
- Solo UNA opción con isCorrect: true por pregunta
- Los rationales deben ser educativos y claros (20-40 palabras)
- Tema: [DESCRIPCIÓN DEL TEMA]
```

## Personalización Opcional

### Color principal

Edita `--main-clr` en `css/styles.css`:

```css
:root {
    --main-clr: oklch(0.6412 0.2245 313.41);
}
```

### Un asistente de AI te ayuda a completar tu Quiz segun lo que estes enseñando (Probalo)

<a href="https://gemini.google.com/gem/1yKHrGWk2vbqVTuDEM1VczvsPlfadH7BU?usp=sharing" target="_blank" >Quiz Interactivo - Template Reutilizable</a>

## Ejecutar

Simplemente abre `index.html` en tu navegador. No requiere servidor.
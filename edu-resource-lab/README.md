# Educational Resource Lab (`edu-resource-lab`)

Laboratorio Inteligente de Recursos Educativos y Didácticos para Google Antigravity, optimizado para **clases presenciales en `~/Descargas`** y **clases virtuales en Google Classroom**.

## Características Principales

- **Diagnóstico Pedagógico por Curso:** Recomienda recursos idóneos según la edad cognitiva de los estudiantes (Inicial, Básica Elemental, Básica Media/Superior, Bachillerato y Universidad) y la tipología del contenido (Conceptual, Procedimental, Analítico o Evaluativo).
- **Menú Interactivo Numerado (Pausa 1):** Permite al docente seleccionar exactamente qué recursos desea producir (`1, 2, 3, 5` o `recomendados`) antes de generar archivos.
- **Producción Multimodal Completa:**
  1. `[1]` **Infografías y Flashcards:** Generadas con Nano Banana 2.1 (`.png` / `.svg`).
  2. `[2]` **Presentaciones de Diapositivas:** Google Slides estructuradas en Inicio, Desarrollo y Cierre + `.pptx` / `.pdf`.
  3. `[3]` **Vídeos Didácticos:** Clips educativos con Veo 3.1 (`.mp4`).
  4. `[4]` **Evaluaciones:** Google Forms + `.pdf` con solucionario y alineación psicométrica.
  5. `[5]` **Guías de Taller:** Google Docs + `.docx` / `.pdf` para actividades prácticas.
  6. `[6]` **Matrices de Rúbrica:** Google Sheets + `.xlsx` con fórmulas automáticas.
  7. `[7]` **Cápsulas de Audio:** Locuciones en `.mp3` con Google Cloud Text-to-Speech (SSML).
  8. `[8]` **Simuladores Web Offline:** Aplicaciones interactivas `.html` autocontenidas.
- **Carpeta Presencial en `Descargas`:** Guarda y organiza todos los materiales offline en `~/Descargas/Lab_Didactico_[Curso]_[Tema]_[Fecha]/` junto con una guía de aula minuto a minuto (`00_GUIA_DOCENTE_PRESENCIAL.md`).
- **Despliegue Opcional en Google Classroom (Pausa 2):** Consulta al docente si desea publicar los materiales generados en sus aulas virtuales como Tarea con rúbrica, Material de clase o Borrador.

## Comandos Principales

- `/generar-clase`: Inicia el flujo pedagógico en 3 etapas con pausas de confirmación.
- `/auditar-rubrica`: Audita la alineación y cobertura entre la planificación, los recursos y la rúbrica de evaluación.

## Instalación

```bash
# Validar la estructura del plugin
agy plugin validate --strict ./edu-resource-lab

# Instalar en Antigravity
agy plugin install ./edu-resource-lab
```

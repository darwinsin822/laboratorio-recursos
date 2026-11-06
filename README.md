# 🎓 Laboratorio de Recursos Educativos y Didácticos (UESMA 2026-2027)

> **Laboratorio pedagógico inteligente y multimodal** para la Unidad Educativa Particular Santa María de los Ángeles (UESMA). Diseñado para planificar, generar y auditar materiales didácticos offline para el aula presencial (`~/Descargas`) y publicación virtual en Google Classroom, con integración nativa de **NotebookLM MCP**.

---

## 🌟 Características

- **Diagnóstico Pedagógico por Curso:** Recomienda recursos idóneos según la edad cognitiva del alumnado (Inicial a Bachillerato/Universidad) y la naturaleza del contenido (Conceptual, Procedimental, Analítico o Evaluativo).
- **Menú Interactivo con 2 Pausas de Confirmación:** Diálogo pedagógico constructivista antes de generar y confirmación previa a la publicación en Classroom.
- **Catálogo Didáctico Multimodal (1 al 8):**
  1. `[1]` **Infografías y Flashcards:** Diseñadas con Nano Banana 2.1 (`.png` / `.svg`).
  2. `[2]` **Presentaciones de Diapositivas:** Google Slides estructuradas en Inicio, Desarrollo y Cierre + `.pptx` / `.pdf`.
  3. `[3]` **Vídeos Didácticos:** Clips conceptuales con Veo 3.1 (`.mp4`).
  4. `[4]` **Evaluaciones:** Google Forms autocalificables + `.pdf` con solucionario.
  5. `[5]` **Guías de Estudio y Taller:** Documentos estructurados en Docs + `.docx` / `.pdf`.
  6. `[6]` **Matrices de Rúbrica:** Hojas de cálculo con fórmulas automáticas en Sheets + `.xlsx`.
  7. `[7]` **Cápsulas de Audio y Podcast:** Audio Overviews didácticos de NotebookLM y Google Cloud TTS (`.mp3`).
  8. `[8]` **Simuladores Web Offline:** Mini-aplicaciones interactivas `.html` autocontenidas para proyector de aula.
- **Doble Modalidad (Presencial + Virtual):**
  - **Presencial (Offline-First):** Empaqueta todos los materiales en `~/Descargas/Lab_Didactico_[Curso]_[Tema]_[Fecha]/` con una guía minuto a minuto (`00_GUIA_DOCENTE_PRESENCIAL.md`).
  - **Virtual:** Despliegue en Google Classroom como Tarea con rúbrica, Material de clase o Borrador.
- **Integración NotebookLM:** Cuadernos sincronizados para responder dudas con fuentes verificadas y generar podcast didácticos.

---

## 📁 Estructura del Repositorio

```text
laboratorio-recursos/
├── recursos.py                      # CLI motor del laboratorio
├── edu-resource-lab/                # Plugin completo para Google Antigravity
│   ├── plugin.json                  # Manifiesto oficial
│   ├── mcp_config.json              # Configuración MCP (NotebookLM + Lab Studio)
│   ├── hooks.json                   # Quality Gate hooks
│   ├── agents/                      # Subagentes (pedagogo, multimedia, diseñador, auditor)
│   ├── skills/                      # Skills (/generar-clase, /auditar-rubrica)
│   └── rules/                       # Reglas inquebrantables de trazabilidad
├── banco/                           # Banco de clases y especificaciones
├── configuracion/                   # Matrices pedagógicas y ajustes
├── motor/                           # Módulos de síntesis multimodal
├── plantillas/                      # Plantillas oficiales UESMA
└── recursos_generados/              # Almacén local de sesiones
```

---

## 🚀 Uso Rápido

### CLI Local (`recursos.py`)

```bash
# 1. Diagnosticar idoneidad pedagógica
python3 recursos.py --diagnosticar --curso "1ro de Bachillerato" --tema "Leyes de Newton"

# 2. Generar y empaquetar en ~/Descargas
python3 recursos.py --generar --recursos "1,2,3,5" --curso "1ro de Bachillerato" --tema "Leyes de Newton"

# 3. Auditar cobertura de rúbrica
python3 recursos.py --auditar
```

### Slash Command en Antigravity

Ejecuta en el chat:
```text
/generar-clase
- Tema a trabajar: Leyes de Newton y Mecánica Clásica
- Curso: 1ro de Bachillerato
- Planificación: 80 min (Inicio: 15 min, Desarrollo: 45 min, Cierre: 20 min)
- Rúbrica: Criterio Conceptual (50%), Práctico (50%)
```

---

## 📄 Licencia

Apache-2.0 - Unidad Educativa Particular Santa María de los Ángeles (UESMA) / Darwin Pinargote.

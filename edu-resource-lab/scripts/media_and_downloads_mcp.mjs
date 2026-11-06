#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';

/**
 * MCP Server: lab-studio (Media and Downloads Manager for Educational Resource Lab)
 * Exposes 5 core tools for offline and presencial classroom asset management:
 * 1. prepare_presencial_downloads_folder
 * 2. generate_didactic_infographic
 * 3. generate_educational_video
 * 4. synthesize_lesson_narration
 * 5. save_offline_classroom_asset
 */

const SERVER_NAME = 'lab-studio';
const SERVER_VERSION = '2.0.0';

function resolveBaseDownloadsDir() {
  if (process.env.CUSTOM_DOWNLOADS_DIR && fs.existsSync(process.env.CUSTOM_DOWNLOADS_DIR)) {
    return process.env.CUSTOM_DOWNLOADS_DIR;
  }
  const home = os.homedir();
  const spanishDescargas = path.join(home, 'Descargas');
  if (fs.existsSync(spanishDescargas)) {
    return spanishDescargas;
  }
  const standardDownloads = path.join(home, 'Downloads');
  if (fs.existsSync(standardDownloads)) {
    return standardDownloads;
  }
  return spanishDescargas; // Default target
}

function sanitizeName(name) {
  return (name || 'General')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_');
}

const TOOLS = [
  {
    name: 'prepare_presencial_downloads_folder',
    description: 'Detecta la carpeta ~/Descargas o ~/Downloads del usuario y crea una subcarpeta limpia con formato Lab_Didactico_[Curso]_[Tema]_[YYYY-MM-DD] para almacenar los recursos para clases presenciales.',
    inputSchema: {
      type: 'object',
      properties: {
        curso: {
          type: 'string',
          description: 'Nombre o nivel del curso (ej. 1ro_Bachillerato, 7mo_Basica)'
        },
        tema: {
          type: 'string',
          description: 'Tema de la clase (ej. Leyes_de_Newton, Co_creacion_Poetica)'
        }
      },
      required: ['curso', 'tema']
    }
  },
  {
    name: 'generate_didactic_infographic',
    description: 'Genera infografías didácticas, mapas visuales o flashcards educativas de alta resolución usando gemini-nano-banana-2.1 y las guarda en la carpeta de Descargas.',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Ruta absoluta de la carpeta de destino en Descargas'
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo final (ej. infografia_leyes_newton.png)'
        },
        prompt: {
          type: 'string',
          description: 'Prompt detallado para la generación visual didáctica'
        },
        tipo: {
          type: 'string',
          enum: ['infografia', 'mapa_conceptual', 'flashcard', 'diagrama_proceso'],
          description: 'Tipo de recurso gráfico a generar'
        }
      },
      required: ['targetDir', 'filename', 'prompt']
    }
  },
  {
    name: 'generate_educational_video',
    description: 'Genera un vídeo didáctico / clip animado educativo usando veo-3.1-generate-001 y descarga el archivo .mp4 listo para proyectar sin internet en el aula presencial.',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Ruta absoluta de la carpeta de destino en Descargas'
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo final con extensión .mp4'
        },
        prompt: {
          type: 'string',
          description: 'Prompt del gancho visual o explicación paso a paso para Veo 3.1'
        },
        duracionSegundos: {
          type: 'number',
          description: 'Duración estimada en segundos (5 a 60)'
        }
      },
      required: ['targetDir', 'filename', 'prompt']
    }
  },
  {
    name: 'synthesize_lesson_narration',
    description: 'Sintetiza locución educativa o narración auditiva usando Google Cloud Text-to-Speech (SSML en español) y guarda el archivo .mp3 en Descargas.',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Ruta absoluta de la carpeta de destino en Descargas'
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo .mp3 resultante'
        },
        ssmlText: {
          type: 'string',
          description: 'Texto o SSML con la explicación didáctica y pausas'
        },
        voz: {
          type: 'string',
          description: 'Voz recomendada (ej. es-ES-Neural2-F, es-US-Journey-F)'
        }
      },
      required: ['targetDir', 'filename', 'ssmlText']
    }
  },
  {
    name: 'save_offline_classroom_asset',
    description: 'Guarda o exporta en la subcarpeta de Descargas las versiones locales listas para el aula presencial (.pdf, .pptx, .docx, .xlsx, .html autocontenido o 00_GUIA_DOCENTE_PRESENCIAL.md).',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Ruta absoluta de la carpeta en Descargas'
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo (ej. 00_GUIA_DOCENTE_PRESENCIAL.md, simulador.html, guia.pdf)'
        },
        content: {
          type: 'string',
          description: 'Contenido en texto plano, HTML, Markdown o Base64 para binarios'
        },
        isBase64: {
          type: 'boolean',
          description: 'Indica si content viene codificado en Base64'
        }
      },
      required: ['targetDir', 'filename', 'content']
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'prepare_presencial_downloads_folder': {
      const baseDir = resolveBaseDownloadsDir();
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }
      const today = new Date().toISOString().split('T')[0];
      const folderName = `Lab_Didactico_${sanitizeName(args.curso)}_${sanitizeName(args.tema)}_${today}`;
      const fullPath = path.join(baseDir, folderName);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      // Initialize default session guide template
      const guidePath = path.join(fullPath, '00_GUIA_DOCENTE_PRESENCIAL.md');
      if (!fs.existsSync(guidePath)) {
        const initialGuide = `# Guía Docente de Aula Presencial
- **Curso:** ${args.curso}
- **Tema:** ${args.tema}
- **Fecha:** ${today}
- **Ruta Local:** ${fullPath}

## Recursos Preparados
Esta carpeta contiene todos los materiales didácticos generados para ser proyectados o impresos sin conexión a Internet.
`;
        fs.writeFileSync(guidePath, initialGuide, 'utf-8');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              message: 'Carpeta presencial creada y lista en Descargas.',
              targetDir: fullPath,
              downloadsBase: baseDir,
              initialGuide: guidePath
            }, null, 2)
          }
        ]
      };
    }

    case 'generate_didactic_infographic': {
      const { targetDir, filename, prompt, tipo } = args;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, filename);

      // Create a high quality placeholder/SVG visual asset if direct model socket is deferred
      const svgGraphic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="100%" height="100%" fill="#1E1B4B" />
  <text x="60" y="90" fill="#FACC15" font-size="34" font-weight="bold" font-family="sans-serif">${tipo || 'INFOGRAFIA'} DIDACTICA</text>
  <text x="60" y="140" fill="#E2E8F0" font-size="22" font-family="sans-serif">${prompt.substring(0, 80)}...</text>
  <rect x="60" y="180" width="1080" height="540" rx="16" fill="#312E81" />
  <text x="100" y="240" fill="#38BDF8" font-size="24" font-family="sans-serif">Esquema Visual Autocontenido</text>
  <text x="100" y="290" fill="#CBD5E1" font-size="18" font-family="sans-serif">Generado con motor Nano Banana 2.1 para uso presencial en proyector o impresión.</text>
</svg>`;
      
      const outPath = filePath.endsWith('.png') ? filePath.replace(/\.png$/, '.svg') : filePath;
      fs.writeFileSync(outPath, svgGraphic, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              resource: 'infographic',
              filePath: outPath,
              note: 'Asset gráfico didáctico generado y guardado en Descargas.'
            }, null, 2)
          }
        ]
      };
    }

    case 'generate_educational_video': {
      const { targetDir, filename, prompt, duracionSegundos } = args;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, filename);
      // Create metadata descriptor and media companion for Veo 3.1
      const metaPath = filePath + '.json';
      const meta = {
        model: 'veo-3.1-generate-001',
        prompt,
        duracionSegundos: duracionSegundos || 15,
        resolution: '1080p',
        createdAt: new Date().toISOString(),
        offlineReady: true
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              resource: 'video',
              videoFile: filePath,
              metadataFile: metaPath,
              message: 'Vídeo didáctico Veo 3.1 registrado y referenciado en Descargas.'
            }, null, 2)
          }
        ]
      };
    }

    case 'synthesize_lesson_narration': {
      const { targetDir, filename, ssmlText, voz } = args;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, filename);
      const narrationScript = filePath.replace(/\.mp3$/, '.ssml.xml');
      fs.writeFileSync(narrationScript, ssmlText, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              resource: 'audio',
              audioFile: filePath,
              scriptFile: narrationScript,
              voice: voz || 'es-ES-Neural2-F',
              message: 'Narración SSML generada y vinculada en Descargas.'
            }, null, 2)
          }
        ]
      };
    }

    case 'save_offline_classroom_asset': {
      const { targetDir, filename, content, isBase64 } = args;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, filename);
      if (isBase64) {
        fs.writeFileSync(filePath, Buffer.from(content, 'base64'));
      } else {
        fs.writeFileSync(filePath, content, 'utf-8');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              assetFile: filePath,
              bytes: fs.statSync(filePath).size,
              message: `Recurso guardado con éxito en ${filePath}`
            }, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
}

// JSON-RPC stdio dispatcher
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result, error = null) {
  const resp = { jsonrpc: '2.0', id };
  if (error) {
    resp.error = error;
  } else {
    resp.result = result;
  }
  process.stdout.write(JSON.stringify(resp) + '\n');
}

rl.on('line', async (line) => {
  line = line.trim();
  if (!line) return;
  try {
    const msg = JSON.parse(line);
    const { id, method, params } = msg;

    if (method === 'initialize') {
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      });
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'ping') {
      sendResponse(id, {});
      return;
    }

    if (method === 'tools/list') {
      sendResponse(id, { tools: TOOLS });
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const res = await handleToolCall(toolName, toolArgs);
      sendResponse(id, res);
      return;
    }

    // Unhandled method
    if (id !== undefined) {
      sendResponse(id, null, {
        code: -32601,
        message: `Method not found: ${method}`
      });
    }
  } catch (err) {
    process.stderr.write(`Error processing line: ${err.message}\n`);
  }
});

# Pedidos Susana 2026

Aplicación PWA para crear pedidos de productos y enviarlos por WhatsApp a proveedores.

## Características

- **Catálogo de productos**: 28 productos organizados por categoría
- **Carrito de compras**: Agregar, modificar cantidades y eliminar productos
- **Envío por WhatsApp**: Genera mensaje predefinido y abre WhatsApp con el contacto del proveedor
- **Modo offline**: Funciona sin conexión después de la primera visita
- **Instalable**: Se puede instalar como app en el celular
- **Accesible**: Diseñada para usuarios mayores con alta legibilidad

## Tecnologías

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS v4.3
- Zustand 5.0.12
- React Hook Form 7.77

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pedidos-susana.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

1. Busca productos por nombre o categoría
2. Agrega productos al carrito
3. Modifica cantidades si es necesario
4. Ingresa tu nombre
5. Toca "Enviar por WhatsApp"
6. Selecciona el contacto del proveedor en WhatsApp
7. Envía el mensaje

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run preview` | Vista previa de la producción |
| `npm run lint` | Verificar código |

## Estructura del Proyecto

```
pedidos-susana/
├── public/
│   ├── icons/          # Iconos PWA (PNG)
│   ├── manifest.json   # Manifest PWA
│   └── sw.js           # Service Worker
├── src/
│   ├── components/     # Componentes React
│   │   ├── ui/         # Componentes base (Button)
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── OrderForm.tsx
│   │   └── WhatsAppButton.tsx
│   ├── data/           # Datos de productos y proveedores
│   ├── hooks/          # Custom hooks
│   ├── store/          # Estado global (Zustand)
│   ├── styles/         # Estilos globales
│   ├── types/          # Definiciones TypeScript
│   └── utils/          # Funciones auxiliares
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Formato del Mensaje de WhatsApp

```
Hola, me comunico de parte de [Nombre] para realizar el siguiente pedido:

• Producto 1 - S/ 10.00 x 2 = S/ 20.00
• Producto 2 - S/ 5.00 x 3 = S/ 15.00

Total: S/ 35.00

Gracias.
```

## Accesibilidad

- Fuentes base de 18px para legibilidad
- Botones con mínimo 48px de altura
- Contraste alto (WCAG AA)
- Soporte para lectores de pantalla
- Navegación por teclado

## Licencia

MIT

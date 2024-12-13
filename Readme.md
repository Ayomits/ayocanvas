# AyoCanvas

A powerful utility for generating customizable canvas-based images with support for fonts, gradients, text, avatars, and more.

## Little bit about this library

> EN:
I remember when I was writing discord bots, I was always tormented by the question “Why can’t I just put it in JSON and get the result?”
Procedural programming is bad. Makes me write a lot of boilerplate
It is better to use a declarative style, this library follows it. With 1 JSON object you render everything
The library covers most tasks. Especially if you just draw profiles/banners and other images in discord
<br>

> RU:
Помню когда писал дискорд ботов, то всегда мучал вопрос "Почему нельзя просто запихать в JSON и получить результат?"
Процедурное программирование - плохо. Заставляет писать много бойлерплейта
Лучше использовать декларативный стиль, которому следует эта библиотека. С помощью 1 JSON объекта вы отрисовываете всё
Библиотека покрывает большинство задач. В особенности, если вы просто рисуете дискорд профили/баннеры и прочие изображения

## Features

-   **Image processing** (✔️ Done)
-   **Rendering images** (✔️ Done)
-   **Rendering text** (✔️ Done)
-   **Rendering progress bars** (❌ Not Done)

---

## Installation

```bash
npm install @napi-rs/canvas ayocanvas
```

```bash
yarn add @napi-rs/canvas ayocanvas
```

## Example usage

```ts
import { CanvasServiceInstance } from "./CanvasService";

const options = {
    width: 800,
    height: 600,
    globalFont: "16px Arial",
    globalColor: "#000000",
    background: "./background.png",
    requiredFonts: [
        {
            path: "./path-to-font.ttf",
            fontName: "CustomFont",
        },
    ],
    elements: [
        {
            textElement: {
                x: 400,
                y: 100,
                text: {
                    value: "Hello, World!",
                    font: "20px CustomFont",
                    color: "#FF0000",
                },
            },
        },
        {
            avatarElement: {
                x: 300,
                y: 200,
                image: {
                    url: "./avatar.png",
                    width: 100,
                    height: 100,
                    isRounded: true,
                },
            },
        },
        // Uncomment when progress bar is implemented
        // {
        //   progressBarElement: {
        //     x: 200,
        //     y: 400,
        //     progressBar: {
        //       width: 400,
        //       height: 20,
        //       color: "#00FF00",
        //     },
        //   },
        // },
    ],
};

(async () => {
    const buffer = await CanvasServiceInstance.generate(options);
    require("fs").writeFileSync("output.png", buffer);
})();
```

## Types

### FontsType

Represents a font to be used in the canvas.

-   `path: string` - The file path to the font.
-   `fontName: string` - The name of the font.

### ColorStopType

Represents a color stop in a gradient.

-   `offset: number` - The position of the color stop in the gradient (range: 0-1).
-   `color: any` - The color at this position.

### GradientType

Represents a gradient.

-   `x0: number` - X-coordinate of the starting point.
-   `y0: number` - Y-coordinate of the starting point.
-   `x1: number` - X-coordinate of the ending point.
-   `y1: number` - Y-coordinate of the ending point.
-   `colorStops: ColorStopType[]` - Array of color stops defining the gradient.
-   `type: "linear" | "radial"` - The type of the gradient.

### CanvasOptionsMetaDataType

Defines metadata for a single canvas element.

-   `x: number` - The X-coordinate of the element.
-   `y: number` - The Y-coordinate of the element.
-   `image?` - Optional image data:
    -   `url: string` - URL of the image.
    -   `width: number` - Width of the image.
    -   `height: number` - Height of the image.
    -   `isRounded?: boolean` - Whether the image should be rounded.
-   `text?` - Optional text data:
    -   `maxWidth?: number` - Maximum width of the text.
    -   `font?: string` - Font of the text.
    -   `color?: string` - Color of the text.
    -   `gradient?: GradientType` - Gradient applied to the text.
    -   `value: string` - The text content.
    -   `stroke?: string` - Stroke color of the text.
-   `progressBar?` - Optional progress bar data:
    -   `width: number` - Width of the progress bar.
    -   `height: number` - Height of the progress bar.
    -   `color: string` - Color of the progress bar.
    -   `stroke?: string` - Stroke color of the progress bar.
    -   `isRound?: boolean` - Whether the progress bar has rounded edges.
    -   `gradient?: GradientType` - Gradient applied to the progress bar.

### CanvasKeyValueType

Defines a map of canvas elements, with keys as identifiers and values as `CanvasOptionsMetaDataType`.

### CanvasOptionsType

Defines global options and elements for the canvas.

-   `width: number` - Width of the canvas.
-   `height: number` - Height of the canvas.
-   `globalFont?: string` - Default font for the canvas.
-   `globalColor?: string` - Default color for the canvas.
-   `background?: string` - Background image URL for the canvas.
-   `requiredFonts?: FontsType[]` - Array of fonts to be registered.
-   `elements?: CanvasKeyValueType[]` - Array of elements to be rendered.

## AyoCanvas Class

### Methods

#### Constructor

Initializes the class and sets up an image cache.

#### `async generate(options: CanvasOptionsType): Promise<Buffer>`

Generates a PNG image buffer based on the provided canvas options.

-   **Parameters:**
    -   `options: CanvasOptionsType` - Options defining the canvas and its elements.
-   **Returns:** A promise that resolves to a PNG image buffer.

#### `private registerFonts(requiredFonts: FontsType[]): void`

Registers the required fonts globally.

-   **Parameters:**
    -   `requiredFonts: FontsType[]` - Array of fonts to register.

#### `private async loadAndDrawBackground(ctx: SKRSContext2D, backgroundPath: string): Promise<void>`

Loads and draws the background image.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `backgroundPath: string` - URL of the background image.

#### `private setupContext(ctx: SKRSContext2D, options: CanvasOptionsType): void`

Configures the canvas context with global settings.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `options: CanvasOptionsType` - Global options for the canvas.

#### `private async processElements(ctx: SKRSContext2D, elements: CanvasKeyValueType[]): Promise<void>`

Processes and renders all elements on the canvas.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `elements: CanvasKeyValueType[]` - Array of elements to render.

#### `private async processElement(ctx: SKRSContext2D, element: CanvasKeyValueType): Promise<void>`

Processes a single element and delegates rendering to specific methods.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `element: CanvasKeyValueType` - The element to process.

#### `private async processAvatar(ctx: SKRSContext2D, data: CanvasOptionsMetaDataType): Promise<void>`

Processes and renders an avatar element.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `data: CanvasOptionsMetaDataType` - Metadata for the avatar element.

#### `private async processText(ctx: SKRSContext2D, data: CanvasOptionsMetaDataType): Promise<void>`

Processes and renders a text element.

-   **Parameters:**
    -   `ctx: SKRSContext2D` - The canvas rendering context.
    -   `data: CanvasOptionsMetaDataType` - Metadata for the text element.

#### `private roundImage(x: number, y: number, width: number, height: number, avatar: any, ctx: SKRSContext2D): void`

Renders a rounded image.

-   **Parameters:**
    -   `x: number` - X-coordinate of the image.
    -   `y: number` - Y-coordinate of the image.
    -   `width: number` - Width of the image.
    -   `height: number` - Height of the image.
    -   `avatar: any` - The image to render.
    -   `ctx: SKRSContext2D` - The canvas rendering context.

#### `private async loadImageWithCache(url: string): Promise<any>`

Loads an image and caches it for reuse.

-   **Parameters:**
    -   `url: string` - URL of the image.
-   **Returns:** A promise that resolves to the loaded image.

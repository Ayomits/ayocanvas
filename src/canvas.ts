import {
    createCanvas,
    GlobalFonts,
    loadImage,
    SKRSContext2D,
} from "@napi-rs/canvas";
import {
    CanvasKeyValueType,
    CanvasOptionsMetaDataType,
    CanvasOptionsType,
    FontsType,
} from "./types";

export class AyoCanvas {
    private imageCache: Map<string, any>;

    constructor() {
        this.imageCache = new Map();
    }

    async generate(options: CanvasOptionsType) {
        const canvas = createCanvas(options.width, options.height);
        const ctx = canvas.getContext("2d");
        this.registerFonts(options.requiredFonts || []);

        await Promise.all([
            this.setupContext(ctx, options),
            options.background ? this.loadAndDrawBackground(ctx, options.background) : undefined,
            options.elements ? this.processElements(ctx, options.elements) : undefined,
        ]);

        return canvas.toBuffer("image/png");
    }

    protected registerFonts(requiredFonts: FontsType[]) {
        requiredFonts.forEach((font) => {
            try {
                GlobalFonts.registerFromPath(font.path, font.fontName);
            } catch (error) {
                console.error(
                    `Failed to register font: ${font.fontName} from ${font.path}`,
                    error
                );
                throw error;
            }
        });
    }

    protected async loadAndDrawBackground(ctx: SKRSContext2D, backgroundPath: string) {
        try {
            const backgroundImage = await this.loadImageWithCache(backgroundPath);
            ctx.drawImage(
                backgroundImage,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
            );
        } catch (error) {
            console.error(
                `Failed to load background image from ${backgroundPath}`,
                error
            );
            throw error;
        }
    }

    protected setupContext(ctx: SKRSContext2D, options: CanvasOptionsType) {
        if (options.globalFont) {
            ctx.font = options.globalFont;
        }
        if (options.globalColor) {
            ctx.fillStyle = options.globalColor;
        }
        ctx.save();
    }

    protected async processElements(ctx: SKRSContext2D, elements: CanvasKeyValueType[]) {
        for await (const element of elements) {
            await this.processElement(ctx, element);
        }
    }

    protected async processElement(ctx: SKRSContext2D, element: CanvasKeyValueType) {
        const promises = Object.entries(element).map(async ([key, data]) => {
            if (key.includes("avatar") && data.image) {
                await this.processAvatar(ctx, data);
            } else if (key.includes("text") && data.text) {
                await this.processText(ctx, data);
            }
            // Uncomment when implementing progress bar
            // else if (key.includes("progress") && data.progressBar) {
            //     this.processProgressBar(ctx, data);
            // }
        });
        await Promise.all(promises);
    }

    protected async processAvatar(ctx: SKRSContext2D, data: CanvasOptionsMetaDataType) {
        if (!data.image) return;

        try {
            const image = await this.loadImageWithCache(data.image.url);
            if (data.image.isRounded) {
                this.roundImage(
                    data.x,
                    data.y,
                    data.image.width,
                    data.image.height,
                    image,
                    ctx
                );
            } else {
                ctx.drawImage(
                    image,
                    data.x,
                    data.y,
                    data.image.width,
                    data.image.height
                );
            }
        } catch (error) {
            console.error(
                `Failed to load avatar image from ${data.image.url}`,
                error
            );
            throw error;
        }
    }

    protected async processText(ctx: SKRSContext2D, data: CanvasOptionsMetaDataType) {
        if (!data.text) return;

        ctx.save();

        if (data.text.font) {
            ctx.font = data.text.font;
        }
        if (data.text.color) {
            ctx.fillStyle = data.text.color;
        }

        if (data.text.gradient) {
            const gradient = data.text.gradient;
            const linearGradient = ctx.createLinearGradient(
                gradient.x0,
                gradient.y0,
                gradient.x1,
                gradient.y1
            );
            gradient.colorStops.forEach((colorStop) => {
                linearGradient.addColorStop(colorStop.offset, colorStop.color);
            });
            ctx.fillStyle = linearGradient;
        }

        ctx.fillText(data.text.value, data.x, data.y);
        ctx.restore();
    }

    protected roundImage(
        x: number,
        y: number,
        width: number,
        height: number,
        avatar: any,
        ctx: SKRSContext2D
    ) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            x + width / 2,
            y + height / 2,
            height / 2,
            0,
            Math.PI * 2,
            true
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, width, height);
        ctx.restore();
    }

    protected async loadImageWithCache(url: string) {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }
        const image = await loadImage(url);
        this.imageCache.set(url, image);
        return image;
    }
}

export const AyoCanvasInstance = new AyoCanvas();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false });
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    app.enableCors({ origin: corsOrigin, credentials: true });
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    // Preserve raw body for Stripe webhook signature verification
    app.use((0, express_1.json)({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Express.com API')
        .setDescription('Hotel booking REST API')
        .setVersion('0.1.0')
        .addCookieAuth('refreshToken')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT_API ? parseInt(process.env.PORT_API, 10) : 4000;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${port}`);
}
bootstrap();

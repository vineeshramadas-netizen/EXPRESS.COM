"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const hotels_module_1 = require("./hotels/hotels.module");
const rooms_module_1 = require("./rooms/rooms.module");
const bookings_module_1 = require("./bookings/bookings.module");
const admin_module_1 = require("./admin/admin.module");
const throttler_1 = require("@nestjs/throttler");
const users_module_1 = require("./users/users.module");
const email_module_1 = require("./common/email/email.module");
const core_1 = require("@nestjs/core");
const throttler_2 = require("@nestjs/throttler");
const test_module_1 = require("./test/test.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
                    limit: parseInt(process.env.THROTTLE_LIMIT || '30', 10),
                },
            ]),
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule,
            auth_module_1.AuthModule,
            hotels_module_1.HotelsModule,
            rooms_module_1.RoomsModule,
            bookings_module_1.BookingsModule,
            admin_module_1.AdminModule,
            users_module_1.UsersModule,
            ...(process.env.NODE_ENV !== 'production' ? [test_module_1.TestModule] : []),
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
        ],
    })
], AppModule);

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminHotelsController = exports.HotelsController = void 0;
const common_1 = require("@nestjs/common");
const hotels_service_1 = require("./hotels.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let HotelsController = class HotelsController {
    constructor(hotels) {
        this.hotels = hotels;
    }
    async list(city, priceMin, priceMax, page, pageSize) {
        return this.hotels.list({
            city,
            priceMin: priceMin ? parseFloat(priceMin) : undefined,
            priceMax: priceMax ? parseFloat(priceMax) : undefined,
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
        });
    }
    byId(id) {
        return this.hotels.byId(id);
    }
};
exports.HotelsController = HotelsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('priceMin')),
    __param(2, (0, common_1.Query)('priceMax')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "byId", null);
exports.HotelsController = HotelsController = __decorate([
    (0, swagger_1.ApiTags)('hotels'),
    (0, common_1.Controller)('api/hotels'),
    __metadata("design:paramtypes", [hotels_service_1.HotelsService])
], HotelsController);
let AdminHotelsController = class AdminHotelsController {
    constructor(hotels, prisma) {
        this.hotels = hotels;
        this.prisma = prisma;
    }
    create(body) {
        return this.hotels.create(body);
    }
    update(id, body) {
        return this.hotels.update(id, body);
    }
    async createRoomForHotel(hotelId, body) {
        return this.prisma.room.create({
            data: { hotelId, title: body.title, description: body.description, roomType: body.roomType, pricePerNight: body.pricePerNight, maxGuests: body.maxGuests, totalInventory: body.totalInventory, images: body.images || [] },
        });
    }
};
exports.AdminHotelsController = AdminHotelsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new roles_guard_1.RolesGuard(true)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminHotelsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new roles_guard_1.RolesGuard(true)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminHotelsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new roles_guard_1.RolesGuard(true)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminHotelsController.prototype, "createRoomForHotel", null);
exports.AdminHotelsController = AdminHotelsController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('api/admin/hotels'),
    __metadata("design:paramtypes", [hotels_service_1.HotelsService, prisma_service_1.PrismaService])
], AdminHotelsController);

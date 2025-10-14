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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
let AdminController = class AdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    listBookings() {
        return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async refund(body) {
        // Stub for demo: mark refunded
        await this.prisma.booking.update({ where: { id: body.bookingId }, data: { status: 'REFUNDED' } });
        return { success: true };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new roles_guard_1.RolesGuard(true)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listBookings", null);
__decorate([
    (0, common_1.Post)('refunds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, new roles_guard_1.RolesGuard(true)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refund", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);

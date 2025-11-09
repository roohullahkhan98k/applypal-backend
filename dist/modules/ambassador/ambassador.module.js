"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorModule = void 0;
const common_1 = require("@nestjs/common");
const ambassador_controller_1 = require("./ambassador.controller");
const ambassador_service_1 = require("./ambassador.service");
const database_module_1 = require("../../database/database.module");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let AmbassadorModule = class AmbassadorModule {
};
exports.AmbassadorModule = AmbassadorModule;
exports.AmbassadorModule = AmbassadorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/ambassador-profiles',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const ext = (0, path_1.extname)(file.originalname);
                        const filename = `ambassador-${uniqueSuffix}${ext}`;
                        callback(null, filename);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                        return callback(new Error('Only image files are allowed!'), false);
                    }
                    callback(null, true);
                },
                limits: {
                    fileSize: 1024 * 1024,
                },
            }),
        ],
        controllers: [ambassador_controller_1.AmbassadorController],
        providers: [ambassador_service_1.AmbassadorService],
        exports: [ambassador_service_1.AmbassadorService],
    })
], AmbassadorModule);
//# sourceMappingURL=ambassador.module.js.map
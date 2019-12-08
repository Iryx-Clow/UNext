import mongoose, { Schema, Document } from 'mongoose';
const autopopulate = require('mongoose-autopopulate');

export interface ICuenta extends Document {
    nombreUsuario: string,
    contrasena: string,
    nombreEmpresa: string,
    imagenEmpresa: string,
    color1?: string,
    color2?: string,
    color3?: string,
    numeroDeEscritorios: number,
    activo: boolean,
    fechaRegistro: Date
}

const cuentaSchema: Schema = new Schema({
    nombreUsuario: {
        type: String,
        unique: true,
        required: [true, 'El nombre de usuario es obligatorio']
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    nombreEmpresa: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio']
    },
    imagenEmpresa: {
        type: String,
        default: 'default.jpg',
        required: [true, 'La imagen de perfil es obligatoria']
    },
    color1: {
        type: String
    },
    color2: {
        type: String
    },
    color3: {
        type: String
    },
    numeroDeEscritorios: {
        type: Number,
        deafult: true,
        required: [true, 'El campo numeroDeEscritorios no puede ser nulo']
    },
    activo: {
        type: Boolean,
        deafult: true,
        required: [true, 'El campo activo no puede ser nulo']
    },
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria']
    }
}, {
    versionKey: false
});

cuentaSchema.plugin(autopopulate);

export default mongoose.model<ICuenta>('Cuenta', cuentaSchema, 'cuenta');
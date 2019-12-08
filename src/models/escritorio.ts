import mongoose, { Schema, Document } from 'mongoose';
const autopopulate = require('mongoose-autopopulate');

export interface IEscritorio extends Document {
    idCuenta: string,
    nombre: string,
    activo: boolean,
    fechaRegistro: Date
}

const escritorioSchema: Schema = new Schema({
    idCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
        required: [true, 'El ID de la cuenta es obligatorio']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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

escritorioSchema.plugin(autopopulate);

export default mongoose.model<IEscritorio>('Escritorio', escritorioSchema, 'escritorio');
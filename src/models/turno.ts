import mongoose, { Schema, Document } from 'mongoose';
const autopopulate = require('mongoose-autopopulate');

export interface ITurno extends Document {
    _id: Schema.Types.ObjectId,
    idCuenta: Schema.Types.ObjectId,
    idEscritorio: Schema.Types.ObjectId,
    clave: string,
    fechaRegistro: Date
}

const turnoSchema = new Schema({
    idCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
        required: [true, 'El ID de la cuenta es obligatorio']
    },
    idEscritorio: {
        type: Schema.Types.ObjectId,
        ref: 'Escritorio',
        required: [true, 'El ID del escritorio es obligatorio']
    },
    clave: {
        type: String,
        required: [true, 'La secuencia es obligatoria']
    },
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria']
    }
}, {
    versionKey: false
});

turnoSchema.plugin(autopopulate);

export default mongoose.model<ITurno>('Turno', turnoSchema, 'turno');
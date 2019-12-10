import mongoose, { Schema, Document } from 'mongoose';
const autopopulate = require('mongoose-autopopulate');

export interface ITurno extends Document {
    idCuenta: string,
    idEscritorio: string | null,
    clave: number,
    fechaRegistro: Date,
    tiempo: number | null
}

const turnoSchema = new Schema({
    idCuenta: {
        type: String,
        ref: 'Cuenta',
        required: [true, 'El ID de la cuenta es obligatorio']
    },
    idEscritorio: {
        type: Schema.Types.ObjectId,
        ref: 'Escritorio'
    },
    clave: {
        type: Number,
        required: [true, 'La clave es obligatoria']
    },
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria']
    },
    tiempo: Number
}, {
    versionKey: false
});

turnoSchema.plugin(autopopulate);

export default mongoose.model<ITurno>('Turno', turnoSchema, 'turno');
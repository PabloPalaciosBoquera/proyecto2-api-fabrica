const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let historial = [];

function cargarTrabajadores() {
    const datos = fs.readFileSync("trabajadores.json");
    return JSON.parse(datos);
}

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Fabrica funcionando"
    });
});

app.get("/trabajadores", (req, res) => {
    const trabajadores = cargarTrabajadores();
    res.json(trabajadores);
});

app.get("/trabajador/:uid", (req, res) => {
    const uid = req.params.uid.toUpperCase();

    const trabajadores = cargarTrabajadores();

    const trabajador = trabajadores.find(
        t => t.uid.toUpperCase() === uid
    );

    if (trabajador) {
        res.json(trabajador);
    } else {
        res.status(404).json({
            error: "Trabajador no encontrado"
        });
    }
});

app.post("/acceso", (req, res) => {

    const uid = req.body.uid;

    const trabajadores = cargarTrabajadores();

    const trabajador = trabajadores.find(
        t => t.uid.toUpperCase() === uid.toUpperCase()
    );

    const acceso = {
        fecha: new Date().toLocaleString(),
        uid: uid,
        nombre: trabajador ? trabajador.nombre : "Desconocido",
        puesto: trabajador ? trabajador.puesto : "-",
        resultado:
            trabajador && trabajador.puedeEntrar
                ? "PERMITIDO"
                : "DENEGADO"
    };

    historial.unshift(acceso);

    if (historial.length > 20)
        historial.pop();

    res.json(acceso);
});

app.get("/historial", (req, res) => {
    res.json(historial);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
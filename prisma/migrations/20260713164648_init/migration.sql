-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "saldo" REAL NOT NULL DEFAULT 0,
    "coins" REAL NOT NULL DEFAULT 0,
    "rol" TEXT NOT NULL DEFAULT 'jugador',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Anno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anno" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Mes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "annoId" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "limiteCoins" REAL NOT NULL DEFAULT 0,
    "limiteConsumido" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Mes_annoId_fkey" FOREIGN KEY ("annoId") REFERENCES "Anno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rango" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "numeroMin" INTEGER NOT NULL,
    "numeroMax" INTEGER NOT NULL,
    "montoMin" REAL NOT NULL,
    "montoMax" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "JugadaDiaria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "sorteo" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "anno" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Jugada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "numeroFijo" TEXT,
    "combinacion" TEXT,
    "mesId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    CONSTRAINT "Jugada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jugada_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jugadaId" INTEGER NOT NULL,
    "numeroTicket" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "monto" REAL NOT NULL,
    CONSTRAINT "Ticket_jugadaId_fkey" FOREIGN KEY ("jugadaId") REFERENCES "Jugada" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NumeroDeshabilitado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mesId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Anno_anno_key" ON "Anno"("anno");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_jugadaId_key" ON "Ticket"("jugadaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_numeroTicket_key" ON "Ticket"("numeroTicket");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_clave_key" ON "Configuracion"("clave");

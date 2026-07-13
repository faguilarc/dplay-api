import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { resolve } from 'node:path';
import * as bcrypt from 'bcryptjs';

const dbPath = resolve(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('123456', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const jugador = await prisma.usuario.upsert({
    where: { usuario: 'jugador1' },
    update: {},
    create: {
      usuario: 'jugador1',
      nombre: 'Jugador de Prueba',
      email: 'jugador1@dplay.com',
      clave: hashedPassword,
      rol: 'jugador',
      saldo: 1000,
      coins: 500,
      activo: true,
    },
  });

  const admin = await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      usuario: 'admin',
      nombre: 'Administrador',
      email: 'admin@dplay.com',
      clave: hashedAdminPassword,
      rol: 'admin',
      activo: true,
    },
  });

  console.log(`Created users: ${jugador.usuario}, ${admin.usuario}`);

  const anno = await prisma.anno.upsert({
    where: { anno: 2024 },
    update: { activo: true },
    create: {
      anno: 2024,
      activo: true,
    },
  });

  console.log(`Created year: ${anno.anno}`);

  for (let i = 1; i <= 12; i++) {
    const mesExistente = await prisma.mes.findFirst({
      where: { annoId: anno.id, mes: i },
    });

    if (!mesExistente) {
      await prisma.mes.create({
        data: {
          annoId: anno.id,
          mes: i,
          nombre: MESES_NOMBRES[i - 1],
          activo: true,
          limiteCoins: 50000,
          limiteConsumido: 0,
        },
      });
    }
  }

  console.log('Created 12 months for 2024');

  await prisma.rango.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tipo: 'mini',
      numeroMin: 0,
      numeroMax: 99,
      montoMin: 1,
      montoMax: 500,
    },
  });

  await prisma.rango.upsert({
    where: { id: 2 },
    update: {},
    create: {
      tipo: 'grande',
      numeroMin: 0,
      numeroMax: 9999,
      montoMin: 1,
      montoMax: 1000,
    },
  });

  console.log('Created ranges: mini, grande');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingResults = await prisma.jugadaDiaria.findMany({
    where: { fecha: today },
  });

  if (existingResults.length === 0) {
    await prisma.jugadaDiaria.createMany({
      data: [
        {
          fecha: today,
          sorteo: 'dia',
          numero: '4523',
          tipo: 'grande',
          anno: 2024,
          mes: today.getMonth() + 1,
        },
        {
          fecha: today,
          sorteo: 'dia',
          numero: '67',
          tipo: 'mini',
          anno: 2024,
          mes: today.getMonth() + 1,
        },
        {
          fecha: today,
          sorteo: 'noche',
          numero: '8912',
          tipo: 'grande',
          anno: 2024,
          mes: today.getMonth() + 1,
        },
        {
          fecha: today,
          sorteo: 'noche',
          numero: '34',
          tipo: 'mini',
          anno: 2024,
          mes: today.getMonth() + 1,
        },
      ],
    });

    console.log('Created sample JugadaDiaria for today');
  }

  const existingNotifs = await prisma.notificacion.findMany({
    where: { usuarioId: jugador.id },
  });

  if (existingNotifs.length === 0) {
    await prisma.notificacion.createMany({
      data: [
        {
          usuarioId: jugador.id,
          mensaje: 'Bienvenido a DPlay! Tu cuenta ha sido creada exitosamente.',
          leida: false,
        },
        {
          usuarioId: jugador.id,
          mensaje: 'Se han habilitado las apuestas para el mes actual.',
          leida: false,
        },
        {
          usuarioId: jugador.id,
          mensaje: 'Recuerda que puedes consultar tus resultados diarios en la seccion de resultados.',
          leida: true,
        },
      ],
    });

    console.log('Created sample notifications');
  }

  await prisma.configuracion.upsert({
    where: { clave: 'habilitada' },
    update: {},
    create: { clave: 'habilitada', valor: 'true' },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'horaDia' },
    update: {},
    create: { clave: 'horaDia', valor: '08:00' },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'horaNoche' },
    update: {},
    create: { clave: 'horaNoche', valor: '20:00' },
  });

  console.log('Created configuration values');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
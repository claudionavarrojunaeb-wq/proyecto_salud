import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

const regionesData = [
  { codigo: '15', nombre: 'Arica y Parinacota', abreviatura: 'XV', orden_visual: 1 },
  { codigo: '01', nombre: 'Tarapaca', abreviatura: 'I', orden_visual: 2 },
  { codigo: '02', nombre: 'Antofagasta', abreviatura: 'II', orden_visual: 3 },
  { codigo: '03', nombre: 'Atacama', abreviatura: 'III', orden_visual: 4 },
  { codigo: '04', nombre: 'Coquimbo', abreviatura: 'IV', orden_visual: 5 },
  { codigo: '05', nombre: 'Valparaiso', abreviatura: 'V', orden_visual: 6 },
  { codigo: '13', nombre: 'Metropolitana de Santiago', abreviatura: 'RM', orden_visual: 7 },
  { codigo: '06', nombre: "Libertador General Bernardo O'Higgins", abreviatura: 'VI', orden_visual: 8 },
  { codigo: '07', nombre: 'Maule', abreviatura: 'VII', orden_visual: 9 },
  { codigo: '16', nombre: 'Nuble', abreviatura: 'XVI', orden_visual: 10 },
  { codigo: '08', nombre: 'Biobio', abreviatura: 'VIII', orden_visual: 11 },
  { codigo: '09', nombre: 'La Araucania', abreviatura: 'IX', orden_visual: 12 },
  { codigo: '14', nombre: 'Los Rios', abreviatura: 'XIV', orden_visual: 13 },
  { codigo: '10', nombre: 'Los Lagos', abreviatura: 'X', orden_visual: 14 },
  { codigo: '11', nombre: 'Aysen del General Carlos Ibanez del Campo', abreviatura: 'XI', orden_visual: 15 },
  { codigo: '12', nombre: 'Magallanes y de la Antartica Chilena', abreviatura: 'XII', orden_visual: 16 },
];

const provinciasData = [
  { codigo: '151', nombre: 'Arica', regionCodigo: '15' },
  { codigo: '152', nombre: 'Parinacota', regionCodigo: '15' },
  { codigo: '011', nombre: 'Iquique', regionCodigo: '01' },
  { codigo: '012', nombre: 'El Tamarugal', regionCodigo: '01' },
  { codigo: '021', nombre: 'Antofagasta', regionCodigo: '02' },
  { codigo: '022', nombre: 'El Loa', regionCodigo: '02' },
  { codigo: '023', nombre: 'Tocopilla', regionCodigo: '02' },
  { codigo: '031', nombre: 'Chañaral', regionCodigo: '03' },
  { codigo: '032', nombre: 'Copiapo', regionCodigo: '03' },
  { codigo: '033', nombre: 'Huasco', regionCodigo: '03' },
  { codigo: '041', nombre: 'Elqui', regionCodigo: '04' },
  { codigo: '042', nombre: 'Choapa', regionCodigo: '04' },
  { codigo: '043', nombre: 'Limari', regionCodigo: '04' },
  { codigo: '051', nombre: 'Valparaiso', regionCodigo: '05' },
  { codigo: '052', nombre: 'Isla de Pascua', regionCodigo: '05' },
  { codigo: '053', nombre: 'Los Andes', regionCodigo: '05' },
  { codigo: '054', nombre: 'Petorca', regionCodigo: '05' },
  { codigo: '055', nombre: 'Quillota', regionCodigo: '05' },
  { codigo: '056', nombre: 'San Antonio', regionCodigo: '05' },
  { codigo: '057', nombre: 'San Felipe de Aconcagua', regionCodigo: '05' },
  { codigo: '058', nombre: 'Marga Marga', regionCodigo: '05' },
  { codigo: '131', nombre: 'Santiago', regionCodigo: '13' },
  { codigo: '132', nombre: 'Chacabuco', regionCodigo: '13' },
  { codigo: '133', nombre: 'Cordillera', regionCodigo: '13' },
  { codigo: '134', nombre: 'Maipo', regionCodigo: '13' },
  { codigo: '135', nombre: 'Melipilla', regionCodigo: '13' },
  { codigo: '136', nombre: 'Talagante', regionCodigo: '13' },
  { codigo: '061', nombre: 'Cachapoal', regionCodigo: '06' },
  { codigo: '062', nombre: 'Cardenal Caro', regionCodigo: '06' },
  { codigo: '063', nombre: 'Colchagua', regionCodigo: '06' },
  { codigo: '071', nombre: 'Talca', regionCodigo: '07' },
  { codigo: '072', nombre: 'Cauquenes', regionCodigo: '07' },
  { codigo: '073', nombre: 'Curico', regionCodigo: '07' },
  { codigo: '074', nombre: 'Linares', regionCodigo: '07' },
  { codigo: '161', nombre: 'Diguillin', regionCodigo: '16' },
  { codigo: '162', nombre: 'Itata', regionCodigo: '16' },
  { codigo: '163', nombre: 'Punilla', regionCodigo: '16' },
  { codigo: '081', nombre: 'Concepcion', regionCodigo: '08' },
  { codigo: '082', nombre: 'Arauco', regionCodigo: '08' },
  { codigo: '083', nombre: 'Biobio', regionCodigo: '08' },
  { codigo: '091', nombre: 'Cautin', regionCodigo: '09' },
  { codigo: '092', nombre: 'Malleco', regionCodigo: '09' },
  { codigo: '141', nombre: 'Valdivia', regionCodigo: '14' },
  { codigo: '142', nombre: 'Ranco', regionCodigo: '14' },
  { codigo: '101', nombre: 'Llanquihue', regionCodigo: '10' },
  { codigo: '102', nombre: 'Chiloe', regionCodigo: '10' },
  { codigo: '103', nombre: 'Osorno', regionCodigo: '10' },
  { codigo: '104', nombre: 'Palena', regionCodigo: '10' },
  { codigo: '111', nombre: 'Coyhaique', regionCodigo: '11' },
  { codigo: '112', nombre: 'Aisen', regionCodigo: '11' },
  { codigo: '113', nombre: 'General Carrera', regionCodigo: '11' },
  { codigo: '114', nombre: 'Capitan Prat', regionCodigo: '11' },
  { codigo: '121', nombre: 'Ultima Esperanza', regionCodigo: '12' },
  { codigo: '122', nombre: 'Magallanes', regionCodigo: '12' },
  { codigo: '123', nombre: 'Tierra del Fuego', regionCodigo: '12' },
  { codigo: '124', nombre: 'Antartica Chilena', regionCodigo: '12' },
];

const comunasData: [string, string, string][] = [
  ['Arica', '15101', '151'], ['Camarones', '15102', '151'],
  ['General Lagos', '15201', '152'], ['Putre', '15202', '152'],
  ['Alto Hospicio', '01107', '011'], ['Iquique', '01101', '011'],
  ['Huara', '01201', '012'], ['Camiña', '01202', '012'], ['Colchane', '01203', '012'], ['Pica', '01204', '012'], ['Pozo Almonte', '01205', '012'],
  ['Antofagasta', '02101', '021'], ['Mejillones', '02102', '021'], ['Sierra Gorda', '02103', '021'], ['Taltal', '02104', '021'],
  ['Calama', '02201', '022'], ['Ollague', '02202', '022'], ['San Pedro de Atacama', '02203', '022'],
  ['Maria Elena', '02301', '023'], ['Tocopilla', '02302', '023'],
  ['Chañaral', '03101', '031'], ['Diego de Almagro', '03102', '031'],
  ['Caldera', '03201', '032'], ['Copiapo', '03202', '032'], ['Tierra Amarilla', '03203', '032'],
  ['Alto del Carmen', '03301', '033'], ['Freirina', '03302', '033'], ['Huasco', '03303', '033'], ['Vallenar', '03304', '033'],
  ['Andacollo', '04103', '041'], ['Coquimbo', '04104', '041'], ['La Higuera', '04105', '041'], ['La Serena', '04101', '041'], ['Paihuano', '04106', '041'], ['Vicuna', '04107', '041'],
  ['Canela', '04201', '042'], ['Illapel', '04202', '042'], ['Los Vilos', '04203', '042'], ['Salamanca', '04204', '042'],
  ['Combarbala', '04301', '043'], ['Monte Patria', '04302', '043'], ['Ovalle', '04303', '043'], ['Punitaqui', '04304', '043'], ['Rio Hurtado', '04305', '043'],
  ['Casablanca', '05103', '051'], ['Concon', '05104', '051'], ['Juan Fernandez', '05105', '051'], ['Puchuncavi', '05106', '051'], ['Quintero', '05107', '051'], ['Valparaiso', '05101', '051'], ['Vina del Mar', '05109', '051'],
  ['Isla de Pascua', '05201', '052'],
  ['Calle Larga', '05301', '053'], ['Los Andes', '05302', '053'], ['Rinconada', '05303', '053'], ['San Esteban', '05304', '053'],
  ['Cabildo', '05401', '054'], ['La Ligua', '05402', '054'], ['Papudo', '05403', '054'], ['Petorca', '05404', '054'], ['Zapallar', '05405', '054'],
  ['Calera', '05501', '055'], ['Hijuelas', '05502', '055'], ['La Cruz', '05503', '055'], ['Limache', '05505', '055'], ['Nogales', '05504', '055'], ['Olmué', '05506', '055'], ['Quillota', '05507', '055'],
  ['Algarrobo', '05601', '056'], ['Cartagena', '05602', '056'], ['El Quisco', '05603', '056'], ['El Tabo', '05604', '056'], ['San Antonio', '05605', '056'], ['Santo Domingo', '05606', '056'],
  ['Catemu', '05701', '057'], ['Llaillay', '05702', '057'], ['Panquehue', '05703', '057'], ['Putaendo', '05704', '057'], ['San Felipe', '05705', '057'], ['Santa Maria', '05706', '057'],
  ['Limache', '05801', '058'], ['Olmué', '05802', '058'], ['Quilpue', '05803', '058'], ['Villa Alemana', '05804', '058'],
  ['Cerrillos', '13101', '131'], ['Cerro Navia', '13102', '131'], ['Conchali', '13103', '131'], ['El Bosque', '13104', '131'], ['Estacion Central', '13105', '131'], ['Huechuraba', '13106', '131'], ['Independencia', '13107', '131'], ['La Cisterna', '13108', '131'], ['La Florida', '13109', '131'], ['La Granja', '13110', '131'], ['La Pintana', '13111', '131'], ['La Reina', '13112', '131'], ['Las Condes', '13113', '131'], ['Lo Barnechea', '13114', '131'], ['Lo Espejo', '13115', '131'], ['Lo Prado', '13116', '131'], ['Macul', '13117', '131'], ['Maipu', '13118', '131'], ['Nunoa', '13119', '131'], ['Pedro Aguirre Cerda', '13120', '131'], ['Penalolen', '13121', '131'], ['Providencia', '13122', '131'], ['Pudahuel', '13123', '131'], ['Quilicura', '13124', '131'], ['Quinta Normal', '13125', '131'], ['Recoleta', '13126', '131'], ['Renca', '13127', '131'], ['San Joaquin', '13128', '131'], ['San Miguel', '13129', '131'], ['San Ramon', '13130', '131'], ['Santiago', '13131', '131'], ['Vitacura', '13132', '131'],
  ['Colina', '13201', '132'], ['Lampa', '13202', '132'], ['Tiltil', '13203', '132'],
  ['Pirque', '13301', '133'], ['Puente Alto', '13302', '133'], ['San Jose de Maipo', '13303', '133'],
  ['Buin', '13401', '134'], ['Calera de Tango', '13402', '134'], ['Paine', '13403', '134'],
  ['Curacavi', '13501', '135'], ['Maria Pinto', '13502', '135'], ['Melipilla', '13503', '135'], ['San Pedro', '13504', '135'],
  ['Alhué', '13601', '136'], ['Isla de Maipo', '13602', '136'], ['El Monte', '13603', '136'], ['Padre Hurtado', '13604', '136'], ['Peñaflor', '13605', '136'], ['Talagante', '13606', '136'],
  ['Codegua', '06101', '061'], ['Coinco', '06102', '061'], ['Coltauco', '06103', '061'], ['Doñihue', '06104', '061'], ['Graneros', '06105', '061'], ['Las Cabras', '06106', '061'], ['Machali', '06107', '061'], ['Malloa', '06108', '061'], ['Mostazal', '06109', '061'], ['Olivar', '06110', '061'], ['Peumo', '06111', '061'], ['Pichidegua', '06112', '061'], ['Quinta de Tilcoco', '06113', '061'], ['Rancagua', '06114', '061'], ['Requinoa', '06115', '061'], ['Rengo', '06116', '061'], ['San Vicente de Tagua Tagua', '06117', '061'],
  ['Chépica', '06301', '063'], ['Chimbarongo', '06302', '063'], ['Lolol', '06303', '063'], ['Nancagua', '06304', '063'], ['Palmilla', '06305', '063'], ['Peralillo', '06306', '063'], ['Placilla', '06307', '063'], ['Pumanque', '06308', '063'], ['San Fernando', '06309', '063'], ['Santa Cruz', '06310', '063'],
  ['La Estrella', '06201', '062'], ['Litueche', '06202', '062'], ['Marchihue', '06203', '062'], ['Navidad', '06204', '062'], ['Paredones', '06205', '062'], ['Pichilemu', '06206', '062'],
  ['Constitucion', '07101', '071'], ['Curepto', '07102', '071'], ['Empedrado', '07103', '071'], ['Maule', '07104', '071'], ['Pelarco', '07105', '071'], ['Pencahue', '07106', '071'], ['Rio Claro', '07107', '071'], ['San Clemente', '07108', '071'], ['San Rafael', '07109', '071'], ['Talca', '07110', '071'],
  ['Cauquenes', '07201', '072'], ['Chanco', '07202', '072'], ['Pelluhue', '07203', '072'],
  ['Curico', '07301', '073'], ['Hualañé', '07302', '073'], ['Licanten', '07303', '073'], ['Molina', '07304', '073'], ['Rauco', '07305', '073'], ['Romeral', '07306', '073'], ['Sagrada Familia', '07307', '073'], ['Teno', '07308', '073'], ['Vichuquen', '07309', '073'],
  ['Colbun', '07401', '074'], ['Longavi', '07402', '074'], ['Linares', '07403', '074'], ['Parral', '07404', '074'], ['Retiro', '07405', '074'], ['San Javier de Loncomilla', '07406', '074'], ['Villa Alegre', '07407', '074'], ['Yerbas Buenas', '07408', '074'],
  ['Bulnes', '16101', '161'], ['Chillan Viejo', '16102', '161'], ['Chillan', '16103', '161'], ['El Carmen', '16104', '161'], ['Pemuco', '16105', '161'], ['Pinto', '16106', '161'], ['Quillon', '16107', '161'], ['San Ignacio', '16108', '161'], ['Yungay', '16109', '161'],
  ['Cobquecura', '16201', '162'], ['Coelemu', '16202', '162'], ['Ninhue', '16203', '162'], ['Portezuelo', '16204', '162'], ['Quirihue', '16205', '162'], ['Ranquil', '16206', '162'], ['Trehuaco', '16207', '162'],
  ['Coihueco', '16301', '163'], ['Niquen', '16302', '163'], ['San Carlos', '16303', '163'], ['San Fabian', '16304', '163'], ['San Nicolas', '16305', '163'],
  ['Chiguayante', '08101', '081'], ['Concepcion', '08102', '081'], ['Coronel', '08103', '081'], ['Florida', '08104', '081'], ['Hualpen', '08105', '081'], ['Hualqui', '08106', '081'], ['Lota', '08107', '081'], ['Penco', '08108', '081'], ['San Pedro de la Paz', '08109', '081'], ['Santa Juana', '08110', '081'], ['Talcahuano', '08111', '081'], ['Tomé', '08112', '081'],
  ['Arauco', '08201', '082'], ['Cañete', '08202', '082'], ['Contulmo', '08203', '082'], ['Curanilahue', '08204', '082'], ['Lebu', '08205', '082'], ['Los Alamos', '08206', '082'], ['Tirua', '08207', '082'],
  ['Alto Biobio', '08301', '083'], ['Antuco', '08302', '083'], ['Cabrero', '08303', '083'], ['Laja', '08304', '083'], ['Los Angeles', '08305', '083'], ['Mulchen', '08306', '083'], ['Nacimiento', '08307', '083'], ['Negrete', '08308', '083'], ['Quilaco', '08309', '083'], ['Quilleco', '08310', '083'], ['San Rosendo', '08311', '083'], ['Santa Barbara', '08312', '083'], ['Tucapel', '08313', '083'], ['Yumbel', '08314', '083'],
  ['Carahue', '09101', '091'], ['Cholchol', '09102', '091'], ['Cunco', '09103', '091'], ['Curarrehue', '09104', '091'], ['Freire', '09105', '091'], ['Galvarino', '09106', '091'], ['Gorbea', '09107', '091'], ['Lautaro', '09108', '091'], ['Loncoche', '09109', '091'], ['Melipeuco', '09110', '091'], ['Nueva Imperial', '09111', '091'], ['Padre Las Casas', '09112', '091'], ['Perquenco', '09113', '091'], ['Pitrufquen', '09114', '091'], ['Pucón', '09115', '091'], ['Saavedra', '09116', '091'], ['Temuco', '09117', '091'], ['Teodoro Schmidt', '09118', '091'], ['Toltén', '09119', '091'], ['Vilcún', '09120', '091'], ['Villarrica', '09121', '091'],
  ['Angol', '09201', '092'], ['Collipulli', '09202', '092'], ['Curacautin', '09203', '092'], ['Ercilla', '09204', '092'], ['Lonquimay', '09205', '092'], ['Los Sauces', '09206', '092'], ['Lumaco', '09207', '092'], ['Puren', '09208', '092'], ['Renaico', '09209', '092'], ['Traiguen', '09210', '092'], ['Victoria', '09211', '092'],
  ['Corral', '14101', '141'], ['Lanco', '14102', '141'], ['Los Lagos', '14103', '141'], ['Mafil', '14104', '141'], ['Mariquina', '14105', '141'], ['Paillaco', '14106', '141'], ['Panguipulli', '14107', '141'], ['Valdivia', '14108', '141'],
  ['Futrono', '14201', '142'], ['La Union', '14202', '142'], ['Lago Ranco', '14203', '142'], ['Rio Bueno', '14204', '142'],
  ['Ancud', '10201', '102'], ['Castro', '10202', '102'], ['Chonchi', '10203', '102'], ['Curaco de Velez', '10204', '102'], ['Dalcahue', '10205', '102'], ['Puqueldon', '10206', '102'], ['Queilen', '10207', '102'], ['Quellon', '10208', '102'], ['Quemchi', '10209', '102'], ['Quinchao', '10210', '102'],
  ['Calbuco', '10101', '101'], ['Cochamo', '10102', '101'], ['Fresia', '10103', '101'], ['Frutillar', '10104', '101'], ['Llanquihue', '10105', '101'], ['Los Muermos', '10106', '101'], ['Maullin', '10107', '101'], ['Puerto Montt', '10108', '101'], ['Puerto Varas', '10109', '101'],
  ['Osorno', '10301', '103'], ['Puerto Octay', '10302', '103'], ['Purranque', '10303', '103'], ['Puyehue', '10304', '103'], ['Rio Negro', '10305', '103'], ['San Juan de la Costa', '10306', '103'], ['San Pablo', '10307', '103'],
  ['Chaiten', '10401', '104'], ['Futaleufu', '10402', '104'], ['Hualaihué', '10403', '104'], ['Palena', '10404', '104'],
  ['Coyhaique', '11101', '111'],
  ['Aisen', '11201', '112'], ['Cisnes', '11202', '112'], ['Guaitecas', '11203', '112'],
  ['Chile Chico', '11301', '113'], ['Rio Ibanez', '11302', '113'],
  ['Cochrane', '11401', '114'], ["O'Higgins", '11402', '114'], ['Tortel', '11403', '114'],
  ['Natales', '12101', '121'], ['Torres del Paine', '12102', '121'],
  ['Punta Arenas', '12201', '122'], ['Laguna Blanca', '12202', '122'], ['Rio Verde', '12203', '122'], ['San Gregorio', '12204', '122'],
  ['Porvenir', '12301', '123'], ['Primavera', '12302', '123'], ['Timaukel', '12303', '123'],
  ['Antartica', '12401', '124'], ['Cabo de Hornos', '12402', '124'],
];

const rolesData = [
  { codigo: 'ADMIN', nombre: 'Administrador', descripcion: 'Acceso total al sistema', requiere_contexto: 'GLOBAL' },
  { codigo: 'SUPERVISOR', nombre: 'Supervisor', descripcion: 'Supervisor regional con acceso a lectura y escritura limitada', requiere_contexto: 'REGIONAL' },
  { codigo: 'OPERADOR', nombre: 'Operador', descripcion: 'Operador vinculado a prestador con acceso operativo', requiere_contexto: 'PRESTADOR' },
];

const modulos = ['usuarios', 'roles', 'permisos', 'regiones', 'provincias', 'comunas', 'prestadores', 'notificaciones', 'auditoria'];
const acciones = ['read', 'write'];

async function main(): Promise<void> {
  console.log('Seeding regiones...');
  for (const r of regionesData) {
    await prisma.regiones.upsert({
      where: { codigo: r.codigo },
      create: { codigo: r.codigo, nombre: r.nombre, abreviatura: r.abreviatura, orden_visual: r.orden_visual, activo: true },
      update: { nombre: r.nombre, abreviatura: r.abreviatura, orden_visual: r.orden_visual },
    });
  }

  console.log('Seeding provincias...');
  for (const p of provinciasData) {
    const region = await prisma.regiones.findUnique({ where: { codigo: p.regionCodigo } });
    if (!region) throw new Error(`Region ${p.regionCodigo} not found`);
    await prisma.provincias.upsert({
      where: { codigo: p.codigo },
      create: { codigo: p.codigo, nombre: p.nombre, region_id: region.region_id, activo: true, fecha_creacion: new Date() },
      update: { nombre: p.nombre, region_id: region.region_id },
    });
  }

  console.log('Seeding comunas...');
  for (const [nombre, codigo, provinciaCodigo] of comunasData) {
    const provincia = await prisma.provincias.findUnique({ where: { codigo: provinciaCodigo } });
    if (!provincia) throw new Error(`Provincia ${provinciaCodigo} not found`);
    await prisma.comunas.upsert({
      where: { codigo },
      create: { codigo, nombre, provincia_id: provincia.provincia_id, activo: true, fecha_creacion: new Date() },
      update: { nombre, provincia_id: provincia.provincia_id },
    });
  }

  console.log('Seeding roles...');
  for (const rol of rolesData) {
    await prisma.roles.upsert({
      where: { codigo: rol.codigo },
      create: rol,
      update: { nombre: rol.nombre, descripcion: rol.descripcion, requiere_contexto: rol.requiere_contexto },
    });
  }

  console.log('Seeding permisos...');
  const permisosCreados: { codigo: string; permiso_id: number }[] = [];
  for (const modulo of modulos) {
    for (const accion of acciones) {
      if (modulo === 'auditoria' && accion === 'write') continue;
      const codigo = `${modulo}:${accion}`;
      const permiso = await prisma.permisos.upsert({
        where: { codigo },
        create: { codigo, modulo, accion, descripcion: `${accion === 'read' ? 'Leer' : 'Escribir'} ${modulo}`, activo: true },
        update: {},
      });
      permisosCreados.push({ codigo, permiso_id: permiso.permiso_id });
    }
  }

  console.log('Assigning all permisos to ADMIN role...');
  const adminRol = await prisma.roles.findUnique({ where: { codigo: 'ADMIN' } });
  if (!adminRol) throw new Error('ADMIN role not found');

  for (const p of permisosCreados) {
    await prisma.rolesPermisos.upsert({
      where: { rol_id_permiso_id: { rol_id: adminRol.rol_id, permiso_id: p.permiso_id } },
      create: { rol_id: adminRol.rol_id, permiso_id: p.permiso_id },
      update: {},
    });
  }

  console.log('Assigning read permisos to SUPERVISOR role...');
  const supervisorRol = await prisma.roles.findUnique({ where: { codigo: 'SUPERVISOR' } });
  if (!supervisorRol) throw new Error('SUPERVISOR role not found');
  for (const p of permisosCreados.filter((x) => x.codigo.endsWith(':read'))) {
    await prisma.rolesPermisos.upsert({
      where: { rol_id_permiso_id: { rol_id: supervisorRol.rol_id, permiso_id: p.permiso_id } },
      create: { rol_id: supervisorRol.rol_id, permiso_id: p.permiso_id },
      update: {},
    });
  }

  console.log('Seeding admin user...');
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.usuarios.upsert({
    where: { rut: '11111111-1' },
    create: {
      rut: '11111111-1',
      nombres: 'Administrador',
      primer_apellido: 'Sistema',
      tipo_usuario: 'INTERNO',
      correo_electronico: 'admin@salud.junaeb.cl',
      tipo_autenticacion: 'LOCAL',
      password_hash: passwordHash,
      activo: true,
      bloqueado: false,
      intentos_fallidos: 0,
    },
    update: { password_hash: passwordHash },
  });

  console.log('Assigning ADMIN role to admin user...');
  await prisma.usuariosRoles.upsert({
    where: { usuario_id_rol_id: { usuario_id: adminUser.usuario_id, rol_id: adminRol.rol_id } },
    create: { usuario_id: adminUser.usuario_id, rol_id: adminRol.rol_id },
    update: {},
  });

  console.log('Seed completed successfully!');
  console.log(`  - ${regionesData.length} regiones`);
  console.log(`  - ${provinciasData.length} provincias`);
  console.log(`  - ${comunasData.length} comunas`);
  console.log(`  - ${rolesData.length} roles`);
  console.log(`  - ${permisosCreados.length} permisos`);
  console.log('  - 1 admin user (rut: 11111111-1, password: Admin123!)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

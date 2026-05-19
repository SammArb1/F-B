import type { User, Parche, Plan, Vote, Attendance } from '../types';


export const seedUsers: User[] = [
    { id: 'u1', fullName: 'Carlos Méndez', email: 'carlos@eia.edu.co', major: 'Ingeniería de Sistemas', avatarUrl: '', password: '1234' },
    { id: 'u2', fullName: 'Valentina Ríos', email: 'vrios@uniandes.edu.co', major: 'Diseño Industrial', avatarUrl: '', password: '1234' },
    { id: 'u3', fullName: 'Santiago Herrera', email: 'sherrera@uniandes.edu.co', major: 'Administración', avatarUrl: '', password: '1234' },
    { id: 'u4', fullName: 'Isabella Torres', email: 'itorres@uniandes.edu.co', major: 'Derecho', avatarUrl: '', password: '1234' },
    { id: 'u5', fullName: 'Mateo Gómez', email: 'mgomez@uniandes.edu.co', major: 'Economía', avatarUrl: '', password: '1234' },
    { id: 'u6', fullName: 'Luciana Vargas', email: 'lvargas@uniandes.edu.co', major: 'Medicina', avatarUrl: '', password: '1234' },
    { id: 'u7', fullName: 'Andrés Pineda', email: 'apineda@uniandes.edu.co', major: 'Arquitectura', avatarUrl: '', password: '1234' },
    { id: 'u8', fullName: 'Camila Restrepo', email: 'crestrepo@uniandes.edu.co', major: 'Comunicación Social', avatarUrl: '', password: '1234' },
    { id: 'u9', fullName: 'Felipe Castillo', email: 'fcastillo@uniandes.edu.co', major: 'Ingeniería Civil', avatarUrl: '', password: '1234' },
    { id: 'u10', fullName: 'Mariana López', email: 'mlopez@uniandes.edu.co', major: 'Psicología', avatarUrl: '', password: '1234' },
];


export const seedParches: Parche[] = [
    {
        id: 'p1',
        name: 'Los Ingenieros 🔧',
        description: 'Grupo de ingeniería para salidas, estudio y networking. ¡Siempre con planes!',
        coverUrl: '',
        inviteCode: 'ING2026',
        members: [
            { userId: 'u1', role: 'OWNER' },
            { userId: 'u2', role: 'MODERATOR' },
            { userId: 'u3', role: 'MEMBER' },
            { userId: 'u4', role: 'MEMBER' },
            { userId: 'u5', role: 'MEMBER' },
            { userId: 'u6', role: 'MEMBER' },
            { userId: 'u9', role: 'MEMBER' },
        ],
        createdAt: '2026-01-15T10:00:00Z',
    },
    {
        id: 'p2',
        name: 'Crew Creativo 🎨',
        description: 'Diseñadores, comunicadores y artistas. Planes culturales y salidas creativas.',
        coverUrl: '',
        inviteCode: 'CRE2026',
        members: [
            { userId: 'u2', role: 'OWNER' },
            { userId: 'u7', role: 'MODERATOR' },
            { userId: 'u8', role: 'MEMBER' },
            { userId: 'u10', role: 'MEMBER' },
            { userId: 'u1', role: 'MEMBER' },
            { userId: 'u3', role: 'MEMBER' },
            { userId: 'u5', role: 'MEMBER' },
        ],
        createdAt: '2026-02-01T14:30:00Z',
    },
];


export const seedPlans: Plan[] = [
    // Parche 1 plans
    {
        id: 'pl1', parcheId: 'p1', title: 'Hamburgueseada en Crepes', description: 'Salida a comer hamburguesas después de parciales', dateWindow: { start: '2026-03-20T18:00:00Z', end: '2026-03-20T22:00:00Z' }, options: [
            { id: 'o1', place: 'Crepes & Waffles Zona T', time: '2026-03-20T18:00:00Z', votesCount: 3 },
            { id: 'o2', place: 'Burger King Calle 85', time: '2026-03-20T19:00:00Z', votesCount: 2 },
            { id: 'o3', place: 'El Corral Usaquén', time: '2026-03-20T18:30:00Z', votesCount: 1 },
        ], state: 'VOTING_OPEN', winningOptionId: null, createdBy: 'u1', createdAt: '2026-03-10T08:00:00Z'
    },

    {
        id: 'pl2', parcheId: 'p1', title: 'Study Session Cálculo III', description: 'Grupo de estudio para el segundo parcial', dateWindow: { start: '2026-03-18T14:00:00Z', end: '2026-03-18T18:00:00Z' }, options: [
            { id: 'o4', place: 'Biblioteca Central', time: '2026-03-18T14:00:00Z', votesCount: 4 },
            { id: 'o5', place: 'Sala de estudio ML', time: '2026-03-18T15:00:00Z', votesCount: 1 },
            { id: 'o6', place: 'Café Juan Valdez Campus', time: '2026-03-18T14:30:00Z', votesCount: 2 },
        ], state: 'VOTING_CLOSED', winningOptionId: 'o4', createdBy: 'u1', createdAt: '2026-03-08T10:00:00Z'
    },

    {
        id: 'pl3', parcheId: 'p1', title: 'Fútbol 5 el viernes', description: 'Reservar cancha para jugar un partido', dateWindow: { start: '2026-03-21T16:00:00Z', end: '2026-03-21T18:00:00Z' }, options: [
            { id: 'o7', place: 'Canchas Compensar', time: '2026-03-21T16:00:00Z', votesCount: 0 },
            { id: 'o8', place: 'Canchas Salitre', time: '2026-03-21T17:00:00Z', votesCount: 0 },
            { id: 'o9', place: 'Polideportivo U', time: '2026-03-21T16:30:00Z', votesCount: 0 },
        ], state: 'DRAFT', winningOptionId: null, createdBy: 'u2', createdAt: '2026-03-12T09:00:00Z'
    },

    {
        id: 'pl4', parcheId: 'p1', title: 'Cine: nueva de Marvel', description: 'Ir a ver la nueva película de Marvel', dateWindow: { start: '2026-03-25T19:00:00Z', end: '2026-03-25T23:00:00Z' }, options: [
            { id: 'o10', place: 'Cinemark Andino', time: '2026-03-25T19:00:00Z', votesCount: 3 },
            { id: 'o11', place: 'Cine Colombia Titán', time: '2026-03-25T20:00:00Z', votesCount: 3 },
            { id: 'o12', place: 'Royal Films Gran Estación', time: '2026-03-25T19:30:00Z', votesCount: 1 },
        ], state: 'VOTING_CLOSED', winningOptionId: 'o10', createdBy: 'u3', createdAt: '2026-03-11T15:00:00Z'
    },

    {
        id: 'pl5', parcheId: 'p1', title: 'Salida a Monserrate', description: 'Subir a Monserrate el domingo temprano', dateWindow: { start: '2026-03-23T06:00:00Z', end: '2026-03-23T12:00:00Z' }, options: [
            { id: 'o13', place: 'Sendero peatonal', time: '2026-03-23T06:00:00Z', votesCount: 4 },
            { id: 'o14', place: 'Teleférico', time: '2026-03-23T08:00:00Z', votesCount: 2 },
            { id: 'o15', place: 'Funicular', time: '2026-03-23T07:00:00Z', votesCount: 1 },
        ], state: 'SCHEDULED', winningOptionId: 'o13', createdBy: 'u1', createdAt: '2026-03-05T08:00:00Z'
    },

    {
        id: 'pl6', parcheId: 'p1', title: 'Karaoke Night 🎤', description: 'Noche de karaoke para celebrar fin de parciales', dateWindow: { start: '2026-03-28T20:00:00Z', end: '2026-03-29T01:00:00Z' }, options: [
            { id: 'o16', place: 'La Karakola Bar', time: '2026-03-28T20:00:00Z', votesCount: 2 },
            { id: 'o17', place: 'Studio K Bar', time: '2026-03-28T21:00:00Z', votesCount: 1 },
            { id: 'o18', place: 'Singing Room Chapinero', time: '2026-03-28T20:30:00Z', votesCount: 0 },
        ], state: 'VOTING_OPEN', winningOptionId: null, createdBy: 'u5', createdAt: '2026-03-13T11:00:00Z'
    },

    {
        id: 'pl7', parcheId: 'p1', title: 'Taller de Python', description: 'Workshop informal de Python para todos los niveles', dateWindow: { start: '2026-03-19T10:00:00Z', end: '2026-03-19T13:00:00Z' }, options: [
            { id: 'o19', place: 'Laboratorio 201', time: '2026-03-19T10:00:00Z', votesCount: 5 },
            { id: 'o20', place: 'Aula Virtual Zoom', time: '2026-03-19T11:00:00Z', votesCount: 1 },
            { id: 'o21', place: 'Sala de cómputo B', time: '2026-03-19T10:30:00Z', votesCount: 1 },
        ], state: 'SCHEDULED', winningOptionId: 'o19', createdBy: 'u1', createdAt: '2026-03-01T09:00:00Z'
    },

    {
        id: 'pl8', parcheId: 'p1', title: 'Asado de integración', description: 'Asado en la finca de Santiago para integrar al parche', dateWindow: { start: '2026-04-05T11:00:00Z', end: '2026-04-05T20:00:00Z' }, options: [
            { id: 'o22', place: 'Finca La Esperanza - La Calera', time: '2026-04-05T11:00:00Z', votesCount: 0 },
            { id: 'o23', place: 'Finca El Refugio - Sopó', time: '2026-04-05T12:00:00Z', votesCount: 0 },
            { id: 'o24', place: 'Club campestre Norte', time: '2026-04-05T11:30:00Z', votesCount: 0 },
        ], state: 'DRAFT', winningOptionId: null, createdBy: 'u3', createdAt: '2026-03-13T07:00:00Z'
    },


    {
        id: 'pl9', parcheId: 'p2', title: 'Visita al Museo de Arte Moderno', description: 'Recorrido por la nueva exposición del MAMBO', dateWindow: { start: '2026-03-22T10:00:00Z', end: '2026-03-22T14:00:00Z' }, options: [
            { id: 'o25', place: 'MAMBO - Entrada principal', time: '2026-03-22T10:00:00Z', votesCount: 3 },
            { id: 'o26', place: 'MAMBO - Sala nueva', time: '2026-03-22T11:00:00Z', votesCount: 2 },
            { id: 'o27', place: 'Museo Nacional', time: '2026-03-22T10:30:00Z', votesCount: 1 },
        ], state: 'VOTING_OPEN', winningOptionId: null, createdBy: 'u2', createdAt: '2026-03-10T12:00:00Z'
    },

    {
        id: 'pl10', parcheId: 'p2', title: 'Taller de Acuarela', description: 'Clase práctica de acuarela en el parque', dateWindow: { start: '2026-03-24T09:00:00Z', end: '2026-03-24T12:00:00Z' }, options: [
            { id: 'o28', place: 'Parque El Virrey', time: '2026-03-24T09:00:00Z', votesCount: 4 },
            { id: 'o29', place: 'Parque de la 93', time: '2026-03-24T10:00:00Z', votesCount: 1 },
            { id: 'o30', place: 'Jardín Botánico', time: '2026-03-24T09:30:00Z', votesCount: 2 },
        ], state: 'SCHEDULED', winningOptionId: 'o28', createdBy: 'u7', createdAt: '2026-03-05T16:00:00Z'
    },

    {
        id: 'pl11', parcheId: 'p2', title: 'Noche de Board Games 🎲', description: 'Juegos de mesa en la casa de Camila', dateWindow: { start: '2026-03-26T18:00:00Z', end: '2026-03-26T23:00:00Z' }, options: [
            { id: 'o31', place: 'Casa de Camila - Chapinero', time: '2026-03-26T18:00:00Z', votesCount: 2 },
            { id: 'o32', place: 'Draco Tienda de Juegos', time: '2026-03-26T19:00:00Z', votesCount: 3 },
            { id: 'o33', place: 'Café Lúdico Usaquén', time: '2026-03-26T18:30:00Z', votesCount: 1 },
        ], state: 'VOTING_CLOSED', winningOptionId: 'o32', createdBy: 'u8', createdAt: '2026-03-12T14:00:00Z'
    },

    {
        id: 'pl12', parcheId: 'p2', title: 'Sesión de Fotos Urbanas 📸', description: 'Excursión fotográfica por La Candelaria', dateWindow: { start: '2026-03-27T08:00:00Z', end: '2026-03-27T12:00:00Z' }, options: [
            { id: 'o34', place: 'Plaza de Bolívar', time: '2026-03-27T08:00:00Z', votesCount: 0 },
            { id: 'o35', place: 'Chorro de Quevedo', time: '2026-03-27T09:00:00Z', votesCount: 0 },
            { id: 'o36', place: 'Calle del Embudo', time: '2026-03-27T08:30:00Z', votesCount: 0 },
        ], state: 'DRAFT', winningOptionId: null, createdBy: 'u10', createdAt: '2026-03-13T06:00:00Z'
    },

    {
        id: 'pl13', parcheId: 'p2', title: 'Picnic en el Simón Bolívar', description: 'Picnic dominical con música y juegos', dateWindow: { start: '2026-03-30T10:00:00Z', end: '2026-03-30T16:00:00Z' }, options: [
            { id: 'o37', place: 'Lago del parque', time: '2026-03-30T10:00:00Z', votesCount: 2 },
            { id: 'o38', place: 'Zona de BBQ', time: '2026-03-30T11:00:00Z', votesCount: 2 },
            { id: 'o39', place: 'Explanada norte', time: '2026-03-30T10:30:00Z', votesCount: 1 },
        ], state: 'VOTING_OPEN', winningOptionId: null, createdBy: 'u2', createdAt: '2026-03-12T10:00:00Z'
    },

    {
        id: 'pl14', parcheId: 'p2', title: 'Concierto de Jazz en vivo', description: 'Jazz en el Quiebra Canto, confirmen!', dateWindow: { start: '2026-04-02T20:00:00Z', end: '2026-04-03T00:00:00Z' }, options: [
            { id: 'o40', place: 'Quiebra Canto', time: '2026-04-02T20:00:00Z', votesCount: 3 },
            { id: 'o41', place: 'Matik-Matik', time: '2026-04-02T21:00:00Z', votesCount: 1 },
            { id: 'o42', place: 'Gaira Café', time: '2026-04-02T20:30:00Z', votesCount: 2 },
        ], state: 'VOTING_CLOSED', winningOptionId: 'o40', createdBy: 'u7', createdAt: '2026-03-08T18:00:00Z'
    },

    {
        id: 'pl15', parcheId: 'p2', title: 'Feria del Libro 📚', description: 'Visita grupal a la FILBo el primer día', dateWindow: { start: '2026-04-17T09:00:00Z', end: '2026-04-17T17:00:00Z' }, options: [
            { id: 'o43', place: 'Corferias - Entrada Norte', time: '2026-04-17T09:00:00Z', votesCount: 5 },
            { id: 'o44', place: 'Corferias - Entrada Sur', time: '2026-04-17T10:00:00Z', votesCount: 1 },
            { id: 'o45', place: 'Corferias - Hall principal', time: '2026-04-17T09:30:00Z', votesCount: 1 },
        ], state: 'SCHEDULED', winningOptionId: 'o43', createdBy: 'u2', createdAt: '2026-03-01T08:00:00Z'
    },
];


export const seedVotes: Vote[] = [

    { id: 'v1', planId: 'pl1', userId: 'u1', optionId: 'o1' },
    { id: 'v2', planId: 'pl1', userId: 'u2', optionId: 'o1' },
    { id: 'v3', planId: 'pl1', userId: 'u3', optionId: 'o2' },
    { id: 'v4', planId: 'pl1', userId: 'u4', optionId: 'o1' },
    { id: 'v5', planId: 'pl1', userId: 'u5', optionId: 'o2' },
    { id: 'v6', planId: 'pl1', userId: 'u6', optionId: 'o3' },

    { id: 'v7', planId: 'pl2', userId: 'u1', optionId: 'o4' },
    { id: 'v8', planId: 'pl2', userId: 'u2', optionId: 'o4' },
    { id: 'v9', planId: 'pl2', userId: 'u3', optionId: 'o6' },
    { id: 'v10', planId: 'pl2', userId: 'u4', optionId: 'o4' },
    { id: 'v11', planId: 'pl2', userId: 'u5', optionId: 'o5' },
    { id: 'v12', planId: 'pl2', userId: 'u6', optionId: 'o6' },
    { id: 'v13', planId: 'pl2', userId: 'u9', optionId: 'o4' },

    { id: 'v14', planId: 'pl4', userId: 'u1', optionId: 'o10' },
    { id: 'v15', planId: 'pl4', userId: 'u2', optionId: 'o11' },
    { id: 'v16', planId: 'pl4', userId: 'u3', optionId: 'o10' },
    { id: 'v17', planId: 'pl4', userId: 'u4', optionId: 'o11' },
    { id: 'v18', planId: 'pl4', userId: 'u5', optionId: 'o10' },
    { id: 'v19', planId: 'pl4', userId: 'u6', optionId: 'o11' },
    { id: 'v20', planId: 'pl4', userId: 'u9', optionId: 'o12' },

    { id: 'v21', planId: 'pl9', userId: 'u2', optionId: 'o25' },
    { id: 'v22', planId: 'pl9', userId: 'u7', optionId: 'o25' },
    { id: 'v23', planId: 'pl9', userId: 'u8', optionId: 'o26' },
    { id: 'v24', planId: 'pl9', userId: 'u10', optionId: 'o25' },
    { id: 'v25', planId: 'pl9', userId: 'u1', optionId: 'o26' },
    { id: 'v26', planId: 'pl9', userId: 'u3', optionId: 'o27' },

    { id: 'v27', planId: 'pl13', userId: 'u2', optionId: 'o37' },
    { id: 'v28', planId: 'pl13', userId: 'u5', optionId: 'o38' },
    { id: 'v29', planId: 'pl13', userId: 'u7', optionId: 'o37' },
    { id: 'v30', planId: 'pl13', userId: 'u10', optionId: 'o38' },
];

export const seedAttendances: Attendance[] = [

    { id: 'a1', planId: 'pl5', userId: 'u1', status: 'YES', checkedIn: true },
    { id: 'a2', planId: 'pl5', userId: 'u2', status: 'YES', checkedIn: true },
    { id: 'a3', planId: 'pl5', userId: 'u3', status: 'YES', checkedIn: false },
    { id: 'a4', planId: 'pl5', userId: 'u4', status: 'NO', checkedIn: false },
    { id: 'a5', planId: 'pl5', userId: 'u5', status: 'MAYBE', checkedIn: false },
    { id: 'a6', planId: 'pl5', userId: 'u6', status: 'YES', checkedIn: true },
    { id: 'a7', planId: 'pl5', userId: 'u9', status: 'YES', checkedIn: false },

    { id: 'a8', planId: 'pl7', userId: 'u1', status: 'YES', checkedIn: true },
    { id: 'a9', planId: 'pl7', userId: 'u2', status: 'YES', checkedIn: true },
    { id: 'a10', planId: 'pl7', userId: 'u3', status: 'MAYBE', checkedIn: false },
    { id: 'a11', planId: 'pl7', userId: 'u4', status: 'YES', checkedIn: true },
    { id: 'a12', planId: 'pl7', userId: 'u5', status: 'YES', checkedIn: false },
    { id: 'a13', planId: 'pl7', userId: 'u6', status: 'NO', checkedIn: false },
    { id: 'a14', planId: 'pl7', userId: 'u9', status: 'YES', checkedIn: true },

    { id: 'a15', planId: 'pl10', userId: 'u2', status: 'YES', checkedIn: true },
    { id: 'a16', planId: 'pl10', userId: 'u7', status: 'YES', checkedIn: true },
    { id: 'a17', planId: 'pl10', userId: 'u8', status: 'YES', checkedIn: false },
    { id: 'a18', planId: 'pl10', userId: 'u10', status: 'YES', checkedIn: true },
    { id: 'a19', planId: 'pl10', userId: 'u1', status: 'MAYBE', checkedIn: false },
    { id: 'a20', planId: 'pl10', userId: 'u3', status: 'YES', checkedIn: false },
    { id: 'a21', planId: 'pl10', userId: 'u5', status: 'NO', checkedIn: false },

    { id: 'a22', planId: 'pl15', userId: 'u2', status: 'YES', checkedIn: true },
    { id: 'a23', planId: 'pl15', userId: 'u7', status: 'YES', checkedIn: false },
    { id: 'a24', planId: 'pl15', userId: 'u8', status: 'YES', checkedIn: true },
    { id: 'a25', planId: 'pl15', userId: 'u10', status: 'NO', checkedIn: false },
    { id: 'a26', planId: 'pl15', userId: 'u1', status: 'YES', checkedIn: true },
    { id: 'a27', planId: 'pl15', userId: 'u3', status: 'YES', checkedIn: true },
    { id: 'a28', planId: 'pl15', userId: 'u5', status: 'MAYBE', checkedIn: false },

    { id: 'a29', planId: 'pl2', userId: 'u1', status: 'YES', checkedIn: false },
    { id: 'a30', planId: 'pl2', userId: 'u2', status: 'YES', checkedIn: false },
    { id: 'a31', planId: 'pl2', userId: 'u3', status: 'MAYBE', checkedIn: false },
    { id: 'a32', planId: 'pl2', userId: 'u9', status: 'YES', checkedIn: false },

    { id: 'a33', planId: 'pl4', userId: 'u1', status: 'YES', checkedIn: false },
    { id: 'a34', planId: 'pl4', userId: 'u2', status: 'YES', checkedIn: false },
    { id: 'a35', planId: 'pl4', userId: 'u5', status: 'NO', checkedIn: false },

    { id: 'a36', planId: 'pl11', userId: 'u2', status: 'YES', checkedIn: false },
    { id: 'a37', planId: 'pl11', userId: 'u8', status: 'YES', checkedIn: false },
    { id: 'a38', planId: 'pl11', userId: 'u10', status: 'MAYBE', checkedIn: false },

    { id: 'a39', planId: 'pl14', userId: 'u2', status: 'YES', checkedIn: false },
    { id: 'a40', planId: 'pl14', userId: 'u7', status: 'YES', checkedIn: false },
];

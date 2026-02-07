import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Calendar,
    Clock,
    Sun,
    Utensils,
    Ticket,
    Users,
    RollerCoaster,
    Info,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Car,
    MessageSquare,
    Send,
    X,
    Bot,
    Map as MapIcon,
    Compass,
    Image as ImageIcon,
    Camera
} from 'lucide-react';
import heroImage from './assets/hero.png';
import anaheimHotelImg from './assets/anaheim_hotel.png';
import beachImg from './assets/beach.png';
import dcaImg from './assets/dca.png';
import laImg from './assets/la.png';
import { ATTRACTIONS_DATA } from './data/attractions';

// --- DATA & CONFIGURATION ---

const FAMILY_MEMBERS = [
    { name: 'Alberto', age: 36, role: 'Adulto' },
    { name: 'Yeimi', age: 34, role: 'Adulto' },
    { name: 'Wendy', age: 41, role: 'Adulto' },
    { name: 'Sergio', age: 41, role: 'Adulto' },
    { name: 'Santiago', age: 14, role: 'Adolescente', height: '>140cm' },
    { name: 'Eber', age: 9, role: 'Niño', height: '~135cm' },
    { name: 'Paula', age: 7, role: 'Niña', height: '~125cm' },
];

// URLs de imágenes premium (Unsplash & Local Assets)
const ITINERARY_DATA = [
    {
        id: 1,
        date: 'Miércoles 5 Ago',
        title: 'Llegada: Ruta desde Tijuana',
        location: 'Clarion Hotel Anaheim Resort',
        type: 'Logística',
        image: anaheimHotelImg,
        description: 'Viaje desde el Aeropuerto de Tijuana hasta nuestra base de operaciones en Anaheim. ¡Comienza la aventura!',
        highlights: [],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=640', caption: 'Llegada al Hotel' },
            { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=640', caption: 'Área de Piscina' },
            { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=640', caption: 'Habitación Familiar' }
        ],
        tips: ['Check-in es a las 4:00 PM', 'El trayecto desde TIJ puede tomar 2-3 horas dependiendo de la frontera/tráfico'],
        mapOrigin: 'Aeropuerto Internacional de Tijuana',
        destinationQuery: 'Clarion Hotel Anaheim Resort'
    },
    {
        id: 2,
        date: 'Jueves 6 Ago',
        title: 'Disneyland Park',
        location: 'Disneyland Resort',
        type: 'Parque Temático',
        image: 'https://images.unsplash.com/photo-1603190285605-e6ade52d854b?auto=format&fit=crop&q=80&w=1024',
        description: 'El clásico original. Star Wars: Galaxy\'s Edge y Fantasyland.',
        highlights: [
            { name: 'Rise of the Resistance', wait: '60-90 min', category: 'Familiar/Intenso', restriction: '102cm+' },
            { name: 'Mickey & Minnie Runaway Railway', wait: '45 min', category: 'Familiar', restriction: 'Sin restricción' },
            { name: 'Space Mountain', wait: '50 min', category: 'Adolescentes/Adultos', restriction: '102cm+' },
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1518173946687-a4c8a9b4393e?auto=format&fit=crop&q=80&w=640', caption: 'Castillo de Noche' },
            { url: 'https://images.unsplash.com/photo-1594132176008-0cc25dbb134d?auto=format&fit=crop&q=80&w=640', caption: 'Mickey Mouse' },
            { url: 'https://images.unsplash.com/photo-1597003058860-244f77659424?auto=format&fit=crop&q=80&w=640', caption: 'Show Fantasmic!' }
        ],
        show: 'Fantasmic! (9:00 PM) - Rivers of America',
        tips: ['Usar Genie+ para Space Mountain a primera hora', 'Mobile Order para comer sin filas en Docking Bay 7'],
        destinationQuery: 'Disneyland Park Entry'
    },
    {
        id: 3,
        date: 'Viernes 7 Ago',
        title: 'Disney California Adventure',
        location: 'Disneyland Resort',
        type: 'Parque Temático',
        image: dcaImg,
        description: 'Pixar Pier, Avengers Campus y Cars Land.',
        highlights: [
            { name: 'Radiator Springs Racers', wait: '70 min', category: 'Familiar', restriction: '102cm+' },
            { name: 'Guardians of the Galaxy', wait: '55 min', category: 'Intenso', restriction: '102cm+' },
            { name: 'Incredicoaster', wait: '45 min', category: 'Adolescentes', restriction: '122cm+ (Ojo Paula)' },
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1593113591227-ca177114660e?auto=format&fit=crop&q=80&w=640', caption: 'Pixar Pier' },
            { url: 'https://images.unsplash.com/photo-1621506289937-4c746ade9998?auto=format&fit=crop&q=80&w=640', caption: 'Avengers Campus' },
            { url: 'https://images.unsplash.com/photo-1594738423126-6248d706798e?auto=format&fit=crop&q=80&w=640', caption: 'Cars Land' }
        ],
        show: 'World of Color - ONE (9:15 PM)',
        tips: ['Web Slingers es divertido para los niños', 'Mejores tacos en Cocina Cucamonga'],
        destinationQuery: 'Disney California Adventure Park'
    },
    {
        id: 4,
        date: 'Sábado 8 Ago',
        title: 'Día Libre: Costa de California',
        location: 'Orange County Beaches',
        type: 'Relax',
        image: beachImg,
        description: 'Día para relajarse del ajetreo de los parques. Elige tu aventura costera.',
        options: [
            {
                name: 'Opción A: Huntington Beach',
                desc: 'Ambiente surfero, fogatas en la arena y el muelle icónico.',
                pros: 'Cerca del hotel (30 min), muy relajado.',
                dest: 'Huntington Beach Pier'
            },
            {
                name: 'Opción B: Newport Beach',
                desc: 'Más exclusivo, avistamiento de ballenas desde Balboa Pier.',
                pros: 'Vistas increíbles, paseo en barco.',
                dest: 'Newport Beach Pier'
            }
        ],
        highlights: [],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=640', caption: 'Playa Huntington' },
            { url: 'https://images.unsplash.com/photo-1502481851512-e9e25296996e?auto=format&fit=crop&q=80&w=640', caption: 'Atardecer' },
            { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=640', caption: 'Surfing Vibe' }
        ],
        show: 'Atardecer en el Pacífico',
        tips: ['Llevar bloqueador y toallas del hotel', 'Ruby’s Diner es un clásico para hamburguesas en el muelle'],
        destinationQuery: 'Huntington Beach Pier'
    },
    {
        id: 5,
        date: 'Domingo 9 Ago',
        title: 'Día Libre: LA Experience',
        location: 'Los Angeles Area',
        type: 'Turismo',
        image: laImg,
        description: 'Explora la ciudad de las estrellas. El tráfico es menor los domingos.',
        options: [
            {
                name: 'Opción A: Griffith Observatory',
                desc: 'Vistas al cartel de Hollywood y planetario.',
                pros: 'Educativo para los niños, fotos icónicas.',
                dest: 'Griffith Observatory'
            },
            {
                name: 'Opción B: Santa Monica Pier',
                desc: 'El final de la Ruta 66 y feria en el muelle.',
                pros: 'Muy turístico, mucha energía.',
                dest: 'Santa Monica Pier'
            }
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=640', caption: 'Cartel Hollywood' },
            { url: 'https://images.unsplash.com/photo-1544013587-41ec220fc79d?auto=format&fit=crop&q=80&w=640', caption: 'Muelle Santa Monica' },
            { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=640', caption: 'Skyline de LA' }
        ],
        highlights: [],
        show: 'Luces de la ciudad al anochecer',
        tips: ['Si van al Observatorio, lleguen antes de las 10am', 'Santa Monica tiene mucho tráfico'],
        destinationQuery: 'Griffith Observatory'
    },
    {
        id: 6,
        date: 'Lunes 10 Ago',
        title: 'Universal Studios (Día 1)',
        location: 'Universal Studios Hollywood',
        type: 'Parque Temático',
        image: 'https://images.unsplash.com/photo-1594738423126-6248d706798e?auto=format&fit=crop&q=80&w=1024',
        description: 'Super Nintendo World y el Mundo Mágico de Harry Potter.',
        highlights: [
            { name: 'Mario Kart: Bowser’s Challenge', wait: '80 min', category: 'Familiar', restriction: '107cm+' },
            { name: 'Harry Potter Forbidden Journey', wait: '45 min', category: 'Intenso', restriction: '122cm+' },
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1621506289937-4c746ade9998?auto=format&fit=crop&q=80&w=640', caption: 'Entrada Universal' },
            { url: 'https://images.unsplash.com/photo-1589111822396-1934968848db?auto=format&fit=crop&q=80&w=640', caption: 'Mario World' }
        ],
        show: 'WaterWorld (¡Imperdible!)',
        tips: ['Comprar la Power-Up Band', 'Probar la Cerveza de Mantequilla'],
        destinationQuery: 'Universal Studios Hollywood'
    },
    {
        id: 7,
        date: 'Martes 11 Ago',
        title: 'Universal Studios (Día 2)',
        location: 'Universal Studios Hollywood',
        type: 'Parque Temático',
        image: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&q=80&w=1024',
        description: 'Segundo día y Studio Tour.',
        highlights: [
            { name: 'Studio Tour', wait: '60 min', category: 'Familiar', restriction: 'N/A' },
            { name: 'Jurassic World - The Ride', wait: '45 min', category: 'Intenso/Agua', restriction: '107cm+' },
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc58e?auto=format&fit=crop&q=80&w=640', caption: 'Studio Tour' }
        ],
        show: 'Encuentro con Raptors',
        tips: ['Si se mojan en Jurassic, usen secadores', 'Compras en CityWalk'],
        destinationQuery: 'Universal Studios Hollywood'
    },
    {
        id: 8,
        date: 'Miércoles 12 Ago',
        title: 'Regreso a Casa',
        location: 'Aeropuerto',
        type: 'Logística',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f?auto=format&fit=crop&q=80&w=1024',
        description: 'Check-out del hotel y traslado al aeropuerto.',
        highlights: [],
        tips: ['Revisar peso de maletas', 'Salir con 4 horas de antelación'],
        destinationQuery: 'Los Angeles International Airport'
    }
];

// --- HELPER PARA LA IA (SIMULADA) ---

const searchKnowledgeBase = (query) => {
    const q = query.toLowerCase();
    let responses = [];

    // Height check
    if (q.includes('altura') || q.includes('estatura') || q.includes('mide') || q.includes('niños') || q.includes('pueden subir')) {
        const kids = FAMILY_MEMBERS.filter(m => m.age < 18);
        responses.push(`Sobre las alturas: Santiago mide >140cm (entra a todo), Eber ~135cm y Paula ~120cm. Ojo con Paula en atracciones de 122cm como Incredicoaster o Harry Potter (Forbidden Journey).`);
    }

    // Search in Attractions Data
    let attractionFound = null;
    Object.values(ATTRACTIONS_DATA).flat().forEach(attr => {
        if (q.includes(attr.name.toLowerCase())) {
            attractionFound = attr;
        }
    });

    if (attractionFound) {
        responses.push(`Atracción ${attractionFound.name}: Altura ${attractionFound.height}, espera aprox ${attractionFound.wait}, pase VIP: ${attractionFound.vip}. ${attractionFound.desc}`);
    }

    // Itinerary search
    const placeMatch = ITINERARY_DATA.find(day =>
        q.includes(day.title.toLowerCase()) ||
        q.includes(day.location.toLowerCase()) ||
        (q.includes('disney') && day.title.includes('Disneyland')) ||
        (q.includes('universal') && day.title.includes('Universal'))
    );

    if (placeMatch) {
        responses.push(`Para ${placeMatch.title}: Es el ${placeMatch.date}. Highlights: ${placeMatch.highlights.map(h => h.name).join(', ')}. Tip clave: ${placeMatch.tips[0]}.`);
    }

    if (q.includes('sabado') || q.includes('sábado') || q.includes('playa') || q.includes('libre')) {
        responses.push("Para el Sábado 8 (Día Libre): Tienen opciones como Huntington Beach (cerca y relax), Newport Beach (barcos) o Laguna Beach (arte y paisaje). Recomiendo Huntington para una tarde tranquila con fogata.");
    }

    if (q.includes('domingo') || q.includes('hollywood') || q.includes('santa monica')) {
        responses.push("Para el Domingo 9 (Día Libre): Pueden ir al Observatorio Griffith (vistas), Santa Monica Pier (feria y playa) o de compras a Citadel Outlets.");
    }

    if (responses.length === 0) {
        return "No encontré ese dato exacto, pero puedes preguntarme por una atracción específica (ej: Space Mountain), sobre las alturas de los niños, o qué hacer un día específico.";
    }

    return responses.join('\n\n');
};

// --- COMPONENTS ---

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date('2026-08-05T00:00:00');

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-wrap gap-4 text-white justify-center py-6">
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 font-sans tabular-nums">{timeLeft.days}</div>
                <div className="text-[10px] uppercase tracking-widest text-blue-200">Días</div>
            </div>
            <div className="text-2xl md:text-4xl font-light text-amber-400 self-start mt-1">:</div>
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 font-sans tabular-nums">{timeLeft.hours}</div>
                <div className="text-[10px] uppercase tracking-widest text-blue-200">Horas</div>
            </div>
            <div className="text-2xl md:text-4xl font-light text-amber-400 self-start mt-1">:</div>
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 font-sans tabular-nums">{timeLeft.minutes}</div>
                <div className="text-[10px] uppercase tracking-widest text-blue-200">Min</div>
            </div>
            <div className="text-2xl md:text-4xl font-light text-amber-400 self-start mt-1">:</div>
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 font-sans tabular-nums">{timeLeft.seconds}</div>
                <div className="text-[10px] uppercase tracking-widest text-blue-200">Seg</div>
            </div>
        </div>
    );
};

const VideoModal = ({ youtubeId, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Experiencia Virtual</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <a
                        href={`https://www.youtube.com/watch?v=${youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-xl"
                    >
                        ¿No carga? Ver directamente en YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};

const TripAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "¡Hola familia Martínez! Soy su asistente de viaje. Pregúntenme sobre horarios, alturas para los niños o tips de comida.", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            const answer = searchKnowledgeBase(userMsg.text);
            setMessages(prev => [...prev, { text: answer, sender: 'bot' }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className={`pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 transition-all duration-300 origin-bottom-right overflow-hidden flex flex-col ${isOpen ? 'opacity-100 scale-100 h-[500px]' : 'opacity-0 scale-90 h-0'}`}>
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center text-white">
                        <Bot className="w-5 h-5 mr-2" />
                        <div>
                            <h3 className="font-bold text-sm">Asistente de Viaje</h3>
                            <p className="text-[10px] text-amber-100 opacity-80">Contexto: Itinerario 2026</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50 scrollbar-thin scrollbar-thumb-slate-700">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-white/10 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500/50 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!input.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto bg-amber-500 hover:bg-amber-400 text-white p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-110 group ${isOpen ? 'rotate-90 opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
            >
                <MessageSquare className="w-6 h-6 fill-current" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">1</span>
            </button>
        </div>
    );
};

const AttractionCard = ({ attraction, onPlayVideo }) => {
    const checkHeight = (reqStr) => {
        if (!reqStr || reqStr.toLowerCase().includes('ninguno') || reqStr.toLowerCase().includes('no')) return { status: 'ok', msg: 'Todos entran' };
        const match = reqStr.match(/(\d+)/);
        if (!match) return { status: 'unknown', msg: '' };
        const h = parseInt(match[0]);
        if (h > 135) return { status: 'warning', msg: 'Solo Santiago y Adultos' };
        if (h > 122) return { status: 'warning', msg: 'Eber entra, Paula NO' };
        if (h > 120) return { status: 'warning', msg: 'Eber entra, Paula al límite' };
        return { status: 'ok', msg: 'Todos entran' };
    };

    const heightCheck = checkHeight(attraction.height);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group flex flex-col h-full card-hover">
            {/* Visual Header */}
            <div className="h-44 bg-slate-800 relative flex items-center justify-center overflow-hidden shrink-0">
                <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>

                {attraction.youtubeId && (
                    <button
                        onClick={() => onPlayVideo(attraction.youtubeId)}
                        className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                    >
                        <div className="bg-red-600 p-3 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="absolute bottom-12 text-white font-bold text-sm tracking-wide bg-black/60 px-3 py-1 rounded-full border border-white/10">Ver Experiencia</span>
                    </button>
                )}

                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-white font-bold uppercase tracking-wider z-20 border border-white/10">
                    {attraction.type}
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col glass">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white leading-tight font-premium">{attraction.name}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center ${attraction.wait.includes('60') || attraction.wait.includes('90') || attraction.wait.includes('100') || attraction.wait.includes('120')
                        ? 'bg-red-500/20 text-red-300 border border-red-500/20'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                        }`}>
                        <Clock className="w-3 h-3 mr-1" /> {attraction.wait}
                    </span>
                    <span className="text-[10px] text-blue-300 flex items-center font-medium">
                        <MapPin className="w-3 h-3 mr-1" /> {attraction.area}
                    </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {attraction.desc}
                </p>

                <div className="space-y-2 text-[11px] border-t border-white/10 pt-3 mt-auto">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Altura:</span>
                        <div className="text-right">
                            <span className={`font-bold block ${heightCheck.status === 'warning' ? 'text-orange-400' : 'text-slate-200'}`}>
                                {attraction.height}
                            </span>
                            {heightCheck.status === 'warning' && (
                                <span className="text-[9px] text-orange-300/80 font-medium block">
                                    ⚠️ {heightCheck.msg}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Pase VIP:</span>
                        <span className="text-purple-300 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">{attraction.vip}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AttractionsView = () => {
    const [activePark, setActivePark] = useState("Disneyland Park");
    const [viewMode, setViewMode] = useState("grid"); // grid or summary
    const [activeVideo, setActiveVideo] = useState(null);
    const parks = Object.keys(ATTRACTIONS_DATA);

    // Filter height warnings for children
    const getFamilySummary = () => {
        const summary = {
            'Paula': [],
            'Eber': []
        };
        Object.keys(ATTRACTIONS_DATA).forEach(park => {
            ATTRACTIONS_DATA[park].forEach(attr => {
                const reqStr = attr.height;
                const match = reqStr.match(/(\d+)/);
                if (match) {
                    const h = parseInt(match[0]);
                    if (h > 120) summary.Paula.push(`${attr.name} (${park})`);
                    if (h > 135) summary.Eber.push(`${attr.name} (${park})`);
                }
            });
        });
        return summary;
    };

    const familySummary = getFamilySummary();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeVideo && <VideoModal youtubeId={activeVideo} onClose={() => setActiveVideo(null)} />}

            <div className="text-center mb-8 relative px-4">
                <div className="absolute top-0 right-4 hidden md:flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title="Vista en Cuadrícula"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('summary')}
                        className={`p-2 rounded-lg border transition-all ${viewMode === 'summary' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title="Vista de Resumen (Infografía)"
                    >
                        <Bot className="w-4 h-4" />
                    </button>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 font-premium">Plan de Combate</h2>
                <p className="text-blue-200 text-sm max-w-xl mx-auto">Tiempos, pases VIP y restricciones analizados de la guía oficial para maximizar el día.</p>
            </div>

            {viewMode === 'summary' ? (
                <div className="glass-dark rounded-3xl p-8 border border-amber-500/20 mb-10 overflow-hidden relative mx-4">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                    <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center">
                        <Users className="w-6 h-6 mr-3" /> Resumen de Restricciones para Niños
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center font-premium">
                                <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3 text-sm">P</span>
                                Paula (120cm) - Ojo aquí:
                            </h3>
                            <ul className="space-y-2">
                                {familySummary.Paula.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start">
                                        <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center font-premium">
                                <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3 text-sm">E</span>
                                Eber (135cm) - Ojo aquí:
                            </h3>
                            <ul className="space-y-2">
                                {familySummary.Eber.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start">
                                        <X className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Park Tabs */}
            <div className="flex justify-center mb-8 sticky top-20 z-40 bg-slate-900/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/5 mx-auto max-w-fit">
                <div className="inline-flex gap-2">
                    {parks.map(park => (
                        <button
                            key={park}
                            onClick={() => setActivePark(park)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activePark === park
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {park}
                        </button>
                    ))}
                </div>
            </div>

            {/* Final Cheat Sheet Call to Action */}
            <div className="mt-12 text-center p-8 glass rounded-3xl border-amber-500/10 mx-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h4 className="text-2xl font-bold text-white mb-4 font-premium">✨ Preparados para la Acción</h4>
                <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">Esta pestaña de "Atracciones" está diseñada para ser tu guía visual rápida. Toma una captura de pantalla del "Resumen de Restricciones" para tenerlo siempre a mano en el parque.</p>
                <div className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-400">
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Espera Corta (Baja)</span>
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> Espera Larga (Priorizar VIP)</span>
                    <span className="flex items-center text-purple-300 underline font-medium cursor-help">Tip: Aprovecha el Single Rider para ahorrar ~60% de tiempo.</span>
                </div>
            </div>

            {/* Attractions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {ATTRACTIONS_DATA[activePark].map((attr, idx) => (
                    <AttractionCard
                        key={idx}
                        attraction={attr}
                        onPlayVideo={(id) => setActiveVideo(id)}
                    />
                ))}
            </div>

            <div className="mt-12 text-center p-6 glass rounded-2xl border-white/5 mx-4">
                <h4 className="text-white font-bold mb-2 font-premium">¿Cómo leer los tiempos?</h4>
                <div className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-400">
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Corto (0-40 min)</span>
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Largo (60 min+)</span>
                    <span className="flex items-center text-purple-300 underline font-medium">Tip: El pase VIP ahorra ~3 horas en un día full.</span>
                </div>
            </div>
        </div>
    );
};

const ItineraryCard = ({ day }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [activeDestination, setActiveDestination] = useState(day.destinationQuery);

    // Lógica para determinar el origen del mapa:
    const origin = day.mapOrigin || "Clarion Hotel Anaheim Resort";

    const mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(activeDestination)}&output=embed`;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/15 mb-6">

            {/* Card Header Image */}
            <div className="h-48 w-full overflow-hidden relative">
                <img
                    src={day.image}
                    alt={day.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        // Fallback a un color sólido si falla también Wikimedia
                        e.target.style.display = 'none';
                        e.target.parentNode.style.backgroundColor = '#1e293b';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-1">{day.date}</p>
                            <h3 className="text-2xl font-bold text-white leading-tight">{day.title}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${day.type === 'Parque Temático' ? 'bg-pink-500/80 text-white' :
                            day.type === 'Relax' ? 'bg-teal-500/80 text-white' :
                                'bg-blue-500/80 text-white'
                            }`}>
                            {day.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center text-blue-200 text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-amber-400" />
                        {day.location}
                    </div>
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className={`flex items-center text-xs font-medium transition-colors border rounded-full px-3 py-1 ${showMap
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'text-amber-400 hover:text-amber-300 border-amber-400/30 hover:bg-amber-400/10'
                            }`}
                    >
                        {showMap ? <X className="w-3 h-3 mr-1" /> : <MapIcon className="w-3 h-3 mr-1" />}
                        {showMap ? 'Cerrar Mapa' : 'Ver Mapa Aquí'}
                    </button>
                </div>

                {/* MAP EMBED SECTION */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showMap ? 'max-h-[400px] mb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-800 p-1 rounded-lg border border-white/10 h-[300px]">
                        {/* Info de ruta específica */}
                        <div className="bg-blue-900/50 p-2 mb-1 rounded flex justify-between items-center text-[10px] text-blue-200">
                            <span><span className="font-bold text-amber-400">Origen:</span> {origin}</span>
                            <span>→</span>
                            <span><span className="font-bold text-amber-400">Destino:</span> {activeDestination}</span>
                        </div>
                        <iframe
                            title={`Mapa para ${day.title}`}
                            width="100%"
                            height="88%"
                            frameBorder="0"
                            style={{ border: 0, borderRadius: '0.5rem' }}
                            src={mapSrc}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                        <div className="text-center mt-1">
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(activeDestination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-300 hover:underline flex items-center justify-center gap-1"
                            >
                                Abrir en Google Maps App <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {day.description}
                </p>

                {/* Collapsible Content */}
                <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>

                    {/* --- NEW: IMAGE GALLERY SECTION --- */}
                    {day.gallery && day.gallery.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3 flex items-center font-premium">
                                <Camera className="w-4 h-4 mr-2" /> Galería de Momentos
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {day.gallery.map((img, idx) => (
                                    <div key={idx} className="relative group/img overflow-hidden rounded-lg aspect-video cursor-pointer border border-white/10 bg-slate-800">
                                        <img
                                            src={img.url}
                                            alt={img.caption}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none'; // Ocultar si falla
                                            }}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-1 px-2 translate-y-full group-hover/img:translate-y-0 transition-transform duration-300">
                                            <p className="text-[10px] text-white font-medium text-center truncate">{img.caption}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OPTIONS SECTION (FOR FREE DAYS) */}
                    {day.options && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3 flex items-center">
                                <Compass className="w-4 h-4 mr-2" /> Elige tu Aventura
                            </h4>
                            <div className="grid gap-2">
                                {day.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setActiveDestination(opt.dest); setShowMap(true); }}
                                        className={`text-left p-3 rounded-lg border transition-all ${activeDestination === opt.dest && showMap
                                            ? 'bg-amber-500/20 border-amber-500/50'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-white text-sm">{opt.name}</span>
                                            {activeDestination === opt.dest && showMap && <span className="text-[10px] bg-amber-500 text-white px-1.5 rounded">Mapa Activo</span>}
                                        </div>
                                        <p className="text-xs text-slate-300 mb-1">{opt.desc}</p>
                                        <p className="text-[10px] text-blue-200 italic">✨ {opt.pros}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {day.highlights && day.highlights.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2 flex items-center">
                                <RollerCoaster className="w-4 h-4 mr-2" /> Top Atracciones
                            </h4>
                            <div className="space-y-2">
                                {day.highlights.map((ride, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-lg p-3 flex justify-between items-center border border-white/5">
                                        <div>
                                            <div className="font-medium text-white text-sm">{ride.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 flex gap-2">
                                                <span>⏱ {ride.wait}</span>
                                                <span className={ride.restriction.includes('N/A') ? 'hidden' : 'text-amber-300'}>
                                                    📏 {ride.restriction}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300">{ride.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {day.show && (
                        <div className="mb-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-3 rounded-lg border border-purple-500/20">
                            <div className="flex items-center text-purple-200 text-sm font-semibold">
                                <Ticket className="w-4 h-4 mr-2" />
                                Show Imperdible
                            </div>
                            <div className="text-white mt-1 text-sm">{day.show}</div>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2 flex items-center">
                            <Info className="w-4 h-4 mr-2" /> Tips del día
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside marker:text-amber-400">
                            {day.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full mt-4 flex items-center justify-center py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                >
                    {isOpen ? (
                        <>Menos detalles <ChevronUp className="w-4 h-4 ml-1" /></>
                    ) : (
                        <>Ver detalles y tiempos <ChevronDown className="w-4 h-4 ml-1" /></>
                    )}
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
    const [activeTab, setActiveTab] = useState('itinerary');
    const [showHotelMap, setShowHotelMap] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 font-sans selection:bg-amber-500/30">

            {/* Assistant Widget */}
            <TripAssistant />

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Header */}
                <header className="pt-12 pb-8 text-center bg-slate-900/40 rounded-3xl mt-8 border border-white/5 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20 hover:opacity-30 transition-opacity duration-700">
                        <img
                            src={heroImage}
                            alt="Magic Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="relative z-10 p-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 glass">
                            Family Trip 2026
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold text-white mb-2 tracking-tighter font-premium">
                            California <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Dreams</span>
                        </h1>
                        <p className="text-blue-200 text-lg max-w-2xl mx-auto mt-4 font-light">
                            Un viaje inolvidable para 7. Disneyland, Hollywood y recuerdos para toda la vida.
                        </p>
                        <Countdown />
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8 sticky top-4 z-50">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-1 rounded-full flex shadow-2xl">
                        <button
                            onClick={() => setActiveTab('itinerary')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Itinerario
                        </button>
                        <button
                            onClick={() => setActiveTab('attractions')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'attractions' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Atracciones
                        </button>
                        <button
                            onClick={() => setActiveTab('team')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'team' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            El Equipo
                        </button>
                        <button
                            onClick={() => setActiveTab('tips')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'tips' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Tips
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="transition-all duration-500 min-h-[500px]">

                    {activeTab === 'itinerary' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-6">
                            <div className="md:col-span-2 mb-10 group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-amber-500/10 hover:bg-white/15">
                                {/* Header Image - Matching ItineraryCard Style */}
                                <div className="h-64 w-full overflow-hidden relative">
                                    <img
                                        src={anaheimHotelImg}
                                        alt="Clarion Hotel Anaheim Resort"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-8 right-8">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-amber-400 font-bold text-sm tracking-widest uppercase mb-1">Centro de Operaciones</p>
                                                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight font-premium">Clarion Hotel Anaheim Resort</h3>
                                            </div>
                                            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/80 text-white shadow-lg hidden sm:block">
                                                HOSPEDAJE PRINCIPAL
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                                        <div className="flex-1">
                                            <div className="flex items-center text-blue-200 text-sm mb-4">
                                                <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                                                616 West Convention Way, Anaheim, CA 92802
                                            </div>
                                            <p className="text-slate-300 leading-relaxed text-lg font-light italic">
                                                "Nuestra sede central estratégica. A solo pasos del centro de convenciones y a minutos de la magia de Disney. Un refugio para descansar, recargar energías y planear nuestra siguiente batalla en los parques."
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3 shrink-0">
                                            <button
                                                onClick={() => setShowHotelMap(!showHotelMap)}
                                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${showHotelMap
                                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                                    : 'text-amber-400 border border-amber-400/30 hover:bg-amber-400/10'
                                                    }`}
                                            >
                                                {showHotelMap ? <X className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                                                {showHotelMap ? 'Cerrar Mapa' : 'Ver Ubicación'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Map Embed Section */}
                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHotelMap ? 'max-h-[500px] mb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="bg-slate-800 p-1 rounded-2xl border border-white/10 h-[350px]">
                                            <iframe
                                                title="Mapa Hotel"
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                style={{ border: 0, borderRadius: '1rem' }}
                                                src="https://maps.google.com/maps?q=Clarion+Hotel+Anaheim+Resort&output=embed"
                                                allowFullScreen
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    </div>

                                    {/* Info Grid (Details Like a Premium Card) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                            <div className="flex items-center mb-2">
                                                <Calendar className="w-4 h-4 text-amber-400 mr-2" />
                                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Check-in</p>
                                            </div>
                                            <p className="text-white font-medium">5 Ago • 4:00 PM</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                            <div className="flex items-center mb-2">
                                                <Clock className="w-4 h-4 text-amber-400 mr-2" />
                                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Check-out</p>
                                            </div>
                                            <p className="text-white font-medium">12 Ago • 11:00 AM</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                            <div className="flex items-center mb-2">
                                                <Users className="w-4 h-4 text-amber-400 mr-2" />
                                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Huéspedes</p>
                                            </div>
                                            <p className="text-white font-medium">7 Personas</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                            <div className="flex items-center mb-2">
                                                <Utensils className="w-4 h-4 text-amber-400 mr-2" />
                                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Servicios</p>
                                            </div>
                                            <p className="text-white font-medium">Piscina + WiFi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {ITINERARY_DATA.map((day) => (
                                <ItineraryCard key={day.id} day={day} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'attractions' && (
                        <AttractionsView />
                    )}

                    {activeTab === 'team' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {FAMILY_MEMBERS.map((member, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                                        {member.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                    <div className="flex items-center text-slate-400 text-sm mt-1 mb-3">
                                        <span className="mr-3">{member.age} años</span>
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{member.role}</span>
                                    </div>
                                    {member.height && (
                                        <div className="mt-2 pt-3 border-t border-white/10">
                                            <p className="text-xs text-amber-400 font-medium">Altura ref: {member.height}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Verificar en entrada de juegos</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'tips' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
                                <div className="flex items-center mb-4 text-orange-200">
                                    <Sun className="w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold text-white">Clima en Agosto</h3>
                                </div>
                                <p className="text-slate-300 text-sm mb-3">Anaheim es caluroso en agosto. Espera máximas de 30°C y mínimas de 18°C.</p>
                                <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                                    <li>Llevar botellas de agua rellenables (hay fuentes gratis).</li>
                                    <li>Usar ropa ligera y zapatos muy cómodos.</li>
                                    <li>Un suéter ligero para la noche (refresca).</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
                                <div className="flex items-center mb-4 text-blue-200">
                                    <Utensils className="w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold text-white">Comidas Rápidas</h3>
                                </div>
                                <p className="text-slate-300 text-sm mb-3">Ahorra tiempo usando "Mobile Order" en la App de Disney.</p>
                                <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                                    <li>Disneyland: Bengal Barbecue (Brochetas).</li>
                                    <li>California Adventure: Corn Dog Castle.</li>
                                    <li>Desayuno: Comprar leche/cereal para el hotel.</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 md:col-span-2">
                                <div className="flex items-center mb-4 text-purple-200">
                                    <Clock className="w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold text-white">Estrategia Genie+ y Filas</h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Multi Pass (Antes Genie+)</h4>
                                        <p className="text-slate-300 text-sm">Reservar la primera atracción a las 7:00 AM desde el hotel. Priorizar: Space Mountain, Indiana Jones o Guardians.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Rider Switch</h4>
                                        <p className="text-slate-300 text-sm">Si Paula no sube a un juego fuerte, un adulto espera con ella y luego cambia con el otro adulto sin hacer fila de nuevo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-20 pt-8 border-t border-white/10 text-center text-slate-500 text-xs">
                    <p>© 2026 Trip Planning.</p>
                    <p className="mt-2">Diseñado con ❤️ para Paula, Eber, Santiago y los grandes.</p>
                </footer>
            </div>
        </div>
    );
};

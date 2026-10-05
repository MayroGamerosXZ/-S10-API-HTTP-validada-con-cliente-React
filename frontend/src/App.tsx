import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, PlayCircle, Loader2 } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

interface Anime {
  id: string;
  title: string;
  studio: string;
  episodes: number;
  status: 'Ongoing' | 'Completed';
  imageUrl?: string;
}

export default function App() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Anime>>({});
  const [formError, setFormError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // GET Colección
  const fetchAnimes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/animes');
      setAnimes(res.data);
    } catch (err) {
      setError('Error al cargar la colección de animes desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este anime de tu colección?')) return;
    try {
      await api.delete(`/animes/${id}`);
      // Actualización Reactiva tras éxito del servidor (204 No Content)
      setAnimes((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar (404)');
    }
  };

  const openModal = (anime?: Anime) => {
    if (anime) {
      setIsEditing(true);
      setFormData(anime);
    } else {
      setIsEditing(false);
      setFormData({ status: 'Ongoing', episodes: 12 });
    }
    setFormError('');
    setModalOpen(true);
  };

  // POST & PATCH
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      // Forzar que episodios sea número (el input a veces retorna string)
      const { id, ...payload } = { ...formData, episodes: Number(formData.episodes) };
      if (isEditing) {
        const res = await api.patch(`/animes/${id}`, payload);
        // Actualizamos UI usando la respuesta del servidor (200 OK)
        setAnimes((prev) => prev.map((a) => (a.id === res.data.id ? res.data : a)));
      } else {
        const res = await api.post('/animes', payload);
        // Actualizamos UI usando la respuesta del servidor (201 Created)
        setAnimes((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err: any) {
      // Representar estados de error (400 Bad Request, 409 Conflict)
      const msgs = err.response?.data?.message;
      if (Array.isArray(msgs)) {
        setFormError(msgs.join(' | '));
      } else {
        setFormError(msgs || 'Ocurrió un error inesperado con el servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      {/* Navbar tipo Streaming */}
      <nav className="fixed w-full z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-2xl tracking-tighter">
            <PlayCircle className="w-8 h-8" />
            <span>AnimeTracker</span>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Serie
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Descubre y gestiona tu <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Colección Definitiva
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mt-4">
            Mantén un registro de tus series de anime favoritas. Sincronizado en tiempo real con nuestra API HTTP validada.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : animes.length === 0 ? (
          <div className="text-center py-24 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            No hay animes en tu colección. ¡Agrega el primero!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {animes.map((anime) => (
              <div key={anime.id} className="group relative bg-gray-900 rounded-md overflow-hidden transition-transform hover:scale-105 hover:z-20 shadow-lg cursor-pointer">
                <div className="aspect-[2/3] bg-gray-800 relative">
                  {anime.imageUrl ? (
                    <img src={anime.imageUrl} alt={anime.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Sin Portada</div>
                  )}
                  
                  {/* Overlay gradiente oscuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                  
                  {/* Badges superiores */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between z-10">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${anime.status === 'Ongoing' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                      {anime.status}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white shadow">
                      {anime.episodes} EPS
                    </span>
                  </div>

                  {/* Acciones Hover */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button onClick={() => openModal(anime)} className="p-3 bg-white/10 hover:bg-white backdrop-blur text-white hover:text-black rounded-full transition-colors shadow-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(anime.id)} className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Información Inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-bold text-white text-base leading-tight drop-shadow-md">{anime.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 drop-shadow-md">{anime.studio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal / Formulario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Editar Serie' : 'Nueva Serie'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded font-medium">
                  {formError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Título de la serie</label>
                <input
                  autoFocus
                  required
                  type="text"
                  placeholder="Ej. Shingeki no Kyojin"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Estudio</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. MAPPA"
                    value={formData.studio || ''}
                    onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Episodios</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.episodes || ''}
                    onChange={(e) => setFormData({ ...formData, episodes: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Estado</label>
                <select
                  value={formData.status || 'Ongoing'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="Ongoing">En emisión</option>
                  <option value="Completed">Finalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Portada (URL opcional)</label>
                <input
                  type="text"
                  placeholder="https://... o /covers/..."
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded font-semibold text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  {isEditing ? 'Guardar Cambios' : 'Añadir a Colección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

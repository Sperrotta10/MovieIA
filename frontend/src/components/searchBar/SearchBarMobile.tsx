
interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: any[]) => void;
  setMenuOpen: (open: boolean) => void;
  navigate: (path: string) => void;
}

export function SearchBarMobile({ searchTerm, setSearchTerm, setSearchResults, setMenuOpen, navigate }: SearchBarProps) {
  return (
    <div className="mb-7 mt-6">
        <input
        type="text"
        placeholder="Buscar películas..."
        className="bg-zinc-800 rounded-md px-3 py-2 w-full text-sm text-white focus:outline-none"
        // Si quieres, puedes implementar funcionalidad similar en móvil aquí también
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        onKeyDown={(e) => {
            if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
            setSearchResults([]);
            setMenuOpen(false);
            }
        }}
        />
    </div>
  );
}

import type { CastMember, CrewMember } from "@/types/movie";

export function CastCrew({ credits }: { credits: { cast: CastMember[]; crew: CrewMember[] } | null }) {

    return(
        <div className="relative z-10 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-3 space-y-6">
            <h2 className="text-2xl font-semibold">Elenco Principal</h2>
            <div className="flex overflow-x-auto gap-4 py-2">
                {credits?.cast.slice(0, 15).map((actor) => (
                <div key={actor.cast_id} className="min-w-[120px] flex flex-col items-center text-center">
                    <img
                    src={
                        actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/120x180?text=No+Image'
                    }
                    alt={actor.name}
                    className="rounded-lg w-[120px] h-[180px] object-cover mb-2"
                    />
                    <span className="font-semibold">{actor.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{actor.character}</span>
                </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold mt-8">Equipo Técnico</h2>
            <div className="flex overflow-x-auto gap-4 py-2">
                {credits?.crew
                .filter((member) => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(member.job))
                .map((member) => (
                    <div key={member.credit_id} className="min-w-[120px] flex flex-col items-center text-center">
                    <img
                        src={
                        member.profile_path
                            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                            : 'https://via.placeholder.com/120x180?text=No+Image'
                        }
                        alt={member.name}
                        className="rounded-lg w-[120px] h-[180px] object-cover mb-2"
                    />
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{member.job}</span>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}
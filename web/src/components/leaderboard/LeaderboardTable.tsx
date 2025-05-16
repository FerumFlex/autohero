import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetHeroes } from "@/hooks";
import { getRaceByLabel } from "@/constants";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from 'react-router-dom';
import { useState } from "react";

export function LeaderboardTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: heroes } = useGetHeroes();

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-fantasy-primary">Top Players</h2>
        {/* <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search player or guild..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-fantasy-cosmic/20 border-fantasy-cosmic/30 text-fantasy-light"
          />
        </div> */}
      </div>

      <div className="rounded-md border border-fantasy-cosmic/30 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-fantasy-cosmic/40">
              <TableRow>
                <TableHead
                  className="w-16 cursor-pointer hover:text-fantasy-secondary transition-colors"
                >
                  <div className="flex items-center">
                    <span>Rank</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-fantasy-secondary transition-colors"
                >
                  <div className="flex items-center">
                    <span>Player</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-fantasy-secondary transition-colors"
                >
                  <div className="flex items-center">
                    <span>Level</span>
                  </div>
                </TableHead>
                <TableHead>Race</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroes?.list.map((player, index) => (
                <TableRow
                  key={player.address}
                  className="hover:bg-fantasy-cosmic/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    {index + 1 <= 3 ? (
                      <div className={`flex items-center justify-center h-6 w-6 rounded-full ${getRankColor(index + 1)}`}>
                        <Trophy size={14} />
                      </div>
                    ) : (
                      <>
                        {index + 1}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-fantasy-cosmic mr-2 flex items-center justify-center overflow-hidden">
                        {getRaceByLabel(player.hero_props.race)?.icon}
                      </div>
                      <span>{player.hero_props.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{parseInt(player.hero_props.level)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getClassColor(player.hero_props.race)}`}>
                      {player.hero_props.race}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={heroes?.totalPages || 1} onPageChange={handlePageChange} />
    </div>
  );
}

function SortIcon({ field, currentField, direction }: { field: string; currentField: string; direction: string }) {
  if (field !== currentField) {
    return <ChevronDown className="h-4 w-4 opacity-50 ml-1" />;
  }

  return direction === "asc"
    ? <ChevronUp className="h-4 w-4 text-fantasy-primary ml-1" />
    : <ChevronDown className="h-4 w-4 text-fantasy-primary ml-1" />;
}

// Utility functions for styling
function getRankColor(rank: number) {
  switch (rank) {
    case 1: return "bg-amber-500/20 text-amber-300";
    case 2: return "bg-gray-400/20 text-gray-300";
    case 3: return "bg-amber-700/20 text-amber-700";
    default: return "";
  }
}

function getClassColor(raceName: string) {
  const race = raceName.toLowerCase();
  switch (race) {
    case "human": return "bg-red-900/30 text-red-400";
    case "elf": return "bg-blue-900/30 text-blue-400";
    case "dwarf": return "bg-emerald-900/30 text-emerald-400";
    case "orc": return "bg-yellow-900/30 text-yellow-400";
    case "dragon": return "bg-green-900/30 text-green-400";
    default: return "bg-gray-800/30 text-gray-400";
  }
}

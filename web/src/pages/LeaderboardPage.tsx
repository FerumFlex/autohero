
import { Layout } from "../components/layout/Layout";
import { StatsOverview } from "../components/leaderboard/StatsOverview";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <Layout showSidebar={false}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-fantasy-primary">Leaderboard</h1>
        <p className="text-muted-foreground">
          Discover the most accomplished adventurers in the realm of SolaraStoryNexus
        </p>
      </div>

      {/* <StatsOverview /> */}
      <LeaderboardTable />
    </Layout>
  );
}

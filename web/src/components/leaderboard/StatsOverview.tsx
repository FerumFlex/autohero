
import { CrownIcon, Trophy, Target, BarChart4, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Adventurers" 
        value="12,847" 
        description="+14% from last month"
        icon={<Users className="h-4 w-4" />}
        trend="up"
      />
      <StatCard 
        title="Quests Completed" 
        value="156,290" 
        description="+7% this week"
        icon={<Target className="h-4 w-4" />}
        trend="up"
      />
      <StatCard 
        title="Achievements Unlocked" 
        value="24,356" 
        description="102 today"
        icon={<Trophy className="h-4 w-4" />}
        trend="neutral"
      />
      <StatCard 
        title="Total Tokens Earned" 
        value="1,324,892" 
        description="-3% from yesterday"
        icon={<BarChart4 className="h-4 w-4" />}
        trend="down"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-fantasy-cosmic/20 border-fantasy-cosmic/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-fantasy-cosmic/30 p-2 rounded-md">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${getTrendColor(trend)} flex items-center mt-1`}>
          {getTrendIcon(trend)}
          <span className="ml-1">{description}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function getTrendColor(trend: "up" | "down" | "neutral") {
  switch (trend) {
    case "up": return "text-emerald-400";
    case "down": return "text-red-400";
    default: return "text-muted-foreground";
  }
}

function getTrendIcon(trend: "up" | "down" | "neutral") {
  switch (trend) {
    case "up": return (
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 3L10 7L8.5 7L6 4.5L3.5 7L2 7L6 3Z" fill="currentColor" />
      </svg>
    );
    case "down": return (
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 9L2 5L3.5 5L6 7.5L8.5 5L10 5L6 9Z" fill="currentColor" />
      </svg>
    );
    default: return null;
  }
}

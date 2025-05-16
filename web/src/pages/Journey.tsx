import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, User, UserPlus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
const heroIcons = ['🧙', '🦹', '🧝', '⚔️', '🏰', '🐉'];

const JourneyPage = () => {
  const navigate = useNavigate();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Check if this might be a returning user (could be expanded with actual auth check)
  const hasExistingCharacter = localStorage.getItem('character') !== null;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % heroIcons.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateHero = () => {
    navigate('/create-character');
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen bg-fantasy-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-fantasy-primary mb-4">
              Welcome to <span className="bg-gradient-to-r from-fantasy-primary to-solana-secondary bg-clip-text text-transparent">AutoHeroRPG</span>
            </h1>
            <p className="text-xl text-fantasy-light max-w-2xl mx-auto">
              Begin your epic journey in a world of magic, quests, and adventure powered by AI
            </p>
          </div>

          {/* Call to Action Card */}
          <Card className="bg-fantasy-cosmic/30 border-fantasy-cosmic/30 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-3/5 space-y-4">
                  <h2 className="text-2xl font-bold text-fantasy-light">Create Your Hero</h2>
                  <p className="text-fantasy-light/80">
                    Every legend begins with a hero. Design your character, choose your race, and embark on adventures that will echo through the ages.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                      size="lg"
                      onClick={handleCreateHero}
                      className="bg-gradient-to-r from-fantasy-primary to-solana-primary hover:opacity-90 transition-opacity group"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create New Hero
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {hasExistingCharacter && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/storyline')}
                        className="border-fantasy-primary text-fantasy-primary hover:bg-fantasy-primary/10"
                      >
                        <User className="mr-2 h-5 w-5" />
                        Continue Journey
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-2/5">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-fantasy-cosmic to-fantasy-primary/40 flex items-center justify-center overflow-hidden border-2 border-fantasy-primary/30">
                    <span className="text-8xl transform transition-all duration-700 ease-in-out opacity-100">
                      {heroIcons[currentIconIndex]}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-fantasy-cosmic/20 border-fantasy-cosmic/30 hover:border-fantasy-primary/50 transition-colors"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-fantasy-cosmic/30 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-fantasy-light mb-2">{feature.title}</h3>
                  <p className="text-fantasy-light/70 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const features = [
  {
    title: "AI-Powered Adventures",
    description: "Experience dynamic storylines that adapt to your choices, creating a unique journey every time.",
    icon: <span className="text-2xl">🤖</span>
  },
  {
    title: "Earn Solara Tokens",
    description: "Complete quests and challenges to earn valuable tokens that can be used for rare items and abilities.",
    icon: <span className="text-2xl">💰</span>
  },
  {
    title: "Forge Your Legend",
    description: "Rise through the ranks, join guilds, and leave your mark on the world's leaderboards.",
    icon: <span className="text-2xl">✨</span>
  }
];

export default JourneyPage;


import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGetHeroesByOwner } from '@/hooks';
import { getRaceByLabel } from '@/constants';
import { HeroStoreContext } from '@/store/context';
import { delay } from '@/utils';


export function HeroSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { data: heroes, isLoading, error } = useGetHeroesByOwner(publicKey?.toBase58() || '');
  const heroStore = useContext(HeroStoreContext);

  const selectHero = (hero: any) => async () => {
    setIsSelecting(true);
    try {
      heroStore.setHeroAddress(hero.address);
      await heroStore.loadInfo();
      await delay(2_000);
      toast.success(`Selected hero: ${hero.hero_props.name}`);
      navigate('/storyline');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSelecting(false);
    }
  };

  const createNewHero = () => {
    navigate('/create-character');
  };

  return (
    <Card className="w-full bg-fantasy-cosmic/20 border-fantasy-cosmic/30">
      <CardHeader>
        <CardTitle className="text-2xl text-fantasy-light flex items-center gap-2">
          <User className="h-6 w-6 text-fantasy-primary" />
          Your Heroes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-fantasy-light/70">
            Loading...
          </div>
        ) : (
          <>
            {heroes.length > 0 ? (
              <div className="rounded-md border border-fantasy-cosmic/30 overflow-hidden">
                <Table>
                  <TableHeader className="bg-fantasy-cosmic/40">
                    <TableRow>
                      <TableHead className="text-fantasy-light">Address</TableHead>
                      <TableHead className="text-fantasy-light">Name</TableHead>
                      <TableHead className="text-fantasy-light">Race</TableHead>
                      <TableHead className="text-fantasy-light text-right">Level</TableHead>
                      <TableHead className="text-fantasy-light text-right">Last updated</TableHead>
                      <TableHead className="text-fantasy-light text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroes.map((hero) => (
                      <TableRow key={hero.address} className="hover:bg-fantasy-cosmic/30 border-b border-fantasy-cosmic/20">
                        <TableCell className="font-medium text-fantasy-light">{hero.address.slice(0, 4)}...{hero.address.slice(-4)}</TableCell>
                        <TableCell className="font-medium text-fantasy-light">{hero.hero_props.name}</TableCell>
                        <TableCell className="text-fantasy-light/80">{getRaceByLabel(hero.hero_props.race)?.icon} {hero.hero_props.race}</TableCell>
                        <TableCell className="text-right text-fantasy-primary font-bold">{parseInt(hero.hero_props.level)}</TableCell>
                        <TableCell className="text-right text-fantasy-light/70">
                          {new Date(hero.updated_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <>
                            {heroStore.heroAddress === hero.address ? (
                              <span className="text-fantasy-secondary">
                                {isSelecting ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    Loading...
                                  </div>
                                ) : (
                                  "Current Hero"
                                )}
                              </span>
                            ) : (
                              <Button
                                disabled={isSelecting}
                                onClick={selectHero(hero)}
                                variant="outline"
                                className="border-fantasy-primary text-fantasy-secondary"
                              >
                                Select
                              </Button>
                            )}
                          </>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-fantasy-light/70">
                No heroes found in this category.
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            onClick={createNewHero}
            className="bg-gradient-to-r from-fantasy-primary to-solana-primary hover:opacity-90 transition-opacity"
          >
            <User className="mr-2 h-5 w-5" />
            Create New Hero
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

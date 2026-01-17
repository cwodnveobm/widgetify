import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Crown, Award, Sparkles, Trophy, Gem, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface Donation {
  id: string;
  display_name: string;
  amount: number;
  badge_type: string;
  message: string | null;
  created_at: string;
}

const badgeConfig: Record<string, { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  gradient: string;
  textColor: string;
  minAmount: number;
}> = {
  legend: {
    icon: Crown,
    label: 'Legend',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    textColor: 'text-yellow-100',
    minAmount: 100
  },
  champion: {
    icon: Trophy,
    label: 'Champion',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    textColor: 'text-purple-100',
    minAmount: 50
  },
  hero: {
    icon: Shield,
    label: 'Hero',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    textColor: 'text-blue-100',
    minAmount: 25
  },
  star: {
    icon: Star,
    label: 'Star',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    textColor: 'text-pink-100',
    minAmount: 10
  },
  supporter: {
    icon: Heart,
    label: 'Supporter',
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    textColor: 'text-emerald-100',
    minAmount: 1
  }
};

const getBadgeType = (amount: number): string => {
  if (amount >= 100) return 'legend';
  if (amount >= 50) return 'champion';
  if (amount >= 25) return 'hero';
  if (amount >= 10) return 'star';
  return 'supporter';
};

const SupporterCard = ({ donation, index }: { donation: Donation; index: number }) => {
  const badge = badgeConfig[donation.badge_type] || badgeConfig.supporter;
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <div className={`h-2 bg-gradient-to-r ${badge.gradient}`} />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Badge Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-lg`}>
              <BadgeIcon className={`w-6 h-6 ${badge.textColor}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground truncate">
                  {donation.display_name}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={`bg-gradient-to-r ${badge.gradient} text-white border-0 text-xs`}
                >
                  {badge.label}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(donation.created_at), 'MMM d, yyyy')}
              </p>
              
              {donation.message && (
                <p className="text-sm text-foreground/80 mt-2 italic line-clamp-2">
                  "{donation.message}"
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SupportersWall = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, supporters: 0 });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('id, display_name, amount, badge_type, message, created_at')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const donationsWithBadges = (data || []).map(d => ({
          ...d,
          badge_type: getBadgeType(d.amount)
        }));

        setDonations(donationsWithBadges);
        setStats({
          total: donationsWithBadges.reduce((sum, d) => sum + d.amount, 0),
          supporters: donationsWithBadges.length
        });
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-3 h-3 text-yellow-900" />
                </motion.div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Our Amazing{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Supporters
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A heartfelt thank you to everyone who helps keep Widgetify free and growing. 
              Your support means the world to us! 💜
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stats.supporters}
                </div>
                <div className="text-sm text-muted-foreground">Supporters</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ${stats.total}
                </div>
                <div className="text-sm text-muted-foreground">Raised</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Badge Legend */}
      <section className="py-8 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {Object.entries(badgeConfig).reverse().map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.textColor}`} />
                  </div>
                  <span className="text-muted-foreground">
                    {config.label} <span className="text-xs">(${config.minAmount}+)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supporters Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : donations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation, index) => (
                <SupporterCard key={donation.id} donation={donation} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Gem className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Be the First Supporter!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your name could be the first on our wall of fame. 
                Every contribution helps us build better widgets for everyone.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join Our Community of Supporters
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every contribution, big or small, helps us maintain and improve Widgetify. 
              Get your name on the wall and earn an exclusive badge!
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupportersWall;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const ReferAFriend: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      className="button-touch" 
      variant="secondary"
      onClick={() => navigate('/referrals')}
    >
      <Share2 className="w-4 h-4 mr-2" />
      Refer & Earn
    </Button>
  );
};

export default ReferAFriend;

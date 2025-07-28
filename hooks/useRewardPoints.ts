import { useEffect, useState } from 'react';
import axios from 'axios';

interface RewardData {
  points: number;
  level: number;
}

export const useRewardPoints = (clerkId: string | null | undefined) => {
  const [reward, setReward] = useState<RewardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReward = async () => {
      if (!clerkId) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/reward/points?clerkId=${clerkId}`);
        setReward(res.data);
      } catch (err: any) {
        console.error('Error fetching reward:', err);
        setError('Failed to fetch reward');
      } finally {
        setLoading(false);
      }
    };

    fetchReward();
  }, [clerkId]);

  return { reward, loading, error };
};

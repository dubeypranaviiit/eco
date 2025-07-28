'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRewardPoints } from '@/hooks/useRewardPoints';
import { SparklesIcon, UserIcon } from 'lucide-react';
import { FaMedal } from 'react-icons/fa';
const RewardPointsCard = () => {
  const { user, isLoaded } = useUser();
  const clerkId = user?.id;

  const { reward, loading } = useRewardPoints(clerkId);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!reward || !reward.points) return;

    const end = reward.points;
    let current = 0;
    const duration = 1000; // animation duration in ms
    const stepTime = 30;
    const increment = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [reward]);

  if (!isLoaded || !user) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                <div className="flex justify-center items-center mb-4">
                  <FaMedal className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600">{count}</div>
                <p className="text-green-700 mt-2">Reward Points</p>
              </div>
  );
};

export default RewardPointsCard;

import {
  ConfigModelProvider,
  UIConfigField,
  UIConfigSections,
} from '@/lib/config/types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ModelSelect from '@/components/Settings/Sections/Models/ModelSelect';

const SetupConfig = ({
  configSections,
  setupState,
  setSetupState,
}: {
  configSections: UIConfigSections;
  setupState: number;
  setSetupState: (state: number) => void;
}) => {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      const res = await fetch('/api/config/setup-complete', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to complete setup');

      window.location.reload();
    } catch (error) {
      console.error('Error completing setup:', error);
      toast.error('Failed to complete setup');
      setIsFinishing(false);
    }
  };

  return (
    <div className="w-[95vw] md:w-[80vw] lg:w-[65vw] mx-auto px-2 sm:px-4 md:px-6 flex flex-col space-y-6">


      {setupState === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.1 },
          }}
          className="w-full h-[calc(95vh-80px)] bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-xl shadow-sm flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="flex flex-row justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-light-200 dark:border-dark-200">
              <div>
                <p className="text-xs sm:text-sm font-medium text-black dark:text-white">
                  Select models
                </p>
                <p className="text-[10px] sm:text-xs text-black/50 dark:text-white/50 mt-0.5">
                  Select models which you wish to use.
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <ModelSelect type="chat" />
              <ModelSelect type="embedding" />
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-row items-center justify-between pt-2">
        <a></a>

        {setupState === 3 && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5 },
            }}
            onClick={handleFinish}
            disabled={isFinishing}
            className="flex flex-row items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg bg-[#24A0ED] text-white hover:bg-[#1e8fd1] active:scale-95 transition-all duration-200 font-medium text-xs sm:text-sm disabled:bg-light-200 dark:disabled:bg-dark-200 disabled:text-black/40 dark:disabled:text-white/40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span>{isFinishing ? 'Finishing...' : 'Finish'}</span>
            <Check className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SetupConfig;

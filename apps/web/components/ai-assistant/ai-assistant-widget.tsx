'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@workspace/ui';
import AIChatInterface from './ai-chat-interface';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={handleToggle}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-2xl border-2 border-white/20 backdrop-blur-sm"
              size="sm"
            >
              <div className="relative">
                <MessageSquare className="h-6 w-6" />
                
                {/* Pulsing animation */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-blue-400/30"
                />
                
                {/* Sparkle effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="h-3 w-3 text-yellow-300" />
                </motion.div>
              </div>
            </Button>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
            >
              Trợ lý AI Coffee Shop
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <AIChatInterface
            isOpen={isOpen}
            onClose={handleClose}
            isMinimized={isMinimized}
            onToggleMinimize={handleToggleMinimize}
          />
        )}
      </AnimatePresence>
    </>
  );
}

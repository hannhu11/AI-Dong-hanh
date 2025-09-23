/**
 * 🧠 CONTEXT SUGGESTION BUBBLE - UI cho Context Awareness
 * 
 * Component hiển thị các gợi ý thông minh từ Clipboard Intelligence và Window Detection
 * Phát triển bởi: Hàn Như | Dự án: Trợ Lý Nhận Thức AI
 */

import React, { useState, useEffect } from 'react';
import { Paper, Text, Group, ActionIcon, Badge, Transition } from '@mantine/core';
import { IconX, IconBulb, IconCode, IconAlertTriangle, IconFileText } from '@tabler/icons-react';
import './ContextSuggestionBubble.css';

interface ContextSuggestion {
  type: 'error' | 'code' | 'long_text' | 'url' | 'text';
  suggestion: string;
  content: string;
  timestamp: number;
}

function ContextSuggestionBubble() {
  const [currentSuggestion, setCurrentSuggestion] = useState<ContextSuggestion | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleContextSuggestion = (event: CustomEvent<ContextSuggestion>) => {
      const suggestion = event.detail;
      setCurrentSuggestion(suggestion);
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      console.log(`💡 [CONTEXT SUGGESTION] ${suggestion.type}: ${suggestion.suggestion}`);
    };

    // Listen for context suggestion events
    window.addEventListener('context-suggestion' as any, handleContextSuggestion);

    return () => {
      window.removeEventListener('context-suggestion' as any, handleContextSuggestion);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <IconAlertTriangle size={16} color="#ff6b6b" />;
      case 'code':
        return <IconCode size={16} color="#51cf66" />;
      case 'long_text':
        return <IconFileText size={16} color="#74c0fc" />;
      default:
        return <IconBulb size={16} color="#ffd43b" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'red';
      case 'code':
        return 'green';
      case 'long_text':
        return 'blue';
      default:
        return 'yellow';
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'error':
        return 'Lỗi phát hiện';
      case 'code':
        return 'Code phân tích';
      case 'long_text':
        return 'Văn bản tóm tắt';
      default:
        return 'Gợi ý AI';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentSuggestion) return null;

  return (
    <Transition
      mounted={isVisible}
      transition="slide-left"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          className="context-suggestion-bubble"
          style={{
            ...styles,
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '350px',
            zIndex: 10000,
            background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.95) 0%, rgba(15, 15, 20, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(116, 192, 252, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <Group justify="space-between" align="flex-start" mb="xs">
            <Group>
              {getIcon(currentSuggestion.type)}
              <Badge 
                color={getBadgeColor(currentSuggestion.type)} 
                size="sm"
                variant="light"
              >
                {getBadgeText(currentSuggestion.type)}
              </Badge>
            </Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleClose}
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
          
          <Text size="sm" mb="xs" style={{ 
            fontWeight: 600,
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.4
          }}>
            {currentSuggestion.suggestion}
          </Text>
          
          {currentSuggestion.content && (
            <Text size="xs" style={{ 
              opacity: 0.85,
              fontStyle: 'italic',
              color: '#b8c5d1',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
              lineHeight: 1.3
            }}>
              "{currentSuggestion.content}"
            </Text>
          )}
          
          <div 
            className="context-timestamp"
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '10px',
              color: 'rgba(184, 197, 209, 0.8)',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
              fontWeight: 500
            }}
          >
            {new Date(currentSuggestion.timestamp).toLocaleTimeString('vi-VN')}
          </div>
        </Paper>
      )}
    </Transition>
  );
}

export default ContextSuggestionBubble;

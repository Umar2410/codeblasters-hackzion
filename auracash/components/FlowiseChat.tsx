'use client';

import { useEffect } from 'react';

export default function FlowiseChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js';
    script.type = 'module';
    script.async = true;
    
    script.onload = () => {
      if (window.Chatbot) {
        window.Chatbot.init({
          chatflowid: "e2875a21-4c75-4cba-a17a-3be18e56ba00",
          apiHost: "http://localhost:3000",
          chatflowConfig: {
            // This allows us to pass variables like 'planContext' to the Flowise agent
            vars: {
              systemContext: "You are the Aura Agent, a financial expert for AuraCash."
            }
          },
          theme: {
            button: {
              backgroundColor: "#00e699",
              right: 30,
              bottom: 30,
              size: "large",
              iconColor: "white",
              customIconSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/flowise.png",
            },
            chatWindow: {
              showTitle: true,
              title: 'Aura Agent',
              titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/flowise.png',
              welcomeMessage: 'Hello! I am your Aura AI Agent. How can I help you with your investments today?',
              backgroundColor: "#0b0f1a",
              height: 700,
              width: 400,
              fontSize: 16,
              poweredByTextColor: "#ffffff",
              botMessage: {
                backgroundColor: "#1a1f2e",
                textColor: "#ffffff",
                showAvatar: true,
                avatarSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/flowise.png",
              },
              userMessage: {
                backgroundColor: "#00e699",
                textColor: "#0b0f1a",
                showAvatar: true,
                avatarSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/user.png",
              },
              textInput: {
                placeholder: 'Type your question...',
                backgroundColor: '#1a1f2e',
                textColor: '#ffffff',
                sendButtonColor: '#00e699',
              }
            }
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script if necessary
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}

// Add TypeScript support for window.Chatbot
declare global {
  interface Window {
    Chatbot: any;
  }
}

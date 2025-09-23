import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import Loading from "./Loading";
import { useSettings } from "./hooks/useSettings";
import { appWindow } from "@tauri-apps/api/window";
import { useDefaultPets, usePets } from "./hooks/usePets";
import { confirm } from "@tauri-apps/api/dialog";
import { MantineProvider } from "@mantine/core";
import { PrimaryColor } from "./utils";
import { ColorSchemeType } from "./types/ISetting";
import ThoughtBubble from "./ui/components/ThoughtBubble";
import "./ui/components/ThoughtBubble.css";
import ContextSuggestionBubble from "./ui/components/ContextSuggestionBubble";
import { AIMessage } from "./services/petAIService";
import { initializeCoreServices } from "./services/mainService";

const PhaserWrapper = React.lazy(() => import("./PhaserWrapper"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  useSettings();
  useDefaultPets();
  const { isError, error } = usePets();
  
  // State for AI thought bubble
  const [currentThought, setCurrentThought] = useState<string>("");
  const [isThoughtVisible, setIsThoughtVisible] = useState(false);

  // Listen for AI messages from Phaser scene
  useEffect(() => {
    const handleAIMessage = (event: CustomEvent<AIMessage>) => {
      const message = event.detail;
      setCurrentThought(message.text);
      setIsThoughtVisible(true);
    };

    // Add event listener
    window.addEventListener('ai-message' as any, handleAIMessage);

    return () => {
      window.removeEventListener('ai-message' as any, handleAIMessage);
    };
  }, []);

  // 🏗️ CENTRALIZED SERVICE INITIALIZATION - Foundation Stabilization
  useEffect(() => {
    let isMounted = true;
    
    const initializeFoundationServices = async () => {
      try {
        console.log("🚀 [DEBUG] Starting Foundation Services initialization...");
        console.log("🏗️ FOUNDATION STABILIZATION: Khởi tạo tất cả core services...");
        
        // Sử dụng Centralized Service Manager với debug logging
        console.log("📦 [DEBUG] Calling initializeCoreServices...");
        await initializeCoreServices();
        console.log("📦 [DEBUG] initializeCoreServices completed!");
        
        console.log("✅ FOUNDATION STABILIZED: Tất cả services đã ổn định!");
        
      } catch (error) {
        console.error("❌ CRITICAL ERROR trong Foundation Stabilization:", error);
        console.error("❌ [DEBUG] Error stack:", error instanceof Error ? error.stack : String(error));
        
        // Fallback notification
        if (isMounted) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('ai-message', {
              detail: {
                text: "⚠️ Một số tính năng có thể chưa hoạt động. Đang tự động khôi phục...",
                timestamp: Date.now(),
                petId: 'system-recovery',
                isContextMessage: true
              }
            }));
          }, 5000);
        }
      }
    };

    initializeFoundationServices();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isError) {
    confirm(`Error: ${error.message}`, {
      title: 'WindowPet Dialog',
      type: 'error',
    }).then((ok) => {
      if (ok !== undefined) {
        appWindow.close();
      }
    });
  }

  return (
    <MantineProvider
      defaultColorScheme={ColorSchemeType.Dark}
      theme={{
        fontFamily: 'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
        colors: {
          dark: [
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5C5F66",
            "#373A40",
            "#2C2E33",
            // shade
            "#1A1B1E",
            // background
            "#141517",
            "#1A1B1E",
            "#101113",
          ],
        },
        primaryColor: PrimaryColor,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<PhaserWrapper />} />
          <Route path="/setting" element={
            <Suspense fallback={<Loading />}>
              <SettingWindow />
            </Suspense>
          } />
        </Routes>
      </Router>
      
      {/* AI Thought Bubble - Always rendered but conditionally visible */}
      <ThoughtBubble
        message={currentThought}
        isVisible={isThoughtVisible}
        onAnimationComplete={() => {
          setIsThoughtVisible(false);
          setCurrentThought("");
        }}
        duration={12000}
      />
      
      {/* Context Suggestion Bubble - Trợ Lý Nhận Thức AI */}
      <ContextSuggestionBubble />
    </MantineProvider>
  );
}

export default App;
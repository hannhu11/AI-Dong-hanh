import { useEffect, useRef } from "react";
import { useSettingStore } from "./hooks/useSettingStore";
import { initializePhaserGame, updatePhaserPets, getPhaserStatus } from "./services/phaserManager";

/**
 * 🎮 PHASER WRAPPER - ZENITH PERFORMANCE EDITION
 * 
 * Refactored to use PhaserManager singleton - eliminates lag and delete bugs!
 * 
 * KEY CHANGES:
 * ✅ No more multiple Phaser.Game instances
 * ✅ No more game recreation on pet changes  
 * ✅ No more dependency on screen size changes
 * ✅ Singleton pattern ensures stable performance
 */
function PhaserWrapper() {
    const phaserDom = useRef<HTMLDivElement>(null);
    const { pets } = useSettingStore();

    // 🚀 Initialize game ONCE when component mounts
    useEffect(() => {
        const initializeGame = async () => {
            if (!phaserDom.current) {
                console.error("🚨 PhaserWrapper: Container ref not ready!");
                return;
            }

            try {
                // Set container ID for singleton manager
                phaserDom.current.id = "phaser-container";
                
                console.log("🎮 PhaserWrapper: Initializing with singleton manager...");
                await initializePhaserGame("phaser-container", pets);
                
                const status = getPhaserStatus();
                console.log("✅ PhaserWrapper: Singleton game ready!", status);
                
            } catch (error) {
                console.error("🚨 PhaserWrapper: Initialization failed:", error);
            }
        };

        initializeGame();

        // 🧹 Cleanup on unmount (rarely happens in this app)
        return () => {
            console.log("🧹 PhaserWrapper: Component unmounting (cleanup handled by singleton)");
        };
    }, []); // 🔑 EMPTY DEPENDENCY - Initialize ONCE only!

    // 🔄 Update pets when pets configuration changes (NO game recreation!)
    useEffect(() => {
        console.log(`🐾 PhaserWrapper: Pets configuration changed (${pets.length} pets)`);
        updatePhaserPets(pets);
    }, [pets]); // 🔑 Only pets dependency - just update registry!

    return (
        <>
            <div 
                ref={phaserDom} 
                id="phaser-container"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none', // Ensure desktop interaction
                    zIndex: -1 // Behind other UI elements
                }}
            />
        </>
    )
}

export default PhaserWrapper;
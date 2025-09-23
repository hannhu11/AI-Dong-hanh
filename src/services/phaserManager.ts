/**
 * 🎮 PHASER MANAGER SINGLETON
 * 
 * Giải quyết "Singleton Violation" - đảm bảo chỉ có 1 Phaser.Game instance
 * duy nhất trong suốt vòng đời ứng dụng để loại bỏ lag và lỗi delete pet.
 * 
 * Architecture: Zenith Performance Pattern
 * Author: AI Systems Architect
 */

import Phaser from "phaser";
import Pets from "../scenes/Pets";
import { appWindow } from "@tauri-apps/api/window";

interface GameRegistry {
  spriteConfig: any;
  screenWidth: number;
  screenHeight: number;
}

class PhaserManagerSingleton {
  private static instance: PhaserManagerSingleton;
  private game: Phaser.Game | null = null;
  private isInitialized: boolean = false;
  private gameRegistry: GameRegistry = {
    spriteConfig: [],
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };

  private constructor() {
    // Private constructor for singleton pattern
    console.log("🎮 PhaserManager: Singleton instance created");
  }

  public static getInstance(): PhaserManagerSingleton {
    if (!PhaserManagerSingleton.instance) {
      PhaserManagerSingleton.instance = new PhaserManagerSingleton();
    }
    return PhaserManagerSingleton.instance;
  }

  /**
   * 🚀 Initialize Phaser Game (Only Once!)
   * @param containerId - DOM container ID
   * @param pets - Current pets configuration
   */
  public async initialize(containerId: string, pets: any[] = []): Promise<void> {
    if (this.isInitialized && this.game) {
      console.log("⚠️ PhaserManager: Game already initialized - updating registry only");
      this.updateGameRegistry(pets);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`🚨 PhaserManager: Container '${containerId}' not found!`);
    }

    console.log("🏗️ PhaserManager: Initializing single game instance...");

    // Update registry before game creation
    this.updateGameRegistry(pets);

    // Ensure cursor events passthrough for desktop interaction
    await appWindow.setIgnoreCursorEvents(true);

    const phaserConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: '#ffffff0',
      transparent: true,
      roundPixels: true,
      antialias: true,
      scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: this.gameRegistry.screenWidth,
        height: this.gameRegistry.screenHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 200, x: 0 },
        },
      },
      fps: {
        target: 30,
        min: 30,
        smoothStep: true,
      },
      scene: [Pets],
      audio: {
        noAudio: true,
      },
      callbacks: {
        preBoot: (game) => {
          game.registry.set('spriteConfig', this.gameRegistry.spriteConfig);
          console.log(`🎮 PhaserManager: Registry set with ${this.gameRegistry.spriteConfig.length} pets`);
        }
      }
    };

    // Create the singleton game instance
    this.game = new Phaser.Game(phaserConfig);
    this.isInitialized = true;

    // Listen for screen resize events
    this.setupResizeHandler();

    console.log("✅ PhaserManager: Singleton game initialized successfully!");
  }

  /**
   * 📐 Update game registry (pets, screen size)
   */
  private updateGameRegistry(pets: any[]): void {
    this.gameRegistry.spriteConfig = pets;
    this.gameRegistry.screenWidth = window.screen.width;
    this.gameRegistry.screenHeight = window.screen.height;

    // Update existing game registry if game is already running
    if (this.game) {
      this.game.registry.set('spriteConfig', pets);
      console.log(`🔄 PhaserManager: Registry updated with ${pets.length} pets`);
    }
  }

  /**
   * 📐 Setup screen resize handler
   */
  private setupResizeHandler(): void {
    const handleResize = () => {
      const newWidth = window.screen.width;
      const newHeight = window.screen.height;
      
      if (this.gameRegistry.screenWidth !== newWidth || this.gameRegistry.screenHeight !== newHeight) {
        this.gameRegistry.screenWidth = newWidth;
        this.gameRegistry.screenHeight = newHeight;
        
        if (this.game && this.game.scale) {
          this.game.scale.resize(newWidth, newHeight);
          console.log(`📐 PhaserManager: Game resized to ${newWidth}x${newHeight}`);
        }
      }
    };

    window.addEventListener("resize", handleResize);
  }

  /**
   * 🎮 Get current game instance
   */
  public getGame(): Phaser.Game | null {
    return this.game;
  }

  /**
   * 🔄 Update pets configuration (for real-time pet management)
   */
  public updatePets(pets: any[]): void {
    console.log(`🐾 PhaserManager: Updating pets configuration (${pets.length} pets)`);
    this.updateGameRegistry(pets);

    // 🔄 Registry update is sufficient - Pets will auto-detect new pets from registry
    // The Pets scene automatically reads from game registry when creating new pets
    if (this.game && this.game.scene.isActive('Pets')) {
      console.log("🔄 PhaserManager: Pet registry updated, scene will reflect changes automatically");
    }
  }

  /**
   * 🗑️ Remove specific pet (for delete functionality)
   */
  public removePet(petId: string): void {
    console.log(`🗑️ PhaserManager: Removing pet ${petId}`);
    
    // Get current pets from registry
    const currentPets = this.gameRegistry.spriteConfig;
    const updatedPets = currentPets.filter((pet: any) => pet.id !== petId);
    
    // Update registry
    this.updateGameRegistry(updatedPets);
    
    // Directly call removePet on Pets scene for immediate effect
    if (this.game && this.game.scene.isActive('Pets')) {
      const petsScene = this.game.scene.getScene('Pets');
      if (petsScene && typeof (petsScene as any).removePet === 'function') {
        (petsScene as any).removePet(petId);
        console.log(`✅ PhaserManager: Pet ${petId} removed from scene`);
      } else {
        console.warn(`⚠️ PhaserManager: Could not find Pets scene or removePet method`);
      }
    }
  }

  /**
   * 🧹 Cleanup (should only be called on app shutdown)
   */
  public destroy(): void {
    console.log("🧹 PhaserManager: Destroying singleton game instance...");
    
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
    
    this.isInitialized = false;
    window.removeEventListener("resize", this.setupResizeHandler);
    
    console.log("✅ PhaserManager: Cleanup completed");
  }

  /**
   * 📊 Get manager status (for debugging)
   */
  public getStatus(): {
    isInitialized: boolean;
    gameExists: boolean;
    petsCount: number;
    screenSize: { width: number; height: number };
  } {
    return {
      isInitialized: this.isInitialized,
      gameExists: !!this.game,
      petsCount: this.gameRegistry.spriteConfig.length,
      screenSize: {
        width: this.gameRegistry.screenWidth,
        height: this.gameRegistry.screenHeight
      }
    };
  }
}

// Export singleton instance
export const phaserManager = PhaserManagerSingleton.getInstance();

// Export helper functions for easy access
export const initializePhaserGame = (containerId: string, pets: any[]) => 
  phaserManager.initialize(containerId, pets);

export const getPhaserGame = () => 
  phaserManager.getGame();

export const updatePhaserPets = (pets: any[]) => 
  phaserManager.updatePets(pets);

export const removePhaserPet = (petId: string) =>
  phaserManager.removePet(petId);

export const getPhaserStatus = () => 
  phaserManager.getStatus();

export const destroyPhaserGame = () => 
  phaserManager.destroy();

console.log("🎮 PhaserManager: Singleton service loaded");

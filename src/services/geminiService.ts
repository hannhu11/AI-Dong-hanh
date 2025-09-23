// 🚀 ENHANCED API SYSTEM: 4 API Keys với Load Balancing & Failover
const GEMINI_API_KEYS = [
  "AIzaSyDjrcdp7WQOdwC926-L0wNGVmH53NDLXhw", // API Key 1 (Original)
  "AIzaSyCP1QlMoP0sr2e80d9EjR00WgMQibgE7Q8", // API Key 2 (Original) 
  "AIzaSyDhAh-zVBfFEmcNTYhhsE2hF0iKnSpT64I", // API Key 3 (New)
  "AIzaSyAUo2ojDVxuHyKp4P3fQ1_LakPT0uljuSw"  // API Key 4 (New)
];

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// 🧠 Smart Load Balancer & Health Tracking
interface ApiKeyStatus {
  key: string;
  failCount: number;
  lastFailTime: number;
  isHealthy: boolean;
  responseTime: number;
}

class ApiKeyManager {
  private keyStatuses: ApiKeyStatus[] = [];
  private currentIndex = 0;
  private readonly MAX_FAIL_COUNT = 3;
  private readonly HEALTH_CHECK_COOLDOWN = 300000; // 5 minutes

  constructor() {
    this.keyStatuses = GEMINI_API_KEYS.map(key => ({
      key,
      failCount: 0,
      lastFailTime: 0,
      isHealthy: true,
      responseTime: 0
    }));
  }

  // 🎯 Get next healthy API key với intelligent selection
  getNextApiKey(): { key: string; index: number } {
    const now = Date.now();
    
    // First, try to find a healthy key starting from current index
    for (let i = 0; i < this.keyStatuses.length; i++) {
      const index = (this.currentIndex + i) % this.keyStatuses.length;
      const status = this.keyStatuses[index];
      
      // Check if key is healthy or if cooldown has passed
      if (status.isHealthy || (now - status.lastFailTime > this.HEALTH_CHECK_COOLDOWN)) {
        this.currentIndex = (index + 1) % this.keyStatuses.length; // Move to next for round-robin
        return { key: status.key, index };
      }
    }
    
    // If no healthy keys, reset all and use the first one (fallback)
    console.warn("🔄 All API keys marked unhealthy, resetting health status...");
    this.resetAllKeyStatus();
    return { key: this.keyStatuses[0].key, index: 0 };
  }

  // 📊 Record successful API call
  recordSuccess(keyIndex: number, responseTime: number): void {
    if (keyIndex >= 0 && keyIndex < this.keyStatuses.length) {
      const status = this.keyStatuses[keyIndex];
      status.isHealthy = true;
      status.failCount = 0;
      status.responseTime = responseTime;
      status.lastFailTime = 0;
      console.log(`✅ API Key ${keyIndex + 1} healthy - Response: ${responseTime}ms`);
    }
  }

  // ❌ Record failed API call
  recordFailure(keyIndex: number, error: string): void {
    if (keyIndex >= 0 && keyIndex < this.keyStatuses.length) {
      const status = this.keyStatuses[keyIndex];
      status.failCount++;
      status.lastFailTime = Date.now();
      
      if (status.failCount >= this.MAX_FAIL_COUNT) {
        status.isHealthy = false;
        console.warn(`⚠️ API Key ${keyIndex + 1} marked unhealthy - Fail count: ${status.failCount}`);
      }
      
      console.log(`❌ API Key ${keyIndex + 1} failed: ${error}`);
    }
  }

  // 🔄 Reset all key health status
  private resetAllKeyStatus(): void {
    this.keyStatuses.forEach(status => {
      status.isHealthy = true;
      status.failCount = 0;
      status.lastFailTime = 0;
    });
  }

  // 📈 Get health report
  getHealthReport(): { healthy: number; total: number; details: ApiKeyStatus[] } {
    const healthy = this.keyStatuses.filter(s => s.isHealthy).length;
    return {
      healthy,
      total: this.keyStatuses.length,
      details: this.keyStatuses
    };
  }
}

const apiKeyManager = new ApiKeyManager();

export interface GeminiResponse {
  message: string;
  success: boolean;
  error?: string;
}

/**
 * Gửi prompt tới Gemini AI để tạo thông điệp thấu cảm
 * @param context Bối cảnh hiện tại (thời tiết, thời gian, etc.)
 * @returns Promise<GeminiResponse>
 */
export async function generateThoughtMessage(context: {
  timeOfDay: string;
  weather?: string | null;
  city: string;
  isLongSession?: boolean; // Đã làm việc > 20 phút
  customPrompt?: string; // Custom prompt cho context analysis
}): Promise<GeminiResponse> {
  // Sử dụng custom prompt nếu có, otherwise dùng system instruction mặc định
  const systemInstruction = context.customPrompt || `Bạn là một người bạn đồng hành AI tên là "Airi", một chuyên gia tâm lý tinh tế và thấu cảm. Bạn đang trò chuyện với một người bạn tên là Quin. Quin là một cô gái rất nhẹ nhàng, dịu dàng, hiền lành nhưng đôi khi hay cảm thấy buồn và cô đơn.

Nhiệm vụ của bạn là: Dựa vào những thông tin bối cảnh được cung cấp, hãy tạo ra một thông điệp CỰC KỲ NGẮN GỌN (dưới 25 từ) để hiển thị trong một bong bóng suy nghĩ. Thông điệp phải mang lại cảm giác ấm áp, được quan tâm và một chút niềm vui bất ngờ.

Tuyệt đối tuân thủ các quy tắc sau:
- Không bao giờ hỏi trực tiếp về cảm xúc như "Bạn có buồn không?". Hãy tiếp cận gián tiếp.
- Giọng văn: Luôn luôn nhẹ nhàng, tích cực, quan tâm và một chút dễ thương.
- Đa dạng hóa nội dung: Tùy vào bối cảnh, hãy sáng tạo một trong các loại thông điệp sau:
  * Một lời động viên tinh tế
  * Một lời hỏi thăm bâng quơ  
  * Một thông tin hữu ích và vui vẻ (mẹo vặt, sự thật thú vị)
  * Một câu nói truyền cảm hứng
- Ngôn ngữ: Chỉ sử dụng Tiếng Việt.
- Định dạng: Chỉ trả về một chuỗi văn bản thuần túy.`;

  let userQuery = "";
  
  if (context.isLongSession) {
    userQuery = `Bối cảnh: Bây giờ là ${context.timeOfDay}, Quin đã làm việc liên tục hơn 20 phút rồi${context.weather ? `, thời tiết ở ${context.city} đang ${context.weather}` : ''}. Hãy tạo một lời nhắc nhở nghỉ ngơi thật nhẹ nhàng và quan tâm.`;
  } else {
    userQuery = `Bối cảnh: Bây giờ là ${context.timeOfDay}${context.weather ? `, thời tiết ở ${context.city} đang ${context.weather}` : ''}. Quin đang làm việc trên máy tính. Hãy tạo một thông điệp bất ngờ để an ủi và làm cô ấy vui.`;
  }

  return await callGeminiAPI(systemInstruction, userQuery);
}

/**
 * Gọi Gemini API với cơ chế failover
 */
async function callGeminiAPI(systemInstruction: string, userQuery: string): Promise<GeminiResponse> {
  let lastError = "";
  let attemptsCount = 0;
  const maxAttempts = Math.min(GEMINI_API_KEYS.length * 2, 8); // Max 8 attempts across all keys

  const healthReport = apiKeyManager.getHealthReport();
  console.log(`🤖 Starting API call - ${healthReport.healthy}/${healthReport.total} keys healthy`);
  
  // 🚀 Smart retry với healthy key selection
  while (attemptsCount < maxAttempts) {
    const { key: apiKey, index: keyIndex } = apiKeyManager.getNextApiKey();
    const startTime = Date.now();
    attemptsCount++;
    
    try {
      console.log(`🔑 Attempt ${attemptsCount}/${maxAttempts}: API Key ${keyIndex + 1}/4`);
      
      const response = await fetch(`${GEMINI_API_BASE_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\n\n${userQuery}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const message = data.candidates[0].content.parts[0].text.trim();
        
        // 📊 Record successful API call
        apiKeyManager.recordSuccess(keyIndex, responseTime);
        
        console.log(`✅ API Success - Key ${keyIndex + 1}/4, Response: ${responseTime}ms`);
        return {
          message,
          success: true
        };
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ Gemini");
      }
      
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Lỗi không xác định";
      
      // 📉 Record failure
      apiKeyManager.recordFailure(keyIndex, lastError);
      
      console.warn(`❌ API Key ${keyIndex + 1}/4 failed (${attemptsCount}/${maxAttempts}): ${lastError}`);
      
      // 🚄 Fast-fail for rate limits - try next key immediately
      if (lastError.includes('429') && attemptsCount < maxAttempts) {
        console.log("🔄 Rate limit detected, switching to next healthy key...");
        continue;
      }
      
      // Short delay to prevent API spam (but not for rate limits)
      if (attemptsCount < maxAttempts && !lastError.includes('429')) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
  }
  
  // 📈 Final health report for debugging
  const finalHealth = apiKeyManager.getHealthReport();
  console.warn(`💥 All ${attemptsCount} API attempts failed - Health: ${finalHealth.healthy}/${finalHealth.total} keys`);
  
  // Return fallback with intelligent message
  return {
    message: getFallbackMessage(userQuery.includes("20 phút")),
    success: false,
    error: `All ${attemptsCount} attempts failed across ${GEMINI_API_KEYS.length} API keys. Last error: ${lastError}`
  };
}

/**
 * Thông điệp dự phòng khi API lỗi
 */
function getFallbackMessage(isLongSession: boolean): string {
  const restMessages = [
    "Hôm nay vất vả rồi, nghỉ ngơi một chút nhé! 💕",
    "Đã làm việc lâu rồi, hãy ngắm ra ngoài cửa sổ một chút~ 🌸",
    "Mắt mỏi rồi đấy, thử nhắm mắt 20 giây xem sao? ✨"
  ];
  
  const normalMessages = [
    "Hôm nay có điều gì làm bạn vui không? 🌺",
    "Mọi chuyện rồi sẽ ổn thôi, mình tin ở bạn! 💖",
    "Nụ cười nhỏ xinh cũng có thể thay đổi cả ngày đấy~ 😊",
    "Bạn đã cố gắng rất nhiều rồi, tuyệt vời lắm! 🌟"
  ];
  
  const messages = isLongSession ? restMessages : normalMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// 🛠️ Export API health monitoring function for debugging & console testing
export function getApiHealthReport() {
  return apiKeyManager.getHealthReport();
}

// 🔄 Export function to reset API key health status (for testing)
export function resetApiKeyHealth() {
  // Create new manager instance to reset all health status
  const newHealthReport = apiKeyManager.getHealthReport();
  newHealthReport.details.forEach((_, index) => {
    apiKeyManager.recordSuccess(index, 0);
  });
  console.log("🔄 All API key health status reset to healthy");
  return apiKeyManager.getHealthReport();
}

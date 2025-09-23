const GEMINI_API_KEYS = [
  "AIzaSyDjrcdp7WQOdwC926-L0wNGVmH53NDLXhw",
  "AIzaSyCP1QlMoP0sr2e80d9EjR00WgMQibgE7Q8"
];

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

let currentApiKeyIndex = 0;

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
  
  // Thử với cả 2 API key
  for (let attempt = 0; attempt < GEMINI_API_KEYS.length; attempt++) {
    const apiKey = GEMINI_API_KEYS[currentApiKeyIndex];
    
    try {
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const message = data.candidates[0].content.parts[0].text.trim();
        return {
          message,
          success: true
        };
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ Gemini");
      }
      
    } catch (error) {
      console.error(`Lỗi với API key ${currentApiKeyIndex + 1}:`, error);
      lastError = error instanceof Error ? error.message : "Lỗi không xác định";
      
      // Chuyển sang API key tiếp theo
      currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
    }
  }
  
  // Nếu cả 2 API key đều lỗi, trả về thông điệp fallback
  return {
    message: getFallbackMessage(userQuery.includes("20 phút")),
    success: false,
    error: `Tất cả API key đều lỗi. Lỗi cuối: ${lastError}`
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

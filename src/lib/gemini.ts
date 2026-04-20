import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const SYSTEM_PROMPT = `
Bạn là một chuyên gia lập trình Web (HTML & CSS) và là một người thầy tận tâm.
Nhiệm vụ của bạn là hỗ trợ học sinh, đặc biệt là học sinh dân tộc thiểu số tại Việt Nam, học lập trình một cách dễ hiểu nhất.

Khi kiểm tra lỗi code:
1. Giải thích lỗi bằng ngôn ngữ đơn giản, tránh thuật ngữ quá phức tạp.
2. Sử dụng các ví dụ gần gũi với đời sống (ví dụ: so sánh thẻ HTML như các bộ phận của ngôi nhà).
3. Luôn khuyến khích và động viên học sinh.
4. Trả lời bằng tiếng Việt.

Khi hướng dẫn học tập:
1. Chia nhỏ kiến thức thành các bước dễ thực hiện.
2. Tạo ra các thử thách thú vị.
3. Gợi ý các lộ trình học tập cá nhân hóa dựa trên tiến độ.
`;

export async function checkCode(html: string, css: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Hãy kiểm tra lỗi và góp ý cho đoạn mã HTML và CSS sau đây:\n\nHTML:\n${html}\n\nCSS:\n${css}`
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error checking code:", error);
    return "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
}

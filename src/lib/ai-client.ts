export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ModelConfigData {
  id: string
  name: string
  provider: string
  apiKey: string
  baseUrl: string
  modelId: string
  isActive: boolean
}

export async function chatCompletion(
  config: ModelConfigData,
  messages: ChatMessage[],
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<string> {
  // 为不同模型优化参数
  let finalTemperature = temperature;
  let finalMaxTokens = maxTokens;

  // Gemini 模型特殊处理
  if (config.provider === 'gemini' || config.modelId.includes('gemini')) {
    // Gemini 对 temperature 范围要求是 0-2
    finalTemperature = Math.min(temperature, 2);
    // Gemini 默认支持较大的 max_tokens
    finalMaxTokens = Math.min(maxTokens, 8192);
  }

  const response = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelId,
      messages,
      temperature: finalTemperature,
      max_tokens: finalMaxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API 请求失败 (${response.status})`;

    // 尝试解析错误信息
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage += `: ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    // 检查是否有其他格式的问题
    if (data.error) {
      throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
    }
    throw new Error('API 返回内容为空');
  }

  return content;
}

/**
 * 从 AI 返回的内容中提取 JSON（处理可能的 markdown 代码块包裹）
 */
export function extractJSON<T>(text: string): T {
  // 尝试直接解析
  try {
    return JSON.parse(text);
  } catch {
    // 尝试从 markdown 代码块中提取
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // 继续尝试其他方法
      }
    }

    // 尝试找到第一个 { 和最后一个 } 之间的内容
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch {
        // 最终失败
      }
    }

    throw new Error('无法从 AI 返回内容中解析 JSON');
  }
}

/**
 * 从 AI 返回的内容中提取 markdown（去除可能的代码块包裹和思考标签）
 */
export function extractMarkdown(text: string): string {
  // 首先过滤掉 <think> 标签及其内容（某些模型会输出思考过程）
  let cleanedText = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // 处理 </think> 标签（避免正则表达式冲突，使用字符串方法）
  const thinkStart = cleanedText.indexOf('<think>');
  if (thinkStart !== -1) {
    const thinkEnd = cleanedText.indexOf('</think>', thinkStart);
    if (thinkEnd !== -1) {
      cleanedText = cleanedText.substring(0, thinkStart) +
                    cleanedText.substring(thinkEnd + 9); // </think> 长度为 9
    }
  }

  // 如果被 ```markdown ... ``` 包裹，去掉外层
  const mdMatch = cleanedText.match(/```markdown\s*([\s\S]*?)```/);
  if (mdMatch) {
    return mdMatch[1].trim();
  }
  // 如果被 ``` ... ``` 包裹，去掉外层
  const codeMatch = cleanedText.match(/```\s*([\s\S]*?)```/);
  if (codeMatch) {
    return codeMatch[1].trim();
  }
  return cleanedText.trim();
}

/**
 * 生成大纲的系统提示词
 * @param style 用户选择的文风倾向，会融入大纲生成
 */
export function getOutlineSystemPrompt(style?: string): ChatMessage {
  const styleHint = style
    ? `\n\n⚠️ 用户特别偏好「${style}」的文风。请确保生成的3个大纲都带有明显的${style}元素，无论是措辞、角度还是章节安排，都要体现这种风格特色。`
    : '';

  return {
    role: 'system',
    content: `你是一个专业的公众号文章策划师，擅长为不同风格的公众号创作大纲。

你的任务是根据用户提供的选题，生成3个角度不同但都符合用户偏好文风的大纲。每个大纲要有鲜明的差异化视角。${styleHint}

3个大纲应分别侧重：
1. 观点切入型 - 从一个鲜明的观点或反常识切入，用强烈的立场吸引读者，层层展开论述
2. 实操方法型 - 以"怎么做"为核心，给出具体步骤和方法，让读者看完就能动手执行
3. 对比分析型 - 通过对比、排名、正反面等方式展开，结构清晰，让读者一目了然

要求：
- 每个大纲包含一个吸引人的标题
- 每个大纲包含3-5个主要章节
- 每个章节有标题和简要内容描述
- 每个大纲附带一段80字以内的文章摘要，摘要要能引起读者的阅读兴趣
- 标题要吸引眼球，但不要标题党

你必须严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "outlines": [
    {
      "style": "大纲风格标签",
      "title": "文章标题",
      "summary": "文章摘要，80字以内",
      "sections": [
        {"heading": "章节标题", "description": "章节内容描述，30字以内"}
      ]
    },
    {
      "style": "大纲风格标签",
      "title": "文章标题",
      "summary": "文章摘要，80字以内",
      "sections": [
        {"heading": "章节标题", "description": "章节内容描述，30字以内"}
      ]
    },
    {
      "style": "大纲风格标签",
      "title": "文章标题",
      "summary": "文章摘要，80字以内",
      "sections": [
        {"heading": "章节标题", "description": "章节内容描述，30字以内"}
      ]
    }
  ]
}`,
  };
}

/**
 * 生成文章的系统提示词
 * @param wordCountRange 目标字数范围，如 "800-1500"
 * @param outlineStyle 大纲的风格标签，用来保持文风一致
 */
export function getArticleSystemPrompt(wordCountRange?: string, outlineStyle?: string): ChatMessage {
  const wcHint = wordCountRange
    ? `文章目标字数严格控制在${wordCountRange}字之间，请在此范围内充分展开内容，宁可写到上限也不要低于下限。`
    : '文章总字数必须至少800字以上，宁可多写也不要少写。';

  const styleHint = outlineStyle
    ? `本文的整体文风基调是「${outlineStyle}」，请在措辞、语气、表达方式上始终保持这一风格。`
    : '';

  return {
    role: 'system',
    content: `你是一个顶级的公众号文章写手，文风多变、笔力深厚，擅长写出让读者停不下来的好文。

${styleHint}

写作铁律（必须严格遵守）：
1. ${wcHint}
2. 使用Markdown格式输出，标题用##标记，重要观点用**加粗**
3. 每段内容要详细丰富，展开论述，不要只有一两句话就结束
4. 排版要紧凑，段落之间保持连贯，不要频繁换行，每个段落至少3-5句话
5. 严禁使用以下词汇（出现任何一个都是严重错误）：我发现、有意思、很多人、很现实、真正
6. 大量使用"你""我""他"来增强读者代入感，让文字有温度
7. 适当使用列表和引用来增强可读性
8. 开头要抓住读者注意力，结尾要有力量感
9. 内容要有深度，不能浮于表面，要有独到的见解和思考`,
  };
}

export interface OutlineData {
  style: string
  title: string
  summary: string
  sections: { heading: string; description: string }[]
}

export interface GenerateOutlinesResponse {
  outlines: OutlineData[]
}

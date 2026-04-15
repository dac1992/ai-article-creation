import { NextRequest, NextResponse } from 'next/server';
import {
  chatCompletion,
  extractMarkdown,
  getArticleSystemPrompt,
  type OutlineData,
  type ModelConfigData,
} from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outline, modelConfig, wordCountRange } = body;

    if (!outline || !modelConfig?.apiKey || !modelConfig?.baseUrl || !modelConfig?.modelId) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    const config: ModelConfigData = {
      id: '',
      name: modelConfig.modelId,
      provider: 'custom',
      apiKey: modelConfig.apiKey,
      baseUrl: modelConfig.baseUrl,
      modelId: modelConfig.modelId,
      isActive: true,
    };

    const outlineData = outline as OutlineData;

    // 构建文章生成的用户提示词
    const sectionsText = outlineData.sections
      .map((s, i) => `${i + 1}. ${s.heading}：${s.description}`)
      .join('\n');

    const userPrompt = `请根据以下大纲，撰写一篇完整的公众号文章。

风格：${outlineData.style}
标题：${outlineData.title}

大纲结构：
${sectionsText}

请直接输出文章内容，使用Markdown格式。`;

    const systemPrompt = getArticleSystemPrompt(wordCountRange, outlineData.style);

    const response = await chatCompletion(
      config,
      [
        systemPrompt,
        { role: 'user', content: userPrompt },
      ],
      0.8,
      8192
    );

    const articleMarkdown = extractMarkdown(response);

    // 统计字数（去除 markdown 标记后的纯文字）
    const plainText = articleMarkdown
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*|__/g, '')
      .replace(/\*|_/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*>+]\s/g, '')
      .replace(/\n/g, '')
      .trim();

    const wordCount = plainText.length;

    return NextResponse.json({
      article: articleMarkdown,
      wordCount,
      title: outlineData.title,
      style: outlineData.style,
    });
  } catch (error: unknown) {
    console.error('生成文章失败:', error);
    const message = error instanceof Error ? error.message : '生成文章失败，请检查模型配置后重试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import {
  chatCompletion,
  extractJSON,
  getOutlineSystemPrompt,
  type GenerateOutlinesResponse,
  type ModelConfigData,
} from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, modelConfig, style } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: '请输入文章选题' }, { status: 400 });
    }

    if (!modelConfig?.apiKey || !modelConfig?.baseUrl || !modelConfig?.modelId) {
      return NextResponse.json({ error: '请先配置并选择一个模型' }, { status: 400 });
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

    // 生成大纲
    const systemPrompt = getOutlineSystemPrompt(style);
    const userPrompt = `选题：${topic.trim()}\n\n请为这个选题生成3个不同角度的大纲。`;

    const response = await chatCompletion(
      config,
      [
        systemPrompt,
        { role: 'user', content: userPrompt },
      ],
      0.8,
      4096
    );

    const result = extractJSON<GenerateOutlinesResponse>(response);

    if (!result.outlines || result.outlines.length === 0) {
      return NextResponse.json({ error: '大纲生成失败，请重试' }, { status: 500 });
    }

    // 确保每个大纲都有完整的字段
    const outlines = result.outlines.map((outline, index) => ({
      id: `outline-${Date.now()}-${index}`,
      style: outline.style || `风格 ${index + 1}`,
      title: outline.title || `文章标题 ${index + 1}`,
      summary: outline.summary || '',
      sections: (outline.sections || []).map((section) => ({
        heading: section.heading || '章节标题',
        description: section.description || '',
      })),
    }));

    return NextResponse.json({ outlines });
  } catch (error: unknown) {
    console.error('生成大纲失败:', error);
    const message = error instanceof Error ? error.message : '生成大纲失败，请检查模型配置后重试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

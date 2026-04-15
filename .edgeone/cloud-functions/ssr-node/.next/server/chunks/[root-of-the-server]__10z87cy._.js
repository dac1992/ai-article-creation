module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},67180,e=>{"use strict";async function t(e,r,a=.7,n=4096){let s=a,i=n;("gemini"===e.provider||e.modelId.includes("gemini"))&&(s=Math.min(a,2),i=Math.min(n,8192));let o=await fetch(e.baseUrl,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.modelId,messages:r,temperature:s,max_tokens:i})});if(!o.ok){let e=await o.text(),t=`API 请求失败 (${o.status})`;try{let r=JSON.parse(e);r.error?.message?t=r.error.message:r.message&&(t=r.message)}catch{t+=`: ${e}`}throw Error(t)}let l=await o.json(),d=l.choices?.[0]?.message?.content;if(!d){if(l.error)throw Error("string"==typeof l.error?l.error:JSON.stringify(l.error));throw Error("API 返回内容为空")}return d}e.s(["chatCompletion",0,t,"extractJSON",0,function(e){try{return JSON.parse(e)}catch{let t=e.match(/```(?:json)?\s*([\s\S]*?)```/);if(t)try{return JSON.parse(t[1].trim())}catch{}let r=e.indexOf("{"),a=e.lastIndexOf("}");if(-1!==r&&-1!==a&&a>r)try{return JSON.parse(e.substring(r,a+1))}catch{}throw Error("无法从 AI 返回内容中解析 JSON")}},"extractMarkdown",0,function(e){let t=e.replace(/<think>[\s\S]*?<\/think>/gi,""),r=t.indexOf("<think>");if(-1!==r){let e=t.indexOf("</think>",r);-1!==e&&(t=t.substring(0,r)+t.substring(e+9))}let a=t.match(/```markdown\s*([\s\S]*?)```/);if(a)return a[1].trim();let n=t.match(/```\s*([\s\S]*?)```/);return n?n[1].trim():t.trim()},"getArticleSystemPrompt",0,function(e,t){let r=e?`文章目标字数严格控制在${e}字之间，请在此范围内充分展开内容，宁可写到上限也不要低于下限。`:"文章总字数必须至少800字以上，宁可多写也不要少写。",a=t?`本文的整体文风基调是「${t}」，请在措辞、语气、表达方式上始终保持这一风格。`:"";return{role:"system",content:`你是一个顶级的公众号文章写手，文风多变、笔力深厚，擅长写出让读者停不下来的好文。

${a}

写作铁律（必须严格遵守）：
1. ${r}
2. 使用Markdown格式输出，标题用##标记，重要观点用**加粗**
3. 每段内容要详细丰富，展开论述，不要只有一两句话就结束
4. 排版要紧凑，段落之间保持连贯，不要频繁换行，每个段落至少3-5句话
5. 严禁使用以下词汇（出现任何一个都是严重错误）：我发现、有意思、很多人、很现实、真正
6. 大量使用"你""我""他"来增强读者代入感，让文字有温度
7. 适当使用列表和引用来增强可读性
8. 开头要抓住读者注意力，结尾要有力量感
9. 内容要有深度，不能浮于表面，要有独到的见解和思考`}},"getOutlineSystemPrompt",0,function(e){let t=e?`

⚠️ 用户特别偏好「${e}」的文风。请确保生成的3个大纲都带有明显的${e}元素，无论是措辞、角度还是章节安排，都要体现这种风格特色。`:"";return{role:"system",content:`你是一个专业的公众号文章策划师，擅长为不同风格的公众号创作大纲。

你的任务是根据用户提供的选题，生成3个角度不同但都符合用户偏好文风的大纲。每个大纲要有鲜明的差异化视角。${t}

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
}`}}])},58974,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),i=e.i(74677),o=e.i(69741),l=e.i(16795),d=e.i(87718),c=e.i(95169),u=e.i(47587),p=e.i(66012),h=e.i(70101),m=e.i(74838),g=e.i(10372),x=e.i(93695);e.i(52474);var f=e.i(220),y=e.i(89171),v=e.i(67180);async function R(e){try{let{outline:t,modelConfig:r,wordCountRange:a}=await e.json();if(!t||!r?.apiKey||!r?.baseUrl||!r?.modelId)return y.NextResponse.json({error:"参数不完整"},{status:400});let n={id:"",name:r.modelId,provider:"custom",apiKey:r.apiKey,baseUrl:r.baseUrl,modelId:r.modelId,isActive:!0},s=t.sections.map((e,t)=>`${t+1}. ${e.heading}：${e.description}`).join("\n"),i=`请根据以下大纲，撰写一篇完整的公众号文章。

风格：${t.style}
标题：${t.title}

大纲结构：
${s}

请直接输出文章内容，使用Markdown格式。`,o=(0,v.getArticleSystemPrompt)(a,t.style),l=await (0,v.chatCompletion)(n,[o,{role:"user",content:i}],.8,8192),d=(0,v.extractMarkdown)(l),c=d.replace(/#{1,6}\s/g,"").replace(/\*\*|__/g,"").replace(/\*|_/g,"").replace(/```[\s\S]*?```/g,"").replace(/`([^`]+)`/g,"$1").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[-*>+]\s/g,"").replace(/\n/g,"").trim().length;return y.NextResponse.json({article:d,wordCount:c,title:t.title,style:t.style})}catch(t){console.error("生成文章失败:",t);let e=t instanceof Error?t.message:"生成文章失败，请检查模型配置后重试";return y.NextResponse.json({error:e},{status:500})}}e.s(["POST",0,R],42148);var w=e.i(42148);let E=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/generate-article/route",pathname:"/api/generate-article",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/generate-article/route.ts",nextConfigOutput:"standalone",userland:w,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:C,serverHooks:A}=E;async function b(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),E.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/generate-article/route";y=y.replace(/\/index$/,"")||"/";let v=await E.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:w,nextConfig:S,parsedUrl:C,isDraftMode:A,prerenderManifest:b,routerServerContext:N,isOnDemandRevalidate:O,revalidateOnlyGenerated:k,resolvedPathname:P,clientReferenceManifest:T,serverActionsManifest:$}=v,I=(0,o.normalizeAppPath)(y),_=!!(b.dynamicRoutes[I]||b.routes[P]),j=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,C,!1):t.end("This page could not be found"),null);if(_&&!A){let e=!!b.routes[P],t=b.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await j();throw new x.NoFallbackError}}let q=null;!_||E.isDev||A||(q="/index"===(q=P)?"/":q);let M=!0===E.isDev||!_,U=_&&!M;$&&T&&(0,i.setManifestsSingleton)({page:y,clientReferenceManifest:T,serverActionsManifest:$});let H=e.method||"GET",D=(0,s.getTracer)(),K=D.getActiveScopeSpan(),J=!!(null==N?void 0:N.isWrappedByNextServer),F=!!(0,n.getRequestMeta)(e,"minimalMode"),B=(0,n.getRequestMeta)(e,"incrementalCache")||await E.getIncrementalCache(e,S,b,F);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let L={params:w,previewProps:b.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:M,incrementalCache:B,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>E.onRequestError(e,t,a,n,N)},sharedContext:{buildId:R}},G=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),W=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let n,i=async e=>E.handle(W,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=D.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${H} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",a),n.updateName(t))}else e.updateName(`${H} ${y}`)}),o=async n=>{var s,o;let l=async({previousCacheEntry:r})=>{try{if(!F&&O&&k&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=L.renderOpts.fetchMetrics;let o=L.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=L.renderOpts.collectedTags;if(!_)return await (0,p.sendResponse)(G,V,s,L.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:O})},!1,N),t}},d=await E.handleResponse({req:e,nextConfig:S,cacheKey:q,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:k,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:F});if(!_)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",O?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return F&&_||c.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(G,V,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};J&&K?await o(K):(n=D.getActiveScopeSpan(),await D.withPropagatedContext(e.headers,()=>D.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${y}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!J))}catch(t){if(t instanceof x.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:O})},!1,N),_)throw t;return await (0,p.sendResponse)(G,V,new Response(null,{status:500})),null}}e.s(["handler",0,b,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:C})},"routeModule",0,E,"serverHooks",0,A,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,C],58974)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__10z87cy._.js.map
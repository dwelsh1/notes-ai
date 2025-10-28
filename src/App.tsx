import { useEffect, useState, useRef } from 'react';
import '@blocknote/core/fonts/inter.css';
import {
  BlockNoteView,
  useCreateBlockNote,
  FormattingToolbarController,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import './styles/App.css';
import {
  ChatCompletionMessageParam,
  CreateWebWorkerMLCEngine,
  InitProgressReport,
  hasModelInCache,
} from '@mlc-ai/web-llm';
import { convertBlockToString } from './utils/ParserBlockToString';
import { BlockNoteEditor } from '@blocknote/core';
import { CustomFormattingToolbar } from './components/CustomFormattingToolbar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar, SidebarRef } from './components/Sidebar';
import { appConfig } from './config/app-config';
import {
  addBlock,
  duplicateEditor,
  getEditorBlocks,
  updateBlock,
} from './utils/blockManipulation';
import correctSingleBlock from './utils/correctSingleBlock';
import { systemPrompt } from './config/prompt';
import { checkInputLength } from './utils/tokenizer';
import { env } from '@xenova/transformers';
import { extractSearchableText } from './utils/extractSearchableText';

declare global {
  interface Window {
    chrome?: {
      runtime?: {
        onConnect?: unknown;
        onMessage?: unknown;
      };
    };
  }
}
env.localModelPath = '/blocknote-llm/';

type EngineType = Awaited<ReturnType<typeof CreateWebWorkerMLCEngine>>;

const App = () => {
  const selectedModel = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
  const [engine, setEngine] = useState<EngineType | null>(null);
  const [progress, setProgress] = useState('Not loaded');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [runtimeStats, setRuntimeStats] = useState('');
  const [modelInCache, setModelInCache] = useState<boolean | null>(null);
  const [showSecondEditor, setShowSecondEditor] = useState<boolean>(false);
  const [errorBrowserMessage, setErrorBrowserMessage] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [currentProccess, setCurrentProcess] = useState<
    'translation' | 'correction' | 'summary' | 'develop' | null
  >(null);

  const [output, setOutput] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(
    undefined
  );
  const [pageTitle, setPageTitle] = useState('Untitled Page');
  const sidebarRef = useRef<SidebarRef>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadingMessage = {
    translation: 'Document translation in progress. Generating response...',
    correction: 'Document correction in progress. Generating response...',
    summary: 'Document summary in progress. Generating response...',
    develop: 'Document development in progress. Generating response...',
  };

  useEffect(() => {
    const compatibleBrowser = checkBrowser();
    checkModelInCache();
    if (!engine && compatibleBrowser) {
      loadEngine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  const mainEditor = useCreateBlockNote();
  const secondEditor = useCreateBlockNote({
    initialContent: mainEditor.document,
  });

  // Auto-save functionality - debounced save on editor changes
  useEffect(() => {
    if (!currentPageId) return;

    const unsubscribe = mainEditor.onChange(() => {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout to save after 2 seconds of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        saveCurrentPage();
      }, 2000);
    });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainEditor, currentPageId]);

  // Test function for debugging - currently unused
  // const test = async () => {
  //   let loadedEngine = engine;
  //   loadedEngine = await ensureEngineLoaded(loadedEngine);
  //   const maxStorageBufferBindingSize =
  //     await loadedEngine.getMaxStorageBufferBindingSize();
  //   console.log(maxStorageBufferBindingSize);
  //   await loadedEngine.getGPUVendor();
  // };

  const checkBrowser = () => {
    const userAgent = navigator.userAgent;
    let compatibleBrowser = true;

    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
      userAgent
    );

    if (isMobile) {
      setErrorBrowserMessage('Mobile phones are not compatible with WebGPU.');
      compatibleBrowser = false;
    } else if (/firefox|fxios/i.test(userAgent)) {
      setErrorBrowserMessage('Firefox is not compatible with WebGPU.');
      compatibleBrowser = false;
    } else if (
      /safari/i.test(userAgent) &&
      !/chrome|crios|crmo/i.test(userAgent)
    ) {
      setErrorBrowserMessage('Safari is not compatible with WebGPU.');
      compatibleBrowser = false;
    } else if (!window.chrome) {
      setErrorBrowserMessage('Your browser is not compatible with WebGPU.');
      compatibleBrowser = false;
    }
    return compatibleBrowser;
  };

  const initProgressCallback = (report: InitProgressReport) => {
    //console.log(report);
    if (
      modelInCache === true ||
      report.text.startsWith('Loading model from cache')
    ) {
      setOutput('Loading model into RAM...');
    } else {
      setOutput(
        'Downloading model weights to your browser cache, this may take a few minutes.'
      );
    }
    if (report.progress !== 0) {
      setProgressPercentage(report.progress);
    }
    if (report.progress === 1) {
      setProgressPercentage(0);
      setOutput('');
    }
    setProgress(report.text);
  };

  //const loadTokenizer = async () => {
  // 	const tokenizer = await AutoTokenizer.from_pretrained('/models');
  // 	setTokenizer(tokenizer);
  // };

  const loadEngine = async () => {
    console.log('Loading engine');
    setIsFetching(true);
    setOutput('Loading model...');

    const engine: EngineType = await CreateWebWorkerMLCEngine(
      new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      }),
      selectedModel,
      {
        initProgressCallback: initProgressCallback,
        appConfig: appConfig,
      }
    );
    setIsFetching(false);
    setEngine(engine);
    const isInCache = await hasModelInCache(selectedModel, appConfig);
    setModelInCache(isInCache);
    return engine;
  };

  type updateEditor = (
    text: string,
    editor?: BlockNoteEditor,
    idBlock?: string,
    textColor?: string
  ) => void;

  const onSend = async (
    prompt: string,
    task: 'translation' | 'correction' | 'summary' | 'develop',
    updateEditor: updateEditor
  ) => {
    if (prompt === '') {
      return;
    }
    setOutput(loadingMessage[task]);

    let loadedEngine = engine;

    loadedEngine = await ensureEngineLoaded(loadedEngine);

    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: systemPrompt[task],
    };

    console.log('Prompt: ' + prompt);

    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: prompt,
    };

    const chat = [systemMessage, userMessage];

    if (await checkInputLength(chat)) {
      setError(
        'This block text is too long. Please shorten the text or split it into multiple blocks.'
      );
      return;
    }

    try {
      console.log(systemMessage);
      await loadedEngine.resetChat();
      const completion = await loadedEngine.chat.completions.create({
        stream: true,
        messages: chat,
      });

      let assistantMessage = '';
      for await (const chunk of completion) {
        const curDelta = chunk.choices[0].delta.content;
        if (curDelta) {
          assistantMessage += curDelta;
          updateEditor(assistantMessage);
        }
      }
      const text = await loadedEngine.getMessage();

      setRuntimeStats(await loadedEngine.runtimeStatsText());
      console.log(await loadedEngine.runtimeStatsText());
      return text;
    } catch (e) {
      console.log('EXECPTION');
      console.log(e);
      setOutput('Error. Please try again.');
      return;
    }
  };

  const reset = async () => {
    if (!engine) {
      console.log('Engine not loaded');
      return;
    }
    await engine.resetChat();
    mainEditor.removeBlocks(mainEditor.document);
    secondEditor.removeBlocks(secondEditor.document);
    setShowSecondEditor(false);
    setOutput('');
    setError(null);
  };

  const onStop = () => {
    if (!engine) {
      console.log('Engine not loaded');
      return;
    }

    setIsGenerating(false);
    setCurrentProcess(null);
    setOutput('');
    engine.interruptGenerate();
  };

  const checkModelInCache = async () => {
    const isInCache = await hasModelInCache(selectedModel, appConfig);
    setModelInCache(isInCache);
    console.log(`${selectedModel} in cache: ${isInCache}`);
  };

  const removeNestedBlocks = async () => {
    const markdownContent = await mainEditor.blocksToMarkdownLossy(
      mainEditor.document
    );
    const editorWithoutNestedBlocks =
      await mainEditor.tryParseMarkdownToBlocks(markdownContent);
    mainEditor.replaceBlocks(mainEditor.document, editorWithoutNestedBlocks);
  };

  const ensureEngineLoaded = async (currentEngine: EngineType | null) => {
    if (currentEngine) {
      console.log('Engine loaded');
      return currentEngine;
    }

    console.log('Engine not loaded');
    try {
      const loadedEngine = await loadEngine();
      return loadedEngine;
    } catch (error) {
      setIsGenerating(false);
      console.log(error);
      setOutput('Could not load the model because ' + error);
      throw new Error('Could not load the model because ' + error);
    }
  };

  const translate = async () => {
    if (errorBrowserMessage) {
      return;
    }
    setCurrentProcess('translation');
    setShowSecondEditor(true);
    setIsGenerating(true);
    await removeNestedBlocks();
    const idBlock = await duplicateEditor(
      mainEditor,
      secondEditor,
      'Translation in progress…',
      'red'
    );

    for (const id of idBlock) {
      const mainBlock = mainEditor.getBlock(id);
      const secondBlock = secondEditor.getBlock(id);
      let text = '';
      if (mainBlock) {
        text = convertBlockToString(mainBlock);
      }
      const blocksForMarkdown = mainBlock ? [mainBlock] : [];
      const markdownText =
        await mainEditor.blocksToMarkdownLossy(blocksForMarkdown);
      if (text !== '') {
        const prompt =
          'Translate this text to English and keep the markdown formatting : ' +
          markdownText;
        await onSend(prompt, 'translation', async (translatedText: string) => {
          const translatedBlocks =
            await secondEditor.tryParseMarkdownToBlocks(translatedText);
          const translatedContent = translatedBlocks[0]?.content;
          if (secondBlock && translatedContent) {
            secondEditor.updateBlock(secondBlock, {
              content: translatedContent,
            });
          }
          // updateBlock(editorEnglish, id, translatedText, 'red');
        });
      }
    }
    setCurrentProcess(null);
    setIsGenerating(false);
    setOutput('');
  };

  const correction = async () => {
    if (errorBrowserMessage) {
      return;
    }
    setCurrentProcess('correction');
    setShowSecondEditor(true);
    setIsGenerating(true);
    await removeNestedBlocks();
    const idBlocks = await duplicateEditor(
      mainEditor,
      secondEditor,
      'Correction in progress…',
      'blue'
    );

    for (const id of idBlocks) {
      const block = mainEditor.getBlock(id);
      let text = '';
      if (block) {
        text = convertBlockToString(block);
      }
      if (text !== '') {
        await correctSingleBlock(
          block,
          secondEditor.getBlock(id),
          mainEditor,
          secondEditor,
          onSend
        );
      }
    }
    setIsGenerating(false);
    setCurrentProcess(null);
    setOutput('');
  };

  const summary = async () => {
    if (errorBrowserMessage) {
      return;
    }
    setCurrentProcess('summary');
    setIsGenerating(true);
    await removeNestedBlocks();
    const idBlocks = getEditorBlocks(mainEditor).reverse();
    let texte3 = '';
    let titre1 = '';
    let titre2 = '';
    let titre3 = '';
    let texte2 = '';
    let texte1 = '';
    let text = '';
    addBlock(
      mainEditor,
      idBlocks[idBlocks.length - 1],
      'Summary in progress…',
      'blue',
      'before',
      'New block summary'
    );

    for (const id of idBlocks) {
      const block = mainEditor.getBlock(id);
      if (block) {
        if (block.type === 'heading') {
          if (block.props.level === 3) {
            titre3 = convertBlockToString(block);
            if (texte3 !== '') {
              const prompt =
                ' Summarize this text if needed: ' +
                texte3 +
                "\nSachant que c'est une sous-partie de : " +
                titre3;
              const res = await onSend(prompt, 'summary', (text: string) => {
                updateBlock(
                  mainEditor,
                  'New block summary',
                  'Intermediate summary: ' + text,
                  'blue'
                );
              });
              texte2 += res;
            }
          } else if (block.props.level === 2) {
            if (texte2 + texte3 !== '') {
              titre2 = convertBlockToString(block);
              const prompt =
                ' Summarize this text if needed: ' +
                texte2 +
                texte3 +
                "\nSachant que c'est une sous-partie de : " +
                titre2;
              const res = await onSend(prompt, 'summary', (text: string) => {
                updateBlock(
                  mainEditor,
                  'New block summary',
                  'Intermediate summary: ' + text,
                  'blue'
                );
              });
              texte1 += res;

              texte2 = '';
              texte3 = '';
            }
          } else if (block.props.level === 1) {
            if (texte1 + texte2 + texte3 !== '') {
              titre1 = convertBlockToString(block);
              const prompt =
                ' Summarize this text if needed: ' +
                texte1 +
                texte2 +
                texte3 +
                "\nSachant que c'est une sous-partie de : " +
                titre1;
              const res = await onSend(prompt, 'summary', (text: string) => {
                updateBlock(
                  mainEditor,
                  'New block summary',
                  'Intermediate summary: ' + text,
                  'blue'
                );
              });
              text = res ?? '';

              texte1 = '';
              texte2 = '';
              texte3 = '';
            }
          }
        } else {
          texte3 = convertBlockToString(block) + texte3;
        }
      }
    }
    if (text + texte1 + texte2 + texte3 !== '') {
      const prompt =
        ' Summarize this text if needed: ' + text + texte1 + texte2 + texte3;
      const res = await onSend(prompt, 'summary', (text: string) => {
        updateBlock(mainEditor, 'New block summary', text, 'blue');
      });

      if (res) {
        const blocks = await mainEditor.tryParseMarkdownToBlocks(res);
        for (const block of blocks) {
          block.props.textColor = 'blue';
        }
        mainEditor.replaceBlocks(['New block summary'], blocks);
      }
    }
    setIsGenerating(false);
    setCurrentProcess(null);
    setOutput('');
  };

  const develop = async () => {
    if (errorBrowserMessage) {
      return;
    }
    setCurrentProcess('develop');
    setIsGenerating(true);
    await removeNestedBlocks();

    const idBlocks = getEditorBlocks(mainEditor);
    addBlock(
      mainEditor,
      idBlocks[idBlocks.length - 1],
      '',
      'blue',
      'after',
      'New block development'
    );
    let text = '';
    let res;
    for (const id of idBlocks) {
      const block = mainEditor.getBlock(id);
      if (block) {
        text += convertBlockToString(block);
      }
    }
    if (text !== '') {
      const prompt = 'Develop text from these elements: ' + text;
      res = await onSend(prompt, 'develop', async (text: string) => {
        updateBlock(mainEditor, 'New block development', text, 'blue');
      });
    }
    if (res) {
      const blocks = await mainEditor.tryParseMarkdownToBlocks(res);
      for (const block of blocks) {
        block.props.textColor = 'blue';
      }
      mainEditor.replaceBlocks(['New block development'], blocks);
    }
    setIsGenerating(false);
    setCurrentProcess(null);
    setOutput('');
  };

  // Page CRUD Functions
  const createNewPage = async () => {
    try {
      // Save current page if it exists
      if (currentPageId) {
        await saveCurrentPage();
      }

      // Clear editor for new page
      mainEditor.removeBlocks(mainEditor.document);
      setPageTitle('Untitled Page');

      const content = JSON.stringify(mainEditor.document);
      const extractedText = extractSearchableText(content);
      const searchableText = `Untitled Page ${extractedText}`.trim();

      const response = await fetch('http://localhost:4000/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Page',
          content,
          order: 0,
          isFavorite: false,
          searchableText,
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        setCurrentPageId(newPage.id);
        // Refresh sidebar to show new page
        sidebarRef.current?.refreshPages();
        // Auto-select the title field
        setTimeout(() => {
          const titleInput = document.querySelector(
            'input[placeholder="Page title..."]'
          ) as HTMLInputElement;
          if (titleInput) {
            titleInput.focus();
            titleInput.select();
          }
        }, 100);
      } else {
        console.error('Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const loadPageContent = async (pageId: string) => {
    try {
      // Save current page before loading new one
      if (currentPageId && currentPageId !== pageId) {
        await saveCurrentPage();
      }

      const response = await fetch(`http://localhost:4000/api/pages/${pageId}`);
      if (response.ok) {
        const page = await response.json();
        // Set the title from the loaded page
        setPageTitle(page.title || 'Untitled Page');
        // Parse content and load into editor
        const blocks = JSON.parse(page.content);

        // Replace all blocks with loaded content
        if (mainEditor.document.length > 0) {
          mainEditor.replaceBlocks(mainEditor.document, blocks);
        } else {
          mainEditor.insertBlocks(blocks, undefined, 'before');
        }

        setCurrentPageId(pageId);
      } else {
        console.error('Failed to load page');
      }
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  const saveCurrentPage = async () => {
    if (!currentPageId) return;

    try {
      const content = JSON.stringify(mainEditor.document);
      const extractedText = extractSearchableText(content);
      const searchableText = `${pageTitle} ${extractedText}`.trim();

      await fetch(`http://localhost:4000/api/pages/${currentPageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageTitle,
          content,
          searchableText,
        }),
      });
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!currentPageId) return;

    try {
      await fetch(`http://localhost:4000/api/pages/${currentPageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          content: JSON.stringify(mainEditor.document),
        }),
      });
      // Refresh sidebar to show updated title
      sidebarRef.current?.refreshPages();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/pages/${pageId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // If we deleted the current page, clear it
        if (currentPageId === pageId) {
          setCurrentPageId(undefined);
          mainEditor.removeBlocks(mainEditor.document);
          setPageTitle('Untitled Page');
        }
        // Refresh sidebar
        sidebarRef.current?.refreshPages();
      } else {
        console.error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleCreateSubpage = async (parentId: string) => {
    try {
      // Save current page if it exists
      if (currentPageId) {
        await saveCurrentPage();
      }

      // Clear editor for new page
      mainEditor.removeBlocks(mainEditor.document);
      setPageTitle('Untitled Page');

      // Fetch parent page to get its order and determine next order
      const parentResponse = await fetch(
        `http://localhost:4000/api/pages/${parentId}`
      );
      const parentPage = await parentResponse.json();

      const content = JSON.stringify(mainEditor.document);
      const extractedText = extractSearchableText(content);
      const searchableText = `Untitled Page ${extractedText}`.trim();

      const response = await fetch('http://localhost:4000/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Page',
          content,
          parentId: parentId,
          order: parentPage.order + 1,
          isFavorite: false,
          tags: '[]',
          searchableText,
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        setCurrentPageId(newPage.id);
        // Refresh sidebar to show new subpage
        sidebarRef.current?.refreshPages();
        // Auto-select the title field
        setTimeout(() => {
          const titleInput = document.querySelector(
            'input[placeholder="Page title..."]'
          ) as HTMLInputElement;
          if (titleInput) {
            titleInput.focus();
            titleInput.select();
          }
        }, 100);
      } else {
        console.error('Failed to create subpage');
      }
    } catch (error) {
      console.error('Error creating subpage:', error);
    }
  };

  const handleReorderPages = async (
    pageId: string,
    newOrder: number,
    newParentId: string | null
  ) => {
    try {
      // Get the dragged page to check its current parent and order
      const draggedPageResponse = await fetch(
        `http://localhost:4000/api/pages/${pageId}`
      );
      if (!draggedPageResponse.ok) {
        console.error('Failed to get dragged page');
        return;
      }
      const draggedPage = await draggedPageResponse.json();
      const oldParentId = draggedPage.parentId;
      const oldOrder = draggedPage.order;

      // Get all pages to find siblings
      const allPagesResponse = await fetch('http://localhost:4000/api/pages');
      if (!allPagesResponse.ok) {
        return;
      }
      const allPages = await allPagesResponse.json();

      // Get siblings at the OLD level
      const oldSiblings = allPages.filter(
        (p: any) =>
          p.parentId === oldParentId && p.id !== pageId && p.order > oldOrder
      );

      // Get siblings at the NEW level
      const newSiblings = allPages.filter(
        (p: any) =>
          p.parentId === newParentId && p.id !== pageId && p.order >= newOrder
      );

      // Step 1: Close the gap at old position (shift old siblings down by 1)
      for (const sibling of oldSiblings) {
        await fetch(`http://localhost:4000/api/pages/${sibling.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: sibling.order - 1 }),
        });
      }

      // Step 2: Make room at new position (shift new siblings up by 1)
      for (const sibling of newSiblings) {
        await fetch(`http://localhost:4000/api/pages/${sibling.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: sibling.order + 1 }),
        });
      }

      // Step 3: Update the dragged page to its new position
      const response = await fetch(
        `http://localhost:4000/api/pages/${pageId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: newOrder,
            parentId: newParentId,
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed to reorder page');
      }
    } catch (error) {
      console.error('Error reordering page:', error);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        ref={sidebarRef}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPageId={currentPageId}
        onPageSelect={loadPageContent}
        onNewPage={createNewPage}
        onDeletePage={handleDeletePage}
        onNewSubpage={handleCreateSubpage}
        onReorderPages={handleReorderPages}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onTranslate={translate}
          onCorrect={correction}
          onSummarize={summary}
          onDevelop={develop}
          onClear={reset}
          onStop={onStop}
          isGenerating={isGenerating}
          isFetching={isFetching}
          currentProcess={currentProccess}
        />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex min-w-0">
            <div className="flex-1 bg-white min-w-0 overflow-auto">
              {/* Title Input Field */}
              <input
                type="text"
                value={pageTitle}
                onChange={e => {
                  setPageTitle(e.target.value);
                }}
                onBlur={() => {
                  if (currentPageId) {
                    handleTitleChange(pageTitle);
                  }
                }}
                placeholder="Untitled Page"
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  border: 'none',
                  outline: 'none',
                  padding: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'transparent',
                }}
              />
              <BlockNoteView
                editor={mainEditor}
                className="h-full w-full"
                formattingToolbar={false}
              >
                <FormattingToolbarController
                  formattingToolbar={() => (
                    <CustomFormattingToolbar
                      onSend={onSend}
                      isGenerating={isGenerating}
                      setIsGenerating={setIsGenerating}
                      currentProccess={currentProccess}
                      setCurrentProcess={setCurrentProcess}
                      isFetching={isFetching}
                      setOutput={setOutput}
                    />
                  )}
                />
              </BlockNoteView>
            </div>

            {showSecondEditor && (
              <div className="flex-1 bg-white border-l border-gray-200 min-w-0 overflow-auto">
                <BlockNoteView
                  editor={secondEditor}
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        </main>

        <Footer
          progress={progress}
          progressPercentage={progressPercentage}
          output={output}
          error={error}
          errorBrowserMessage={errorBrowserMessage}
          runtimeStats={runtimeStats}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};
export default App;

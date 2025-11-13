'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FontSelector } from '@/components/FontSelector';
import { ColorPicker } from '@/components/ColorPicker';
import { PreviewArea } from '@/components/PreviewArea';
import { fetchGoogleFonts, loadGoogleFont } from '@/lib/google-fonts';
import { Download } from 'lucide-react';

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
}

export default function Home() {
  const [text, setText] = useState('「プレビュー文字です。」');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fontList = await fetchGoogleFonts();
        setFonts(fontList);
        if (fontList.length > 0) {
          setSelectedFont(fontList[1084].family);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('フォントの読み込みに失敗しました:', error);
        setIsLoading(false);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    if (selectedFont) {
      loadGoogleFont(selectedFont);
    }
  }, [selectedFont]);

  const downloadSVG = () => {
    if (!previewRef.current || !selectedFont) return;

    const svgElement = previewRef.current.querySelector('svg');
    if (!svgElement) return;

    // SVGのクローンを作成
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;

    // すべてのテキスト要素を取得してサイズを計算
    const textElements = clonedSvg.querySelectorAll('text');
    if (textElements.length > 0) {
      try {
        // すべてのテキスト要素のバウンディングボックスを計算
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        textElements.forEach((textEl) => {
          const bbox = textEl.getBBox();
          minX = Math.min(minX, bbox.x);
          minY = Math.min(minY, bbox.y);
          maxX = Math.max(maxX, bbox.x + bbox.width);
          maxY = Math.max(maxY, bbox.y + bbox.height);
        });

        const width = maxX - minX;
        const height = maxY - minY;

        if (width > 0 && height > 0) {
          const padding = 40;
          clonedSvg.setAttribute('width', String(width + padding));
          clonedSvg.setAttribute('height', String(height + padding));
          clonedSvg.setAttribute(
            'viewBox',
            `${minX - padding / 2} ${minY - padding / 2} ${width + padding} ${height + padding}`
          );
        }
      } catch (error) {
        // getBBox()が失敗した場合はデフォルトサイズを使用
        console.warn('getBBox() failed, using default size:', error);
        clonedSvg.setAttribute('width', '400');
        clonedSvg.setAttribute('height', '400');
        clonedSvg.setAttribute('viewBox', '0 0 400 400');
      }
    }

    // フォントを埋め込むためのスタイルを追加
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = `@import url('https://fonts.googleapis.com/css2?family=${selectedFont.replace(/\s+/g, '+')}:wght@400&display=swap');`;
    const defs =
      clonedSvg.querySelector('defs') ||
      document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (!clonedSvg.querySelector('defs')) {
      clonedSvg.insertBefore(defs, clonedSvg.firstChild);
    }
    defs.appendChild(styleElement);

    // SVGをBlobに変換
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clonedSvg);

    // SVGをBlobに変換
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // ダウンロード
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fontSize}px-${selectedFont}-${text}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-white p-4 sm:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-black'>Tate</h1>
        <p className='text-gray-600 mb-4'>文字列を縦に表示するSVGを生成するWebアプリ</p>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
          {/* 設定パネル */}
          <Card className='bg-white border-gray-300'>
            <CardHeader>
              <CardTitle className='text-black'>設定</CardTitle>
              <CardDescription className='text-gray-600'>
                テキスト、フォント、サイズ、色を設定してください
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* テキスト入力 */}
              <div className='space-y-2'>
                <Label htmlFor='text' className='text-black'>
                  テキスト
                </Label>
                <Input
                  id='text'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='テキストを入力'
                  className='border-gray-300 text-black bg-white'
                />
              </div>

              {/* フォントサイズ */}
              <div className='space-y-2'>
                <Label htmlFor='fontSize' className='text-black'>
                  フォントサイズ (px)
                </Label>
                <Input
                  id='fontSize'
                  type='number'
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min='1'
                  className='border-gray-300 text-black bg-white'
                />
              </div>

              {/* フォント選択 */}
              <div className='space-y-2'>
                <Label className='text-black'>フォント</Label>
                {isLoading ? (
                  <div className='text-gray-600 text-sm'>読み込み中...</div>
                ) : (
                  <FontSelector
                    fonts={fonts}
                    value={selectedFont}
                    onValueChange={setSelectedFont}
                  />
                )}
              </div>

              {/* カラー選択 */}
              <div className='space-y-2'>
                <Label className='text-black'>カラー</Label>
                <ColorPicker value={color} onChange={setColor} />
              </div>

              {/* ダウンロードボタン */}
              <Button
                onClick={downloadSVG}
                disabled={!text || !selectedFont}
                className='w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                <Download className='mr-2 h-4 w-4' />
                SVGをダウンロード
              </Button>
            </CardContent>
          </Card>

          {/* プレビューエリア */}
          <Card className='bg-white border-gray-300'>
            <CardHeader>
              <CardTitle className='text-black'>プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <PreviewArea
                ref={previewRef}
                text={text}
                fontSize={fontSize}
                color={color}
                fontFamily={selectedFont}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

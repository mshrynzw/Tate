'use client';

import { forwardRef } from 'react';

interface PreviewAreaProps {
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export const PreviewArea = forwardRef<HTMLDivElement, PreviewAreaProps>(
  ({ text, fontSize, color, fontFamily }, ref) => {
    const displayText = text || 'プレビュー';
    const characters = Array.from(displayText);
    
    // 文字の種類を判定する関数
    const getCharType = (char: string): 'normal' | 'punctuation' | 'small' | 'symbol' | 'symbol_under' => {
      // 句読点（右上に配置）
      if (char === '、' || char === '。' || char === '，' || char === '．' || 
          char === '・' || char === '：' || char === '；') {
        return 'punctuation';
      }
      
      // 小文字（右下に配置）
      // ひらがなの小文字: ぁ-ぉ、ゃ-ょ、っ
      if (/^[ぁぃぅぇぉゃゅょっ]$/.test(char)) {
        return 'small';
      }
      // カタカナの小文字: ァ-ォ、ャ-ョ、ッ
      if (/^[ァィゥェォャュョッ]$/.test(char)) {
        return 'small';
      }
      // 記号
      if (/^[「『＜〈≪《（［｛｜ー＝～]$/.test(char)) {
        return 'symbol';
      }
      // 記号
      if (/^[」』＞〉≫》）］｝]$/.test(char)) {
        return 'symbol_under';
      }
      
      return 'normal';
    };
    
    // 通常の文字と記号をカウント（句読点と小文字は行を取らない）
    const lineHeight = fontSize * 1.2;
    const svgWidth = 400;
    const centerX = svgWidth / 2;
    
    // まず、実際に必要な高さを計算
    let totalHeight = 0;
    characters.forEach((char) => {
      const charType = getCharType(char);
      if (charType === 'normal') {
        totalHeight += lineHeight;
      } else if (charType === 'symbol') {
        totalHeight += lineHeight + fontSize * 0.5;
      }
      // 句読点と小文字は行を取らないので高さに加算しない
    });
    
    // 最小高さを確保し、実際の高さを使用
    const svgHeight = Math.max(400, totalHeight + fontSize);
    
    // 文字とその位置を計算
    let currentY = (svgHeight - totalHeight) / 2;
    const textElements: Array<{ char: string; x: number; y: number; type: 'normal' | 'punctuation' | 'small' | 'symbol' | 'symbol_under' }> = [];
    
    characters.forEach((char) => {
      const charType = getCharType(char);
      
      if (charType === 'punctuation') {
        // 句読点は前の文字の右上に配置
        if (textElements.length > 0) {
          // 前の通常文字を探す
          let baseElement = textElements[textElements.length - 1];
          let searchIndex = textElements.length - 1;
          
          while (baseElement && baseElement.type !== 'normal' && searchIndex > 0) {
            searchIndex--;
            baseElement = textElements[searchIndex];
          }
          
          if (baseElement && baseElement.type === 'normal') {
            // 前の文字の右上に配置
            // 前の文字の中心から、右に文字サイズの約50%（文字の右端）、上に文字サイズの約50%（文字の上端）移動
            // さらに少し外側に配置して、上の文字と重ならないようにする
            textElements.push({
              char,
              x: baseElement.x + fontSize * 0.5,
              y: baseElement.y + fontSize * 0.5,
              type: 'punctuation',
            });
          } else {
            // フォールバック：通常の位置に配置
            textElements.push({
              char,
              x: centerX + fontSize * 0.5,
              y: currentY + fontSize * 0.5,
              type: 'punctuation',
            });
          }
        } else {
          // 最初の文字が句読点の場合
          textElements.push({
            char,
            x: centerX + fontSize * 0.5,
            y: currentY + fontSize * 0.5,
            type: 'punctuation',
          });
        }
      } else if (charType === 'small') {
        // 小文字は前の文字の右下に配置
        if (textElements.length > 0) {
          // 前の通常文字を探す
          let baseElement = textElements[textElements.length - 1];
          let searchIndex = textElements.length - 1;
          
          while (baseElement && baseElement.type !== 'normal' && searchIndex > 0) {
            searchIndex--;
            baseElement = textElements[searchIndex];
          }
          
          if (baseElement && baseElement.type === 'normal') {
            // 前の文字の右下に配置
            // 前の文字の中心から、右に文字サイズの約25%、下に文字サイズの約25%移動
            textElements.push({
              char,
              x: baseElement.x + fontSize * 0.5,
              y: baseElement.y + fontSize * 0.75,
              type: 'small',
            });
          } else {
            // フォールバック：通常の位置に配置
            textElements.push({
              char,
              x: centerX + fontSize * 0.5,
              y: currentY + fontSize * 0.75,
              type: 'small',
            });
          }
        } else {
          // 最初の文字が小文字の場合
          textElements.push({
            char,
            x: centerX + fontSize * 0.5,
            y: currentY + fontSize * 0.75,
            type: 'small',
          });
        }
      } else if (charType === 'symbol') {
        // 記号は通常の文字と同じ位置に配置し、時計回りに90度回転
        textElements.push({
          char,
          x: centerX,
          y: currentY + fontSize * 0.5,
          type: 'symbol',
        });
        // 記号の回転を考慮して、次の文字の位置を調整
        currentY += lineHeight + fontSize * 0.5;
      } else if (charType === 'symbol_under') {
        // 記号は通常の文字と同じ位置に配置し、時計回りに90度回転
        textElements.push({
          char,
          x: centerX,
          y: currentY,
          type: 'symbol_under',
        });
        currentY += lineHeight + fontSize * 0.5;
      } else {
        // 通常の文字は縦に並べる
        textElements.push({
          char,
          x: centerX,
          y: currentY,
          type: 'normal',
        });
        currentY += lineHeight;
      }
    });

    return (
      <div
        ref={ref}
        className="w-full min-h-[400px] flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-8"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
          <defs>
            <style>
              {fontFamily && `@import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400&display=swap');`}
            </style>
          </defs>
          <g>
            {textElements.map((element, index) => (
              <text
                key={index}
                x={element.x}
                y={element.y}
                fontSize={element.type === 'punctuation' ? fontSize * 0.8 : fontSize}
                fill={color}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={element.type === 'symbol' ? `rotate(90, ${element.x}, ${element.y})` : element.type === 'symbol_under' ? `rotate(90, ${element.x}, ${element.y})` : undefined}
                style={{ fontFamily: fontFamily || 'sans-serif' }}
              >
                {element.char}
              </text>
            ))}
          </g>
        </svg>
      </div>
    );
  }
);

PreviewArea.displayName = 'PreviewArea';


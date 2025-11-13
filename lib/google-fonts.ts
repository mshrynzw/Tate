const GOOGLE_FONTS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || '';
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category?: string;
  version?: string;
  lastModified?: string;
  files?: Record<string, string>;
}

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  try {
    const url = GOOGLE_FONTS_API_KEY
      ? `${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}`
      : GOOGLE_FONTS_API_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('フォントの取得に失敗しました');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Google Fonts API エラー:', error);
    // フォールバック: よく使われるフォントのリスト
    return [
      { family: 'Noto Sans JP', variants: ['400'], subsets: ['latin'] },
      { family: 'Roboto', variants: ['400'], subsets: ['latin'] },
      { family: 'Open Sans', variants: ['400'], subsets: ['latin'] },
      { family: 'Lato', variants: ['400'], subsets: ['latin'] },
      { family: 'Montserrat', variants: ['400'], subsets: ['latin'] },
    ];
  }
}

export function loadGoogleFont(fontFamily: string): void {
  if (typeof window === 'undefined') return;

  // 既に読み込まれているかチェック
  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
  if (existingLink) return;

  // Google Fontsのリンクを動的に追加
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

import { TateClient } from '@/components/TateClient';

export default function Home() {
  return (
    <div className='min-h-screen bg-white p-4 sm:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-black'>Tate</h1>
        <p className='text-gray-600 mb-4'>文字列を縦に表示するSVGを生成するWebアプリ</p>
        <TateClient />
      </div>
    </div>
  );
}

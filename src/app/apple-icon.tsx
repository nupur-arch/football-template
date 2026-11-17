import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#123c2c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 112, height: 112, display: 'flex' }}>
        <div style={{ position: 'absolute', left: 4, top: 18, width: 64, height: 22, background: '#d5f86c', display: 'flex' }} />
        <div style={{ position: 'absolute', left: 76, top: 29, width: 32, height: 11, background: '#ffffff', display: 'flex' }} />
        <div style={{ position: 'absolute', left: 42, top: 29, width: 26, height: 74, background: '#ffffff', display: 'flex' }} />
        <div style={{ position: 'absolute', left: 34, top: 14, width: 40, height: 22, background: '#d5f86c', display: 'flex' }} />
      </div>
    </div>,
    { ...size },
  );
}

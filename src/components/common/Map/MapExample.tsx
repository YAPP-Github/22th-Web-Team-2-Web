import { BaseIcon } from '@/asset/icons';
import LoadingIndicator from '@/components/common/Button/LoadingIndicator';
import { H4 } from '@/components/common/Typography';
import { palette } from '@/styles/color';
import dynamic from 'next/dynamic';
const DangleMap = dynamic(() => import('./DangleMap'), {
  loading: () => <LoadingIndicator color="primary" />
});

export default function MapExample() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          columnGap: 10,
          paddingTop: 10,
          padding: 20,
          background: palette.white
        }}
      >
        <BaseIcon />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%'
          }}
        >
          <H4>주소</H4>

          <DangleMap latitude={33.450701} longitude={126.570667} />
        </div>
      </div>
    </>
  );
}

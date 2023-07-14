'use client';
import { useEffect } from 'react';
import * as headerStyles from '@/components/common/Header/Header.css';

import * as styles from './ContainerWithStickyHeader.css';
import useHeader, { UseHeaderProps } from '@/hooks/useHeader';
import { variants } from '../Typography/Typography.css';
import { UploadIcon } from '@/asset/icons';
import useToast from '@/hooks/useToast';

//TOOD : uploadIcon 구현
const ShareButton = () => {
  const toast = useToast();
  return <UploadIcon onClick={() => toast('공유하기버튼 클릭됨')} />;
};

interface StickyTitleProps {
  headerProps: UseHeaderProps;
}

export default function ContainerWithStickyHeader({
  headerProps,
  children
}: React.PropsWithChildren<StickyTitleProps>) {
  const setHeader = useHeader({
    ...headerProps,
    RightSideComponent: ShareButton
  });

  useEffect(() => {
    const headerElem = document.getElementsByClassName(
      headerStyles.container
    )[0];
    const titleElem = headerElem?.getElementsByClassName(variants.h4)[0];
    const containerElem = document.getElementsByClassName(styles.container)[0];

    if (!(headerElem && containerElem && titleElem)) {
      throw new Error(`정의되지 않은 html 엘리먼트가 있습니다.`);
    }

    /** header에 sticky 스타일 class 추가 */
    headerElem.classList.add(styles.sticky);

    /** container에 height가 있을때만 title hidden*/
    if (containerElem.getBoundingClientRect().height !== 0) {
      titleElem.classList.add(styles.hidden);
    }

    const titleFadeInteractionControl = () => {
      const containerRect = containerElem.getBoundingClientRect();

      if (containerRect.top <= 0) {
        titleElem.classList.add(styles.fadeIn);
        titleElem.classList.remove(styles.hidden);
      } else {
        titleElem.classList.remove(styles.fadeIn);
        titleElem.classList.add(styles.hidden);
      }
    };

    window.addEventListener('scroll', titleFadeInteractionControl);
    return () =>
      window.removeEventListener('scroll', titleFadeInteractionControl);
  }, [setHeader]);
  return <div className={styles.container}>{children}</div>;
}
